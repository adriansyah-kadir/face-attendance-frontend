"use client"
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import SessionProvider from './session'
import ProfileProvider from './profile'

export default function Providers({ children }: { children: ReactNode }) {
  const query = new QueryClient()

  return (
    <SessionProvider>
      <ProfileProvider>
        <QueryClientProvider client={query}>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </QueryClientProvider>
      </ProfileProvider>
    </SessionProvider>
  )
}
