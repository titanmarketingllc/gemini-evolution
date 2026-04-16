import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { name, message } = await request.json()

    if (!name || !message) {
      return NextResponse.json({ error: 'Missing name or message' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const adminClient = await createAdminClient()

    await adminClient.from('fan_submissions').insert({
      member_id: user?.id || null,
      name,
      message,
      approved: false,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting:', error)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
