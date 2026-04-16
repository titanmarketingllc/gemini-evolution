import { Music, Download, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'

const steps = [
  {
    icon: Music,
    title: 'Listen',
    description: 'All music, always free. Stream any song, anytime, no strings attached.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Free account unlocks all downloads. Keep the music forever.',
  },
  {
    icon: Heart,
    title: 'Support',
    description: 'Love it? Help keep it free for everyone with a small donation.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No subscriptions, no paywalls, no catch. Just great music.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card 
                key={index}
                className="p-8 bg-background border-border text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
