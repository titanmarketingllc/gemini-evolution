'use client'

import { Music2, Apple, Youtube, Instagram, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'

const socials = [
  { name: 'Spotify', icon: Music2, href: 'https://spotify.com', color: '#1DB954' },
  { name: 'Apple Music', icon: Apple, href: 'https://music.apple.com', color: '#FA233B' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', color: '#FF0000' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: '#E4405F' },
  { name: 'TikTok', icon: Music2, href: 'https://tiktok.com', color: '#000000' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: '#1877F2' },
]

export function SocialFollowSection() {
  const handleSocialClick = async (platform: string, href: string) => {
    // Log social click event (fire and forget)
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'social_click',
        metadata: { platform },
      }),
    }).catch(() => {})

    // Open in new tab
    window.open(href, '_blank')
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Follow the Evolution
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay connected and be the first to hear new releases.
          </p>
        </div>

        {/* Social buttons */}
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <Button
                key={social.name}
                variant="outline"
                size="lg"
                className="rounded-full px-6 hover:border-primary"
                onClick={() => handleSocialClick(social.name, social.href)}
              >
                <Icon className="w-5 h-5 mr-2" />
                {social.name}
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
