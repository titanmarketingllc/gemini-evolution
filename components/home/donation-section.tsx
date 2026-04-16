'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { DonationCard } from '@/components/donation-card'
import { DONATION_TIERS } from '@/lib/products'
import { formatNumber } from '@/lib/utils'

interface DonationSectionProps {
  donorCount: number
}

export function DonationSection({ donorCount }: DonationSectionProps) {
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time')
  const [selectedTierId, setSelectedTierId] = useState<string | null>('lights')
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDonate = async () => {
    let amount: number

    if (selectedTierId) {
      const tier = DONATION_TIERS.find(t => t.id === selectedTierId)
      if (!tier) return
      amount = tier.priceInCents
    } else if (customAmount) {
      amount = Math.round(parseFloat(customAmount) * 100)
      if (isNaN(amount) || amount < 100) return // Minimum $1
    } else {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type: donationType }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Help Keep the Music Free
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We believe music should be free to everyone. Your support makes that possible.
          </p>
        </div>

        {/* Donation type toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-background rounded-full border border-border">
            <button
              onClick={() => setDonationType('one-time')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                donationType === 'one-time'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              One-Time
            </button>
            <button
              onClick={() => setDonationType('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                donationType === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Donation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-6">
          {DONATION_TIERS.map((tier) => (
            <DonationCard
              key={tier.id}
              tier={tier}
              isSelected={selectedTierId === tier.id}
              onClick={() => {
                setSelectedTierId(tier.id)
                setCustomAmount('')
              }}
            />
          ))}
        </div>

        {/* Custom amount */}
        <div className="max-w-sm mx-auto mb-8">
          <Card 
            className={`p-4 bg-background border-2 transition-all ${
              customAmount && !selectedTierId 
                ? 'border-[var(--gold)]' 
                : 'border-border'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">$</span>
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  if (e.target.value) setSelectedTierId(null)
                }}
                className="border-0 bg-transparent text-xl font-bold focus-visible:ring-0 p-0"
                min={1}
              />
            </div>
          </Card>
        </div>

        {/* Submit button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleDonate}
            disabled={isLoading || (!selectedTierId && !customAmount)}
            size="lg"
            className="rounded-full bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-background px-12"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Processing...
              </>
            ) : (
              `Donate${donationType === 'monthly' ? ' Monthly' : ''}`
            )}
          </Button>
        </div>

        {/* Donor count */}
        <p className="text-center text-muted-foreground">
          Join {formatNumber(donorCount)} people keeping the music free
        </p>
      </div>
    </section>
  )
}
