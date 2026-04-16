import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SupportContent } from '@/components/support/support-content'

export const metadata: Metadata = {
  title: 'Support Gemini Evolution | Keep the Music Free',
  description: 'Help keep Gemini Evolution free for everyone. Your support covers studio costs, hosting, and allows us to continue making music without barriers.',
  openGraph: {
    title: 'Support Gemini Evolution | Keep the Music Free',
    description: 'Help keep Gemini Evolution free for everyone.',
  },
}

async function getDonorCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('donations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'completed')
  return count || 42
}

export default async function SupportPage() {
  const donorCount = await getDonorCount()

  return <SupportContent donorCount={donorCount} />
}
