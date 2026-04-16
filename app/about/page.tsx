import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About Gemini Evolution | Table Rock Studios',
  description: 'The story of Gemini Evolution — born on the shores of Table Rock Lake in the heart of the Ozarks. Free music, real stories, no gatekeeping.',
  openGraph: {
    title: 'About Gemini Evolution | Table Rock Studios',
    description: 'The story of Gemini Evolution — born on the shores of Table Rock Lake in the heart of the Ozarks.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero image */}
      <section className="relative h-[50vh] sm:h-[60vh]">
        <Image
          src="/images/about-hero.jpg"
          alt="Gemini Evolution - Ozarks"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
              Our Story
            </h1>
          </div>
        </div>
      </section>

      {/* Story sections */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Origin */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Born on Table Rock Lake
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                There&apos;s something about growing up in the Ozarks that shapes how you see the world. 
                The quiet mornings on the lake when the water is still as glass. The way a summer storm 
                can roll in and change everything in minutes. The stories passed down on front porches, 
                generation after generation.
              </p>
              <p>
                Gemini Evolution started right here — on the shores of Table Rock Lake, in a small 
                studio tucked away from the noise of the world. It wasn&apos;t about making it big or 
                chasing fame. It was about capturing something real.
              </p>
            </div>
          </div>

          {/* Pull quote */}
          <Card className="bg-card border-l-4 border-l-primary p-8 mb-16">
            <blockquote className="font-serif text-2xl sm:text-3xl text-foreground italic">
              &ldquo;Music should be as free as the wind coming off the lake. That&apos;s not a business 
              strategy — it&apos;s a belief.&rdquo;
            </blockquote>
          </Card>

          {/* Philosophy */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Why Free?
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                In a world where everything has a price tag, we chose a different path. We believe 
                that music is meant to be shared — freely, openly, without barriers. Not because 
                it&apos;s not valuable, but because connection is priceless.
              </p>
              <p>
                Every song is free to stream. Free to download. Free to share with anyone who 
                needs it. That&apos;s the deal, and it always will be.
              </p>
              <p>
                We survive because of people who believe in what we&apos;re doing — supporters who 
                choose to give because they want to, not because they have to. That&apos;s a 
                different kind of relationship, and we think it&apos;s better.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="mb-16 p-8 sm:p-12 bg-card rounded-2xl border border-border">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              To create music that matters. To share it freely with everyone who needs it. 
              To build a community around something real. To prove that there&apos;s another way.
            </p>
            <p className="text-foreground font-medium">
              Free music. Real stories. No gatekeeping.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Be Part of the Evolution
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/music">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90">
                  Listen Free
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="outline" className="rounded-full">
                  Support Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
