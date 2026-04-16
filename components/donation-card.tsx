'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DonationTier } from '@/lib/products'

interface DonationCardProps {
  tier: DonationTier
  isSelected: boolean
  onClick: () => void
}

export function DonationCard({ tier, isSelected, onClick }: DonationCardProps) {
  const price = (tier.priceInCents / 100).toFixed(0)

  return (
    <Card
      onClick={onClick}
      className={cn(
        'relative p-6 cursor-pointer transition-all border-2',
        isSelected 
          ? 'border-[var(--gold)] bg-[var(--gold)]/5' 
          : 'border-border bg-card hover:border-[var(--gold)]/50'
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--gold)] text-background text-xs font-bold rounded-full">
          MOST POPULAR
        </div>
      )}

      <div className="text-center">
        <div className="text-4xl font-bold font-serif text-foreground mb-2">
          ${price}
        </div>
        <h3 className="font-medium text-foreground mb-1">
          {tier.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {tier.description}
        </p>
      </div>
    </Card>
  )
}
