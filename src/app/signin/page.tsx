import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import React from 'react'
import GoogleSignInButton from '@/lib/ui/widgets/google_signin_button'

export default function SignInPage() {
  return (
    <div className='min-w-[100vw] min-h-screen flex items-center justify-center' style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)" }}>
      <Card className='max-w-sm w-full'>
        <CardHeader className='block'>
          <h2 className="text-2xl font-semibold">Sign In</h2>
          <p>Selamat Datang di Sistem Absensi Terpadu</p>
        </CardHeader>
        <CardBody>
          <GoogleSignInButton />
        </CardBody>
      </Card>
    </div>
  )
}
