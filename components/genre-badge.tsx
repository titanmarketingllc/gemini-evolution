import { cn } from '@/lib/utils'
import type { Genre } from '@/lib/types'

interface GenreBadgeProps {
  genre: Genre | string
  className?: string
}

const genreClasses: Record<string, string> = {
  Electronic: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Synthwave: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Progressive House': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Techno: 'bg-red-500/20 text-red-400 border-red-500/30',
  Ambient: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Drum and Bass': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Trance: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  Chillout: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  Country: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Pop: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  Acoustic: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  Ballad: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  Upbeat: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
}

export function GenreBadge({ genre, className }: GenreBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      genreClasses[genre] || 'bg-secondary text-secondary-foreground border-border',
      className
    )}>
      {genre}
    </span>
  )
}
