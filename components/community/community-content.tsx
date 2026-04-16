'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Download, Share2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import type { FanSubmission } from '@/lib/types'

interface ActivityItem {
  firstName: string
  city: string
  songTitle: string
  createdAt: string
}

interface CommunityContentProps {
  recentActivity: ActivityItem[]
  submissions: FanSubmission[]
}

export function CommunityContent({ recentActivity, submissions }: CommunityContentProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !message) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      })

      if (response.ok) {
        toast.success('Your message has been submitted for review!')
        setName('')
        setMessage('')
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareText = `Just discovered Gemini Evolution — free music, free downloads, genuinely great. Check it out: https://thegeminievolution.com`

  const handleCopyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      toast.success('Share text copied!')
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Recent Activity */}
      <section>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
          Recent Activity
        </h2>
        <Card className="bg-card border-border p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">
                      <span className="font-medium">{activity.firstName}</span>
                      {activity.city !== 'Unknown' && (
                        <span className="text-muted-foreground"> from {activity.city}</span>
                      )}
                      <span className="text-muted-foreground"> downloaded </span>
                      <span className="font-medium">{activity.songTitle}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No recent activity yet. Be the first to download a song!
            </p>
          )}
        </Card>
      </section>

      {/* Share Challenge */}
      <section>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
          Spread the Word
        </h2>
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">Share the Music</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Help us reach more people. Copy this message and share it anywhere:
              </p>
              <div className="bg-background rounded-lg p-4 border border-border mb-4">
                <p className="text-sm text-foreground">{shareText}</p>
              </div>
              <Button 
                onClick={handleCopyShareText}
                variant="outline"
                className="rounded-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Share Text
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Fan Submissions */}
      <section>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
          Fan Messages
        </h2>
        
        {submissions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {submissions.map((submission) => (
              <Card key={submission.id} className="bg-card border-border p-6">
                <p className="text-foreground mb-4">&ldquo;{submission.message}&rdquo;</p>
                <p className="text-sm text-muted-foreground">— {submission.name}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Submission form */}
        <Card className="bg-card border-border p-6">
          <h3 className="font-medium text-foreground mb-4">Share Your Story</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name or nickname"
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What does Gemini Evolution mean to you?"
                className="bg-background border-border min-h-[100px]"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="rounded-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner className="mr-2" /> : null}
              Submit Message
            </Button>
            <p className="text-xs text-muted-foreground">
              Messages are reviewed before being displayed.
            </p>
          </form>
        </Card>
      </section>

      {/* Member Wall Coming Soon */}
      <section>
        <Card className="bg-card border-border p-8 text-center">
          <h2 className="font-serif text-xl font-bold text-foreground mb-2">
            Member Wall
          </h2>
          <p className="text-muted-foreground mb-4">
            Coming Soon — Phase 2
          </p>
          <div className="inline-flex px-4 py-2 bg-primary/10 rounded-full text-primary text-sm">
            Under Construction
          </div>
        </Card>
      </section>

      {/* Instagram placeholder */}
      {/* // Add Instagram oEmbed here */}
    </div>
  )
}
