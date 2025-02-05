"use client"

import { SessionContext } from "@/lib/providers/session"
import { useContext, useEffect } from "react"

export default function Home() {
  const session = useContext(SessionContext)

  useEffect(() => {
    if (session || session === null) {
      location.replace(process.env.NEXT_PUBLIC_BASE_PATH + "/live")
    }
  }, [session])

  return (
    <div>
      Redirecting...
    </div>
  )
}
