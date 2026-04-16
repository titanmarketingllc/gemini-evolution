'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Download, ArrowLeft, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GenreBadge } from '@/components/genre-badge'
import { ShareButton } from '@/components/share-button'
import { AudioPlayer } from '@/components/audio/audio-player'
import { SongCard } from '@/components/song-card'
import { useSignupModal } from '@/components/signup/signup-modal-provider'
import { formatNumber, formatDuration } from '@/lib/utils'
import { toast } from 'sonner'
import type { Song } from '@/lib/types'

interface SongDetailProps {
  song: Song
  relatedSongs: Song[]
}

export function SongDetail({ song, relatedSongs }: SongDetailProps) {
  const { user, openModal } = useSignupModal()

  const handleDownload = async () => {
    if (!user) {
      openModal()
      return
    }

    try {
      const response = await fetch('/api/songs/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: song.id }),
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const { downloadUrl } = await response.json()
      window.open(downloadUrl, '_blank')
      toast.success(`Downloading "${song.title}"`)
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thegeminievolution.com'}/music/${song.slug}`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <Link 
            href="/music"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Music
          </Link>
        </div>
      </section>

      {/* Song detail */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Artwork */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card">
              {song.cover_image_url ? (
                <Image
                  src={song.cover_image_url}
                  alt={song.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="font-serif text-6xl text-primary/50">
                    {song.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <GenreBadge genre={song.genre} className="mb-4" />
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  {song.title}
                </h1>
                
                {song.description && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {song.description}
                  </p>
                )}

                <div className="flex items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Headphones className="w-5 h-5" />
                    {formatNumber(song.play_count)} plays
                  </span>
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {formatNumber(song.download_count)} downloads
                  </span>
                  <span>{formatDuration(song.duration)}</span>
                </div>
              </div>

              {/* Audio player */}
              <Card className="p-6 bg-card border-border mb-6">
                <AudioPlayer song={song} />
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Free
                </Button>
                <ShareButton
                  url={shareUrl}
                  title={`${song.title} by Gemini Evolution`}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-6"
                />
              </div>

              {!user && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Download requires a free account.{' '}
                  <button 
                    onClick={() => openModal()}
                    className="text-primary hover:underline"
                  >
                    Sign up in 30 seconds
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related songs */}
      {relatedSongs.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8">
              More {song.genre} Songs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSongs.map((relatedSong) => (
                <SongCard key={relatedSong.id} song={relatedSong} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
