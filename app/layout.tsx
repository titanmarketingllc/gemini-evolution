import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar'
import { SignupModalProvider } from '@/components/signup/signup-modal-provider'
import { AudioPlayerProvider } from '@/components/audio/audio-player-provider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gemini Evolution | Free Music. Free Downloads. Real Community.',
  description: 'Stream and download music from Gemini Evolution — always free. Join the fan community, support the artist, and be part of something real.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thegeminievolution.com'),
  openGraph: {
    title: 'Gemini Evolution | Free Music. Free Downloads. Real Community.',
    description: 'Stream and download music from Gemini Evolution — always free. Join the fan community, support the artist, and be part of something real.',
    type: 'website',
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gemini Evolution | Free Music. Free Downloads. Real Community.',
    description: 'Stream and download music from Gemini Evolution — always free.',
  },
}

export const viewport: Viewport = {
  themeColor: '#080810',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SignupModalProvider>
          <AudioPlayerProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <MobileBottomBar />
          </AudioPlayerProvider>
        </SignupModalProvider>
        <Toaster 
          theme="dark" 
          position="top-center"
          toastOptions={{
            style: {
              background: '#0f0f1a',
              border: '1px solid #1e1e2e',
              color: '#F8FAFC',
            },
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
