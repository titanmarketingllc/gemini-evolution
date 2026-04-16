import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function AboutTeaserSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
              From the Heart of the Ozarks
            </h2>
            
            <div className="space-y-4 text-muted-foreground mb-8">
              <p>
                Born on the shores of Table Rock Lake, Gemini Evolution is more than music — 
                it&apos;s a reflection of life in the Ozarks. The quiet mornings, the endless 
                summers, the stories passed down through generations.
              </p>
              <p>
                We believe music should be free. Not because it&apos;s not valuable, but because 
                connection is priceless. Every song is a piece of home that we want to share 
                with you.
              </p>
            </div>

            <Link 
              href="/about"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Read the full story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card">
              <Image
                src="/images/artist.jpg"
                alt="Gemini Evolution - Table Rock Studios"
                fill
                className="object-cover"
              />
              {/* Fallback gradient if no image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
