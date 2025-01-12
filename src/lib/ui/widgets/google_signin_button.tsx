'use client'
import { googleSignIn } from '@/lib/supabase/auth'
import { Button } from '@nextui-org/button'
import React from 'react'

export default function GoogleSignInButton() {
  return (
    <Button onPress={googleSignIn}>Google</Button>
  )
}
