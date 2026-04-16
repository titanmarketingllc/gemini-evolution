'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSignupModal } from '@/components/signup/signup-modal-provider'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function MobileBottomBar() {
  const [user, setUser] = useState<User | null>(null)
  const { openModal } = useSignupModal()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Don't show if user is logged in
  if (user) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border">
      <Button 
        onClick={() => openModal()}
        className="w-full rounded-full bg-primary hover:bg-primary/90 glow-violet"
        size="lg"
      >
        Join Free
      </Button>
    </div>
  )
}
