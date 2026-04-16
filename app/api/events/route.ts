import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { eventType, metadata } = await request.json()

    if (!eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const adminClient = await createAdminClient()

    await adminClient.from('events').insert({
      member_id: user?.id || null,
      event_type: eventType,
      metadata: metadata || {},
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging event:', error)
    // Fire and forget - always return success
    return NextResponse.json({ success: true })
  }
}
