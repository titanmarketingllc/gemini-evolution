'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { Check, Music2, Instagram, Youtube } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Genre } from '@/lib/types'

type ModalState = 'email' | 'check-email' | 'genre-survey'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

const genres: Genre[] = ['Country', 'Pop', 'Acoustic', 'Ballad', 'Upbeat']

const socialLinks = [
  { href: 'https://spotify.com', label: 'Spotify', icon: Music2 },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
]

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [state, setState] = useState<ModalState>('email')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const supabase = createClient()

  // Check for auth state changes (user clicked magic link)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if this is a new user by looking at user metadata
        const isNewUser = session.user.user_metadata?.first_name
        if (isNewUser && state === 'check-email') {
          setState('genre-survey')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, state])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setState('email')
        setFirstName('')
        setEmail('')
        setSelectedGenres([])
      }, 300)
    }
  }, [isOpen])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName) return

    setIsLoading(true)

    // Check for referral code in localStorage
    const referralCode = localStorage.getItem('referral_code')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          referred_by: referralCode || undefined,
        },
      },
    })

    setIsLoading(false)

    if (error) {
      toast.error('Something went wrong. Please try again.')
      return
    }

    setState('check-email')
  }

  const handleGenreSurveySubmit = async () => {
    setIsLoading(true)

    try {
      // Update member profile with genre preferences
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('members')
          .update({ genre_preferences: selectedGenres })
          .eq('id', user.id)

        // Fire GHL contact creation (fire and forget)
        fetch('/api/ghl/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            firstName: user.user_metadata?.first_name,
            tags: selectedGenres.map(g => `genre-${g.toLowerCase()}`),
          }),
        }).catch(() => {}) // Ignore errors

        toast.success(`Welcome ${user.user_metadata?.first_name || ''} — you can now download any song.`)
      }
    } catch {
      // Ignore errors
    }

    setIsLoading(false)
    onClose()
  }

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogTitle className="sr-only">Join Gemini Evolution</DialogTitle>
        
        {state === 'email' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Join the Evolution
              </h2>
              <p className="mt-2 text-muted-foreground">
                Free Forever
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="mr-2" /> : null}
                Send My Magic Link
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                No password. Check your email for an instant access link.
              </p>
            </form>
          </div>
        )}

        {state === 'check-email' && (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-primary" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path 
                  d="M5 13l4 4L19 7" 
                  className="animate-checkmark"
                  style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                />
              </svg>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Check Your Inbox
              </h2>
              <p className="mt-2 text-muted-foreground">
                Your magic link is on its way.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                While you wait, follow us:
              </p>
              <div className="flex justify-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-background border border-border hover:border-primary transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5 text-foreground" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {state === 'genre-survey' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                What kind of music moves you?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Select all that apply
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    selectedGenres.includes(genre)
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <Checkbox 
                    checked={selectedGenres.includes(genre)} 
                    className="pointer-events-none"
                  />
                  <span className="text-sm font-medium text-foreground">{genre}</span>
                </button>
              ))}
              <button
                onClick={() => toggleGenre('Country')} // Using Country as placeholder for "Surprise Me"
                className={`p-4 rounded-xl border transition-all flex items-center gap-3 col-span-2 ${
                  selectedGenres.length === 0
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <Check className={`h-4 w-4 ${selectedGenres.length === 0 ? 'text-primary' : 'text-transparent'}`} />
                <span className="text-sm font-medium text-foreground">Surprise Me</span>
              </button>
            </div>

            <Button 
              onClick={handleGenreSurveySubmit}
              className="w-full rounded-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              Take Me to the Music
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
