import { ContextType, useContext, useEffect, useMemo, useState } from "react";
import { ProfileContext } from "../providers/profile";
import { ReadonlyURLSearchParams, usePathname } from "next/navigation";
import { supabase } from "../supabase/client";

export default function useProfile(searchParams: ReadonlyURLSearchParams) {
  const [profile, setProfile] = useState<ContextType<typeof ProfileContext>>()
  const pathname = usePathname()
  const idParam = searchParams.get("id")
  const loggedIn = useContext(ProfileContext)
  const isMe = useMemo(() => !!profile && !!loggedIn && profile.id === loggedIn.id, [profile, loggedIn])

  async function getProfileFromParam(id: string) {
    const profile = await supabase().from('profiles').select("*").eq("id", id).single()
    return profile.data
  }

  useEffect(() => {
    if (idParam === null || !pathname.startsWith("/profile/")) setProfile(loggedIn);
  }, [loggedIn, idParam])

  useEffect(() => {
    if (typeof idParam === "string" && pathname.startsWith("/profile/")) {
      getProfileFromParam(idParam)
        .then(setProfile)
    }
  }, [idParam])

  return { profile, isMe }
}
