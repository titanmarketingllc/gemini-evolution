import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SongDetail } from '@/components/music/song-detail'
import type { Song } from '@/lib/types'
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getSongBySlug(slug: string): Promise<Song | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('songs')
    .select('*')
    .eq('slug', slug)
    .single()

  return data as Song | null
}

async function getRelatedSongs(genre: string, currentSlug: string): Promise<Song[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('songs')
    .select('*')
    .eq('genre', genre)
    .neq('slug', currentSlug)
    .limit(3)

  return (data as Song[]) || []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const song = await getSongBySlug(slug)

  if (!song) {
    return {
      title: 'Song Not Found | Gemini Evolution',
    }
  }

  return {
    title: `${song.title} by Gemini Evolution | Free Download`,
    description: song.description || `Listen to ${song.title} by Gemini Evolution. Free to stream and download.`,
    openGraph: {
      title: `${song.title} by Gemini Evolution | Free Download`,
      description: song.description || `Listen to ${song.title} by Gemini Evolution. Free to stream and download.`,
      images: song.artwork_url ? [song.artwork_url] : ['/images/og-image.jpg'],
    },
  }
}

export async function generateStaticParams() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('songs')
    .select('slug')

  return (data || []).map((song) => ({
    slug: song.slug,
  }))
}

export default async function SongPage({ params }: PageProps) {
  const { slug } = await params
  const song = await getSongBySlug(slug)

  if (!song) {
    notFound()
  }

  const relatedSongs = await getRelatedSongs(song.genre, song.slug)

  return <SongDetail song={song} relatedSongs={relatedSongs} />
}
