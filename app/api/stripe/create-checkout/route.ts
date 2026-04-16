import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { getDonationTier } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const { amount, type } = await request.json()

    if (!amount || !type) {
      return NextResponse.json({ error: 'Missing amount or type' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const origin = request.nextUrl.origin
    const tier = getDonationTier(amount)

    const sessionConfig: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      success_url: `${origin}/support?success=true`,
      cancel_url: `${origin}/support`,
      customer_email: user?.email || undefined,
      metadata: {
        tier,
        type,
        user_id: user?.id || 'anonymous',
      },
    }

    if (type === 'monthly') {
      // Create subscription
      sessionConfig.mode = 'subscription'
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Monthly Support',
              description: 'Monthly donation to keep the music free',
            },
            unit_amount: amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ]
    } else {
      // One-time payment
      sessionConfig.mode = 'payment'
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'One-Time Support',
              description: 'One-time donation to keep the music free',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ]
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
