'use client'

import Link from 'next/link'
import { SongCard } from '@/components/song-card'
import { Button } from '@/components/ui/button'
import { useSignupModal } from '@/components/signup/signup-modal-provider'
import type { Song } from '@/lib/types'

interface FeaturedMusicSectionProps {
  songs: Song[]
}

export function FeaturedMusicSection({ songs }: FeaturedMusicSectionProps) {
  const { user, openModal } = useSignupModal()

  // Fallback songs if none from database
  const displaySongs = songs.length > 0 ? songs : [
    {
      id: '1',
      title: 'Cosmic Drift',
      slug: 'cosmic-drift',
      genre: 'Electronic',
      description: 'An ethereal journey through the cosmos',
      duration: 245,
      cover_image_url: '/images/songs/cosmic-drift.jpg',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      play_count: 15420,
      download_count: 456,
      is_featured: true,
      is_downloadable: true,
      lyrics: null,
      credits: null,
      release_date: '2024-01-15',
      created_at: '',
      updated_at: '',
    },
    {
      id: '2',
      title: 'Neon Dreams',
      slug: 'neon-dreams',
      genre: 'Synthwave',
      description: 'A synthwave anthem for late-night city vibes',
      duration: 198,
      cover_image_url: '/images/songs/neon-dreams.jpg',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      play_count: 12350,
      download_count: 892,
      is_featured: true,
      is_downloadable: true,
      lyrics: null,
      credits: null,
      release_date: '2024-02-20',
      created_at: '',
      updated_at: '',
    },
    {
      id: '3',
      title: 'Digital Sunrise',
      slug: 'digital-sunrise',
      genre: 'Progressive House',
      description: 'An uplifting progressive house journey',
      duration: 312,
      cover_image_url: '/images/songs/digital-sunrise.jpg',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      play_count: 9870,
      download_count: 623,
      is_featured: true,
      is_downloadable: true,
      lyrics: null,
      credits: null,
      release_date: '2024-03-10',
      created_at: '',
      updated_at: '',
    },
  ]

  return (
    <section id="music-preview" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Start Listening — Always Free
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every song is free to stream, and free accounts unlock unlimited downloads.
          </p>
        </div>

        {/* Featured songs */}
        <div className="space-y-6 mb-12">
          {displaySongs.map((song) => (
            <SongCard key={song.id} song={song} variant="featured" />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          {!user && (
            <p className="text-muted-foreground mb-4">
              Want to download? It&apos;s free — just{' '}
              <button 
                onClick={() => openModal()}
                className="text-primary hover:underline font-medium"
              >
                create an account
              </button>
              .
            </p>
          )}
          <Link href="/music">
            <Button variant="outline" size="lg" className="rounded-full">
              View All Music
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
