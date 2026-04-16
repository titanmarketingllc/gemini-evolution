import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileContent } from '@/components/profile/profile-content'
import type { Member } from '@/lib/types'

export const metadata: Metadata = {
  title: 'My Profile | Gemini Evolution',
  description: 'Your member dashboard. View stats, get your referral link, and manage your profile.',
}

async function getMemberProfile(): Promise<Member | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('id', user.id)
    .single()

  return data as Member | null
}

export default async function ProfilePage() {
  const member = await getMemberProfile()

  if (!member) {
    redirect('/?signup=true')
  }

  return <ProfileContent member={member} />
}
