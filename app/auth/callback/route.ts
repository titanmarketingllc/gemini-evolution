import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/?welcome=true'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Handle referral tracking
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const referredBy = user.user_metadata?.referred_by
        
        if (referredBy) {
          // Find the referrer and increment their count
          const { data: referrer } = await supabase
            .from('members')
            .select('id, referral_count')
            .eq('referral_code', referredBy)
            .single()

          if (referrer) {
            // Update the new member's referred_by field
            await supabase
              .from('members')
              .update({ referred_by: referrer.id })
              .eq('id', user.id)

            // Increment referrer's count
            await supabase
              .from('members')
              .update({ referral_count: (referrer.referral_count || 0) + 1 })
              .eq('id', referrer.id)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
