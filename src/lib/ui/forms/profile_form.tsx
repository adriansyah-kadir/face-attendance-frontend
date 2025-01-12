import { Input } from "@nextui-org/react";
import { GalleryHorizontalEndIcon } from "lucide-react";
import ImageInput from "../widgets/image_input";
import { useContext } from "react";
import { ProfileContext } from "@/lib/providers/profile";

export default function ProfileForm() {
  const profile = useContext(ProfileContext)

  return (
    <div className="space-y-3 w-full">
      <ImageInput name="banner" path={profile?.banner ?? undefined} radius="sm" className="w-full h-full aspect-video" baseClassName="w-full" fallback={<GalleryHorizontalEndIcon size={100} />} />
      <ImageInput name="picture" size="lg" path={profile?.picture ?? undefined} showFallback />
      <Input name="name" defaultValue={profile?.name ?? undefined} isRequired label="Nama Lengkap" placeholder="fullname" />
    </div>
  )
}
