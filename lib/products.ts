export interface DonationTier {
  id: string
  name: string
  description: string
  priceInCents: number
  tier: 'bronze' | 'silver' | 'gold'
  popular?: boolean
}

export const DONATION_TIERS: DonationTier[] = [
  {
    id: 'coffee',
    name: 'Buy us a coffee',
    description: 'Every bit helps keep the music free',
    priceInCents: 500,
    tier: 'bronze',
  },
  {
    id: 'lights',
    name: 'Keep the lights on',
    description: 'Help cover studio and hosting costs',
    priceInCents: 1500,
    tier: 'silver',
    popular: true,
  },
  {
    id: 'legend',
    name: 'Legend status',
    description: 'You\'re officially a music legend',
    priceInCents: 2500,
    tier: 'gold',
  },
]

export function getDonationTier(amountInCents: number): 'bronze' | 'silver' | 'gold' {
  if (amountInCents >= 2500) return 'gold'
  if (amountInCents >= 1500) return 'silver'
  return 'bronze'
}
