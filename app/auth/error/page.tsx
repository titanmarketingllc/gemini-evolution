import { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Authentication Error | Gemini Evolution',
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card border-border p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
          Something Went Wrong
        </h1>
        
        <p className="text-muted-foreground mb-8">
          We couldn&apos;t complete the authentication. This might happen if the link 
          has expired or was already used.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="rounded-full bg-primary hover:bg-primary/90">
              Go Home
            </Button>
          </Link>
          <Link href="/?signup=true">
            <Button variant="outline" className="rounded-full">
              Try Again
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
