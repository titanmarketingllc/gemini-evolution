export interface Song {
  id: string
  title: string
  slug: string
  genre: string
  description: string | null
  duration: number
  cover_image_url: string | null
  audio_url: string
  play_count: number
  download_count: number
  is_featured: boolean
  is_downloadable: boolean
  lyrics: string | null
  credits: string | null
  release_date: string
  created_at: string
  updated_at: string
}

export type Genre = 'Electronic' | 'Synthwave' | 'Progressive House' | 'Techno' | 'Ambient' | 'Drum and Bass' | 'Trance' | 'Chillout' | 'Country' | 'Pop' | 'Acoustic' | 'Ballad' | 'Upbeat'

export interface Member {
  id: string
  first_name: string | null
  email: string
  member_number: number
  referral_code: string | null
  referred_by: string | null
  referral_count: number
  genre_preferences: Genre[]
  songs_played: number
  songs_downloaded: number
  city: string | null
  is_donor: boolean
  donor_tier: 'bronze' | 'silver' | 'gold' | null
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  member_id: string | null
  amount: number
  type: 'one-time' | 'monthly'
  tier: 'bronze' | 'silver' | 'gold'
  stripe_session_id: string | null
  stripe_subscription_id: string | null
  status: string
  created_at: string
}

export interface Event {
  id: string
  member_id: string | null
  event_type: string
  song_id: string | null
  genre: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface FanSubmission {
  id: string
  member_id: string | null
  name: string
  message: string
  approved: boolean
  created_at: string
}

export interface SiteStats {
  total_members: number
  total_songs: number
  total_downloads: number
  total_donors: number
}
