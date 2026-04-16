'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Music, Server, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { DonationCard } from '@/components/donation-card'
import { DONATION_TIERS } from '@/lib/products'
import { formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

interface SupportContentProps {
  donorCount: number
}

const supportItems = [
  {
    icon: Music,
    title: 'Studio Costs',
    description: 'Equipment, software, and recording sessions to create new music.',
  },
  {
    icon: Server,
    title: 'Hosting & Tech',
    description: 'Keeping the website running and music streaming smoothly.',
  },
  {
    icon: Heart,
    title: 'Time to Create',
    description: 'Allowing us to focus on making music instead of chasing other work.',
  },
]

export function SupportContent({ donorCount }: SupportContentProps) {
  const searchParams = useSearchParams()
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time')
  const [selectedTierId, setSelectedTierId] = useState<string | null>('lights')
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Check for success param
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Thank you for your support! You\'re helping keep the music free.')
    }
  }, [searchParams])

  const handleDonate = async () => {
    let amount: number

    if (selectedTierId) {
      const tier = DONATION_TIERS.find(t => t.id === selectedTierId)
      if (!tier) return
      amount = tier.priceInCents
    } else if (customAmount) {
      amount = Math.round(parseFloat(customAmount) * 100)
      if (isNaN(amount) || amount < 100) return
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
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            This music is free because of people like you.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every song. Every download. Always free. Your support makes that possible.
          </p>
        </div>
      </section>

      {/* Artist message */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="bg-card border-l-4 border-l-[var(--gold)] p-8">
            <p className="text-lg text-foreground italic mb-4">
              &ldquo;We made a choice to give our music away. Not because it isn&apos;t valuable, 
              but because we believe in connection over transaction. Your support isn&apos;t 
              required — but it&apos;s deeply appreciated. It&apos;s what keeps the lights on 
              and lets us keep doing what we love.&rdquo;
            </p>
            <p className="text-muted-foreground font-medium">
              — Gemini Evolution
            </p>
          </Card>
        </div>
      </section>

      {/* Donation section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Donation type toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-card rounded-full border border-border">
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
              className={`p-4 bg-card border-2 transition-all ${
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

      {/* What support covers */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
            What Your Support Covers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="bg-background border-border p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[var(--gold)]" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
