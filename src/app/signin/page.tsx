import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import React from 'react'
import GoogleSignInButton from '@/lib/ui/widgets/google_signin_button'

export default function SignInPage() {
  return (
    <div className='min-w-[100vw] min-h-screen flex items-center justify-center'>
      <Card className='max-w-sm w-full'>
        <CardHeader>Sign In</CardHeader>
        <CardBody>
          <GoogleSignInButton />
        </CardBody>
      </Card>
    </div>
  )
}
