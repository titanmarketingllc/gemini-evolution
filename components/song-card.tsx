'use client'

import Image from 'next/image'
import { Play, Download, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GenreBadge } from '@/components/genre-badge'
import { ShareButton } from '@/components/share-button'
import { AudioPlayer } from '@/components/audio/audio-player'
import { useSignupModal } from '@/components/signup/signup-modal-provider'
import { formatNumber, formatDuration } from '@/lib/utils'
import { toast } from 'sonner'
import type { Song } from '@/lib/types'

interface SongCardProps {
  song: Song
  variant?: 'default' | 'featured'
}

export function SongCard({ song, variant = 'default' }: SongCardProps) {
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
      
      // Open download URL in new tab
      window.open(downloadUrl, '_blank')
      toast.success(`Downloading "${song.title}"`)
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thegeminievolution.com'}/music/${song.slug}`

  if (variant === 'featured') {
    return (
      <Card className="bg-card border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Artwork */}
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
            {song.cover_image_url ? (
              <Image
                src={song.cover_image_url}
                alt={song.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {song.title}
                </h3>
                <GenreBadge genre={song.genre} />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Headphones className="h-4 w-4" />
                  {formatNumber(song.play_count)}
                </span>
                <span>{formatDuration(song.duration)}</span>
              </div>
            </div>

            {/* Player and actions */}
            <div className="space-y-4">
              <AudioPlayer song={song} />
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <ShareButton
                  url={shareUrl}
                  title={`${song.title} by Gemini Evolution`}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="bg-card border-border overflow-hidden group">
      {/* Artwork */}
      <div className="relative aspect-square">
        {song.cover_image_url ? (
          <Image
            src={song.cover_image_url}
            alt={song.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <AudioPlayer song={song} compact />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-foreground truncate">
            {song.title}
          </h3>
          <GenreBadge genre={song.genre} className="flex-shrink-0" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            {formatNumber(song.play_count)}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {formatNumber(song.download_count)}
          </span>
          <span>{formatDuration(song.duration)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex-1 rounded-full text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <ShareButton
            url={shareUrl}
            title={`${song.title} by Gemini Evolution`}
            variant="outline"
            size="sm"
            className="rounded-full"
          />
        </div>
      </div>
    </Card>
  )
}
