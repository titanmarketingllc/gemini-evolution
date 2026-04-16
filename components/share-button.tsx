'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonProps {
  url: string
  title: string
  text?: string
  variant?: 'ghost' | 'outline' | 'default'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  className?: string
}

export function ShareButton({ 
  url, 
  title, 
  text,
  variant = 'ghost',
  size = 'icon',
  className 
}: ShareButtonProps) {
  const handleShare = async () => {
    const shareText = text || `Just discovered Gemini Evolution — free music, free downloads, genuinely great. Check it out: ${url}`

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        })
        return
      } catch (error) {
        // User cancelled or share failed, fall back to copy
        if ((error as Error).name === 'AbortError') return
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
      aria-label="Share"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  )
}
