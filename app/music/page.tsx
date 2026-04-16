import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MusicCatalog } from '@/components/music/music-catalog'
import type { Song } from '@/lib/types'

export const metadata: Metadata = {
  title: 'All Music | Gemini Evolution — Free to Stream & Download',
  description: 'Browse the full music catalog from Gemini Evolution. Every song is free to stream and download.',
  openGraph: {
    title: 'All Music | Gemini Evolution — Free to Stream & Download',
    description: 'Browse the full music catalog from Gemini Evolution. Every song is free to stream and download.',
  },
}

async function getAllSongs(): Promise<Song[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('songs')
    .select('*')
    .order('release_date', { ascending: false })

  return (data as Song[]) || []
}

export default async function MusicPage() {
  const songs = await getAllSongs()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            All Music
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free to stream, free to download. Every song, every time.
          </p>
        </div>
      </section>

      {/* Music catalog */}
      <MusicCatalog songs={songs} />
    </div>
  )
}
