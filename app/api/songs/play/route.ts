import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { songId } = await request.json()

    if (!songId) {
      return NextResponse.json({ error: 'Missing songId' }, { status: 400 })
    }

    const adminClient = await createAdminClient()

    // Increment play count
    const { data: song } = await adminClient
      .from('songs')
      .select('play_count, genre')
      .eq('id', songId)
      .single()

    if (song) {
      await adminClient
        .from('songs')
        .update({ play_count: (song.play_count || 0) + 1 })
        .eq('id', songId)
    }

    // Log event if user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await adminClient.from('events').insert({
        member_id: user.id,
        event_type: 'song_play',
        song_id: songId,
        genre: song?.genre || null,
      })

      // Update member stats
      const { data: member } = await adminClient
        .from('members')
        .select('songs_played')
        .eq('id', user.id)
        .single()

      if (member) {
        await adminClient
          .from('members')
          .update({ songs_played: (member.songs_played || 0) + 1 })
          .eq('id', user.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging play:', error)
    return NextResponse.json({ success: true }) // Always return success
  }
}
