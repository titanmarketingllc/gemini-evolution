import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CommunityContent } from '@/components/community/community-content'
import type { FanSubmission, Event } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Community | Gemini Evolution',
  description: 'Join the Gemini Evolution community. Share your stories, connect with fellow fans, and be part of something real.',
  openGraph: {
    title: 'Community | Gemini Evolution',
    description: 'Join the Gemini Evolution community. Share your stories, connect with fellow fans.',
  },
}

interface ActivityItem {
  firstName: string
  city: string
  songTitle: string
  createdAt: string
}

async function getMemberCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase.from('members').select('id', { count: 'exact', head: true })
  return count || 127
}

async function getRecentActivity(): Promise<ActivityItem[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('events')
    .select(`
      created_at,
      members(first_name, city),
      songs(title)
    `)
    .eq('event_type', 'song_download')
    .order('created_at', { ascending: false })
    .limit(10)

  if (!data) return []

  return data.map((event: Record<string, unknown>) => ({
    firstName: (event.members as { first_name?: string })?.first_name || 'Someone',
    city: (event.members as { city?: string })?.city || 'Unknown',
    songTitle: (event.songs as { title?: string })?.title || 'a song',
    createdAt: event.created_at as string,
  }))
}

async function getApprovedSubmissions(): Promise<FanSubmission[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('fan_submissions')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return (data as FanSubmission[]) || []
}

export default async function CommunityPage() {
  const [memberCount, recentActivity, submissions] = await Promise.all([
    getMemberCount(),
    getRecentActivity(),
    getApprovedSubmissions(),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            The Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            You&apos;re not just a listener — you&apos;re part of something bigger.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-foreground font-medium">
              {memberCount.toLocaleString()} members strong
            </span>
          </div>
        </div>
      </section>

      <CommunityContent 
        recentActivity={recentActivity}
        submissions={submissions}
      />
    </div>
  )
}
