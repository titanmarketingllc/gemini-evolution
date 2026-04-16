'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Copy, Check, Music, Download, Calendar, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GenreBadge } from '@/components/genre-badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Member } from '@/lib/types'

interface ProfileContentProps {
  member: Member
}

const milestones = [1, 5, 10, 25]

export function ProfileContent({ member }: ProfileContentProps) {
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  const referralLink = `https://thegeminievolution.com?ref=${member.referral_code}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success('Referral link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const tierColors = {
    bronze: 'bg-amber-700/20 text-amber-500 border-amber-700/30',
    silver: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
    gold: 'bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/30',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-2">
                Hey, {member.first_name || 'Friend'}!
              </h1>
              <p className="text-muted-foreground">
                Member #{member.member_number}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="rounded-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Stats */}
        <section>
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Your Stats
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Joined</span>
              </div>
              <p className="font-medium text-foreground">
                {format(new Date(member.created_at), 'MMM d, yyyy')}
              </p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Songs Played</span>
              </div>
              <p className="font-medium text-foreground text-2xl">
                {member.songs_played.toLocaleString()}
              </p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Downloads</span>
              </div>
              <p className="font-medium text-foreground text-2xl">
                {member.songs_downloaded.toLocaleString()}
              </p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Referrals</span>
              </div>
              <p className="font-medium text-foreground text-2xl">
                {member.referral_count}
              </p>
            </Card>
          </div>
        </section>

        {/* Donor badge */}
        {member.is_donor && member.donor_tier && (
          <section>
            <Card className="bg-card border-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                  <Award className="w-7 h-7 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Supporter Badge</h3>
                  <Badge className={tierColors[member.donor_tier]}>
                    {member.donor_tier.charAt(0).toUpperCase() + member.donor_tier.slice(1)} Supporter
                  </Badge>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Genre interests */}
        {member.genre_preferences && member.genre_preferences.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">
              Your Music Interests
            </h2>
            <Card className="bg-card border-border p-6">
              <div className="flex flex-wrap gap-2">
                {member.genre_preferences.map((genre) => (
                  <GenreBadge key={genre} genre={genre} />
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Referral section */}
        <section>
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Spread the Word
          </h2>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground mb-4">
              Share your unique link and help grow the community. Every referral counts!
            </p>
            
            <div className="flex gap-2 mb-6">
              <div className="flex-1 px-4 py-3 bg-background rounded-lg border border-border font-mono text-sm text-foreground truncate">
                {referralLink}
              </div>
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                className="rounded-lg flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Milestones */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Referral Milestones</p>
              <div className="flex gap-2">
                {milestones.map((milestone) => (
                  <div
                    key={milestone}
                    className={`flex-1 py-3 rounded-lg text-center text-sm font-medium transition-all ${
                      member.referral_count >= milestone
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {milestone}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Social shortcuts */}
        <section>
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Stay Connected
          </h2>
          <Card className="bg-card border-border p-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-full" asChild>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
                  Spotify
                </a>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
