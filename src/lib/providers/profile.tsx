import React, { ContextType, createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { SessionContext } from './session'
import { supabase } from '../supabase/client'
import type { Tables } from '../supabase/types'
import { useRouter } from 'next/navigation'

export const ProfileContext = createContext<Tables<'profiles'> | null | undefined>(undefined)

async function createDefaultProfile(session: NonNullable<ContextType<typeof SessionContext>>) {
  const name = session.user.user_metadata.full_name
  const picture = session.user.user_metadata.picture

  if (typeof name !== "string" || typeof picture !== "string") throw Error("invalid user metadata");

  const profile = await supabase().from("profiles").insert({
    name,
    picture
  }).select().single()

  return profile.data
}

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ContextType<typeof ProfileContext>>(undefined)
  const session = useContext(SessionContext)
  const router = useRouter()

  useEffect(() => {
    if (profile === null && session) {
      createDefaultProfile(session)
        .then(setProfile, () => {
          if (!location.pathname.startsWith("/profile")) router.push("/profile")
        })
    }
  }, [profile])

  useEffect(() => {
    if (session) {
      supabase().from("profiles").select("*").eq("id", session.user.id).single().then(profile => {
        setProfile(profile.data)
      })
    } else setProfile(session)
  }, [session])

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}
