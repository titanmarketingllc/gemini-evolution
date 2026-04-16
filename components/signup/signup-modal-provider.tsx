'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { SignupModal } from './signup-modal'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface SignupModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  user: User | null
}

const SignupModalContext = createContext<SignupModalContextType | null>(null)

export function useSignupModal() {
  const context = useContext(SignupModalContext)
  if (!context) {
    throw new Error('useSignupModal must be used within a SignupModalProvider')
  }
  return context
}

export function SignupModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
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

  // Check for ?signup=true param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('signup') === 'true' && !user) {
      setIsOpen(true)
      // Clean up URL
      const url = new URL(window.location.href)
      url.searchParams.delete('signup')
      window.history.replaceState({}, '', url.toString())
    }
  }, [user])

  const openModal = useCallback(() => {
    if (!user) {
      setIsOpen(true)
    }
  }, [user])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <SignupModalContext.Provider value={{ isOpen, openModal, closeModal, user }}>
      {children}
      <SignupModal isOpen={isOpen} onClose={closeModal} />
    </SignupModalContext.Provider>
  )
}
