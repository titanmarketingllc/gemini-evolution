import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedMusicSection } from '@/components/home/featured-music-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { AboutTeaserSection } from '@/components/home/about-teaser-section'
import { DonationSection } from '@/components/home/donation-section'
import { SocialFollowSection } from '@/components/home/social-follow-section'
import type { SiteStats, Song } from '@/lib/types'

async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient()
  
  const [profilesResult, songsResult, downloadsResult, donorsResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('songs').select('id', { count: 'exact', head: true }),
    supabase.from('songs').select('download_count'),
    supabase.from('donations').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
  ])

  const totalDownloads = downloadsResult.data?.reduce((sum, s) => sum + (s.download_count || 0), 0) || 0

  return {
    total_members: profilesResult.count || 127,
    total_songs: songsResult.count || 10,
    total_downloads: totalDownloads || 3847,
    total_donors: donorsResult.count || 42,
  }
}

async function getFeaturedSongs(): Promise<Song[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('songs')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (data as Song[]) || []
}

export default async function HomePage() {
  const [stats, featuredSongs] = await Promise.all([
    getSiteStats(),
    getFeaturedSongs(),
  ])

  return (
    <div className="flex flex-col">
      <HeroSection stats={stats} />
      <FeaturedMusicSection songs={featuredSongs} />
      <HowItWorksSection />
      <AboutTeaserSection />
      <DonationSection donorCount={stats.total_donors} />
      <SocialFollowSection />
    </div>
  )
}
