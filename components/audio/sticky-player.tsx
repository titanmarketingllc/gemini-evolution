'use client'

import Image from 'next/image'
import { Play, Pause, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudioPlayer } from './audio-player-provider'
import { formatDuration } from '@/lib/utils'

export function StickyPlayer() {
  const { currentSong, isPlaying, currentTime, duration, togglePlay, seekTo } = useAudioPlayer()

  if (!currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border pb-safe md:pb-0">
      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              {currentSong.artwork_url ? (
                <Image
                  src={currentSong.artwork_url}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                Gemini Evolution
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {formatDuration(currentTime)}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>

            <span className="text-xs text-muted-foreground hidden sm:block">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Seek slider (desktop only) */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="hidden md:block w-32 lg:w-48 audio-progress"
          />
        </div>
      </div>
    </div>
  )
}
