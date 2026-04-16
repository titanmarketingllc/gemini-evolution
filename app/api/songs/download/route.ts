import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { songId } = await request.json()

    if (!songId) {
      return NextResponse.json({ error: 'Missing songId' }, { status: 400 })
    }

    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const adminClient = await createAdminClient()

    // Get song details
    const { data: song } = await adminClient
      .from('songs')
      .select('*')
      .eq('id', songId)
      .single()

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    // Increment download count
    await adminClient
      .from('songs')
      .update({ download_count: (song.download_count || 0) + 1 })
      .eq('id', songId)

    // Log event
    await adminClient.from('events').insert({
      member_id: user.id,
      event_type: 'song_download',
      song_id: songId,
      genre: song.genre,
    })

    // Update member stats
    const { data: member } = await adminClient
      .from('members')
      .select('songs_downloaded')
      .eq('id', user.id)
      .single()

    const isFirstDownload = (member?.songs_downloaded || 0) === 0

    if (member) {
      await adminClient
        .from('members')
        .update({ songs_downloaded: (member.songs_downloaded || 0) + 1 })
        .eq('id', user.id)
    }

    // Send to GHL (fire and forget)
    const tags = [`downloaded-${song.slug}`]
    if (isFirstDownload) {
      tags.push('downloader')
    }

    fetch(`${request.nextUrl.origin}/api/ghl/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        tags,
      }),
    }).catch(() => {})

    return NextResponse.json({ 
      success: true, 
      downloadUrl: song.audio_url 
    })
  } catch (error) {
    console.error('Error processing download:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
