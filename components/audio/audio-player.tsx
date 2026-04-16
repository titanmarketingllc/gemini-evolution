'use client'

import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudioPlayer } from './audio-player-provider'
import { formatDuration } from '@/lib/utils'
import type { Song } from '@/lib/types'

interface AudioPlayerProps {
  song: Song
  compact?: boolean
}

export function AudioPlayer({ song, compact = false }: AudioPlayerProps) {
  const { currentSong, isPlaying, currentTime, duration, playSong, pauseSong, seekTo } = useAudioPlayer()
  
  const isCurrentSong = currentSong?.id === song.id
  const isThisPlaying = isCurrentSong && isPlaying
  const progress = isCurrentSong && duration > 0 ? (currentTime / duration) * 100 : 0

  const handlePlayPause = () => {
    if (isThisPlaying) {
      pauseSong()
    } else {
      playSong(song)
    }
  }

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePlayPause}
        className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isThisPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
        >
          {isThisPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>

        <div className="flex-1 space-y-1">
          {/* Progress bar */}
          <div 
            className="h-1.5 bg-secondary rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              if (!isCurrentSong) return
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percentage = x / rect.width
              seekTo(duration * percentage)
            }}
          >
            <div 
              className="h-full bg-primary transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time display */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{isCurrentSong ? formatDuration(currentTime) : '0:00'}</span>
            <span>{formatDuration(song.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
