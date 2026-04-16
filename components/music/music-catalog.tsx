'use client'

import { useState, useMemo } from 'react'
import { SongCard } from '@/components/song-card'
import { Button } from '@/components/ui/button'
import type { Song, Genre } from '@/lib/types'

const genres: string[] = ['All', 'Electronic', 'Synthwave', 'Progressive House', 'Techno', 'Ambient', 'Drum and Bass', 'Trance', 'Chillout']
const sortOptions = [
  { value: 'new', label: 'New Releases' },
  { value: 'popular', label: 'Most Played' },
]

interface MusicCatalogProps {
  songs: Song[]
}

export function MusicCatalog({ songs: initialSongs }: MusicCatalogProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('All')
  const [sortBy, setSortBy] = useState('new')

  // Use the songs from database directly
  const songs = initialSongs

  const filteredAndSortedSongs = useMemo(() => {
    let result = [...songs]

    // Filter by genre
    if (selectedGenre !== 'All') {
      result = result.filter(song => song.genre === selectedGenre)
    }

    // Sort
    if (sortBy === 'new') {
      result.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.play_count - a.play_count)
    }

    return result
  }, [songs, selectedGenre, sortBy])

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          {/* Genre filter */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Songs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredAndSortedSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>

        {/* Empty state */}
        {filteredAndSortedSongs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No songs found for this filter.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSelectedGenre('All')}
            >
              Show All Songs
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
