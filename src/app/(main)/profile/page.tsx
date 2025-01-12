"use client"

import { ProfileContext } from "@/lib/providers/profile"
import { Tab, Tabs } from "@nextui-org/react"
import { useContext } from "react"
import ProfileInfo from "@/lib/ui/widgets/profile/profile_info"
import FacesTab from "@/lib/ui/widgets/profile/tabs/faces"
import SettingsTab from "@/lib/ui/widgets/profile/tabs/settings_tab"
import ProfileUpdate from "@/lib/ui/widgets/profile/profile_update"
import Show from "@/lib/ui/widgets/show"
import useProfile from "@/lib/states/profile"
import { getPublicURLFormFullPath } from "@/lib/supabase/storage"
import { useSearchParams } from "next/navigation"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const { profile, isMe } = useProfile(searchParams)

  return (
    <ProfileContext.Provider value={profile}>
      <div className="min-w-full w-fit">
        <ProfileBanner />
        <div className="max-w-6xl flex-col flex items-center m-auto w-full">
          <ProfileInfo actions={
            <Show when={isMe}>
              <ProfileUpdate />
            </Show>
          } />
          <div className="my-10 px-5 w-full">
            <Show when={isMe}>
              <Tabs>
                <Tab key="faces" title="Faces">
                  <FacesTab />
                </Tab>
                <Tab key="settings" title="Settings">
                  <SettingsTab />
                </Tab>
              </Tabs>
            </Show>
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  )
}

function ProfileBanner() {
  const profile = useContext(ProfileContext)

  return (
    <div className="h-60 bg-blue-500 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${getPublicURLFormFullPath(profile?.banner)})` }} />
  )
}
