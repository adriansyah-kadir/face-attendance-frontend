"use client"

import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    location.replace(process.env.NEXT_PUBLIC_BASE_PATH + "/live")
  }, [])

  return (
    <div>
      Redirecting...
    </div>
  )
}
