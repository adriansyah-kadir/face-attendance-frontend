"use client"

import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    location.replace("/live")
  }, [])

  return (
    <div>
      Redirecting...
    </div>
  )
}
