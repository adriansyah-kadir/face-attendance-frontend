import { ProfileContext } from "@/lib/providers/profile";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";
import { Avatar } from "@nextui-org/react";
import { CalendarIcon } from "lucide-react";
import { ReactNode, useContext } from "react";

export default function ProfileInfo({ actions }: { actions?: ReactNode }) {
  const profile = useContext(ProfileContext)

  return (
    <div className="flex flex-col gap-5 px-5 w-full">
      <ProfileHeader actions={actions} />
      <ProfileDescription />
      <span className="flex items-center gap-2">
        <CalendarIcon size={18} />
        <small>Joined {new Date(profile?.created_at ?? 0).toLocaleDateString()}</small>
      </span>
    </div>
  )
}

function ProfileDescription() {
  const profile = useContext(ProfileContext)

  return (
    <div>
      <h2 className="text-xl leading-none">{profile?.name}</h2>
      <small className="leading-none">@T3121018</small>
    </div>
  )
}

function ProfileHeader({ actions }: { actions?: ReactNode }) {
  const profile = useContext(ProfileContext)

  return (
    <div className="min-h-[40px] max-h-[100px] h-[6vw] flex items-start gap-5 justify-between mt-2">
      <div className="min-w-[80px] max-w-[200px] w-[12vw] h-full overflow-visible flex-shrink-0 flex flex-col-reverse">
        <Avatar className="w-full h-auto aspect-square flex-shrink-0" src={getPublicURLFormFullPath(profile?.picture)} showFallback isBordered />
      </div>
      <div className="h-full overflow-visible flex flex-col-reverse justify-end">
        {actions}
      </div>
    </div>
  )
}

