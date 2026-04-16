import Link from 'next/link'
import { Music2, Instagram, Youtube, Facebook } from 'lucide-react'

const footerLinks = [
  { href: '/music', label: 'Music' },
  { href: '/about', label: 'About' },
  { href: '/community', label: 'Community' },
  { href: '/support', label: 'Support' },
]

const socialLinks = [
  { href: 'https://spotify.com', label: 'Spotify', icon: Music2 },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-lg font-bold tracking-wide text-foreground">
              GEMINI EVOLUTION
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Table Rock Studios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
