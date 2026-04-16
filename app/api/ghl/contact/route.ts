import { NextRequest, NextResponse } from 'next/server'

interface GHLContactRequest {
  email: string
  firstName?: string
  tags?: string[]
  customFields?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    const body: GHLContactRequest = await request.json()
    const { email, firstName, tags, customFields } = body

    const GHL_API_KEY = process.env.GHL_API_KEY
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      // GHL not configured, silently succeed
      console.log('GHL not configured, skipping contact creation')
      return NextResponse.json({ success: true })
    }

    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        email,
        firstName: firstName || undefined,
        tags: tags || [],
        customField: customFields || {},
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('GHL API error:', error)
    }

    // Always return success - never block UI on GHL failure
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('GHL contact error:', error)
    // Always return success
    return NextResponse.json({ success: true })
  }
}
