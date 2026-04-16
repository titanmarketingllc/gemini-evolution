'use client'

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { StickyPlayer } from './sticky-player'
import type { Song } from '@/lib/types'

interface AudioPlayerContextType {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  playSong: (song: Song) => void
  pauseSong: () => void
  togglePlay: () => void
  seekTo: (time: number) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null)

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider')
  }
  return context
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.crossOrigin = 'anonymous'
    
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
    }
  }, [])

  const playSong = useCallback(async (song: Song) => {
    const audio = audioRef.current
    if (!audio) return

    // If same song, just resume
    if (currentSong?.id === song.id) {
      audio.play()
      setIsPlaying(true)
      return
    }

    // New song
    setCurrentSong(song)
    setCurrentTime(0)
    audio.src = song.audio_url
    
    try {
      await audio.play()
      setIsPlaying(true)
      
      // Log play event (fire and forget)
      fetch('/api/songs/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: song.id }),
      }).catch(() => {})
    } catch (error) {
      console.error('Failed to play audio:', error)
    }
  }, [currentSong])

  const pauseSong = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseSong()
    } else if (currentSong) {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }, [isPlaying, currentSong, pauseSong])

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  return (
    <AudioPlayerContext.Provider value={{
      currentSong,
      isPlaying,
      currentTime,
      duration,
      playSong,
      pauseSong,
      togglePlay,
      seekTo,
    }}>
      {children}
      {currentSong && <StickyPlayer />}
    </AudioPlayerContext.Provider>
  )
}
