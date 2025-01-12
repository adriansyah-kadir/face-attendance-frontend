'use client'

import { Session } from '@supabase/supabase-js'
import React, { ContextType, createContext, ReactNode, useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export const SessionContext = createContext<Session | null | undefined>(undefined)

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ContextType<typeof SessionContext>>(undefined)

  useEffect(() => {
    const { data: { subscription } } = supabase().auth.onAuthStateChange((_, s) => {
      setSession(s)
    })

    return subscription.unsubscribe
  }, [])

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}
