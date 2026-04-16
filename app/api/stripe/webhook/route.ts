import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const adminClient = await createAdminClient()

      const userId = session.metadata?.user_id
      const tier = session.metadata?.tier as 'bronze' | 'silver' | 'gold'
      const type = session.metadata?.type as 'one-time' | 'monthly'
      const amount = session.amount_total || 0

      // Insert donation record
      await adminClient.from('donations').insert({
        member_id: userId !== 'anonymous' ? userId : null,
        amount,
        type,
        tier,
        stripe_session_id: session.id,
        stripe_subscription_id: session.subscription as string || null,
        status: 'completed',
      })

      // Update member donor status if logged in
      if (userId && userId !== 'anonymous') {
        await adminClient
          .from('members')
          .update({ 
            is_donor: true, 
            donor_tier: tier 
          })
          .eq('id', userId)
      }

      // Send to GHL (fire and forget)
      const tags = ['donor', `donor-${tier}`]
      if (type === 'monthly') {
        tags.push('recurring-supporter')
      }

      if (session.customer_email) {
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ghl/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.customer_email,
            tags,
          }),
        }).catch(() => {})
      }
    } catch (error) {
      console.error('Error processing webhook:', error)
    }
  }

  return NextResponse.json({ received: true })
}
