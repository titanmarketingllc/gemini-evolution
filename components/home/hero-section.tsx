'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { StatCounter } from '@/components/stat-counter'
import { useSignupModal } from '@/components/signup/signup-modal-provider'
import type { SiteStats } from '@/lib/types'

interface HeroSectionProps {
  stats: SiteStats
}

export function HeroSection({ stats }: HeroSectionProps) {
  const { openModal } = useSignupModal()
  const starFieldRef = useRef<HTMLDivElement>(null)

  // Generate star positions on mount
  useEffect(() => {
    if (!starFieldRef.current) return
    
    const starField = starFieldRef.current
    const stars = []
    
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 3}s`
      star.style.opacity = `${0.2 + Math.random() * 0.8}`
      stars.push(star)
      starField.appendChild(star)
    }

    return () => {
      stars.forEach(star => star.remove())
    }
  }, [])

  const scrollToMusic = () => {
    document.getElementById('music-preview')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080810] via-[#0a0a18] to-[#080810]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.1),transparent_50%)]" />
      
      {/* Star field */}
      <div ref={starFieldRef} className="star-field" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        {/* Eyebrow */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Table Rock Studios Presents
        </p>

        {/* Main headline */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground mb-6 text-balance">
          GEMINI EVOLUTION
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          Free music. Real stories. No gatekeeping.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            onClick={scrollToMusic}
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 glow-violet px-8"
          >
            Listen Free
          </Button>
          <Button
            onClick={() => openModal()}
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            Join the Evolution
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
          <StatCounter value={stats.total_members} label="Members" />
          <StatCounter value={stats.total_songs} label="Songs" />
          <StatCounter value={stats.total_downloads} label="Downloads" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
