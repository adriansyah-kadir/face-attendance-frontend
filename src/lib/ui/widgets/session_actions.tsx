"use client"

import { signin, signout } from '@/lib/auth'
import { ProfileContext } from '@/lib/providers/profile'
import { SessionContext } from '@/lib/providers/session'
import { Button, ButtonGroup } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { ChevronDown } from 'lucide-react'
import React, { useContext } from 'react'

export default function SessionActions() {
  const session = useContext(SessionContext)
  const profile = useContext(ProfileContext)

  if (profile === null) return <Button onPress={() => {
    if (session) location.assign("/profile")
    else signin()
  }}>{session ? "Setup Profile" : "Sign In"}</Button>

  return (
    <ButtonGroup color='primary'>
      <Button isIconOnly={profile === undefined} isLoading={profile === undefined}>
        {profile?.name}
      </Button>
      <Dropdown>
        <DropdownTrigger>
          <Button isDisabled={!profile} isIconOnly><ChevronDown size={18} /></Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="logout" onPress={signout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  )
}
