'use client'
import { googleSignIn } from '@/lib/supabase/auth'
import { Button } from '@nextui-org/button'
import React from 'react'

export default function GoogleSignInButton() {
  return (
    <Button onPress={() => googleSignIn(process.env.NEXT_PUBLIC_DEPLOYMENT_URL! + process.env.NEXT_PUBLIC_BASE_PATH)}>Google</Button>
  )
}
