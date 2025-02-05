import { Button, Input, ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { GalleryHorizontalEndIcon } from "lucide-react";
import ImageInput from "../widgets/image_input";
import { useContext, useState } from "react";
import { ProfileContext } from "@/lib/providers/profile";
import { useMutation } from "@tanstack/react-query";
import { Tables } from "@/lib/supabase/types";

export default function ProfileForm({ mutation, modal }: { mutation: ReturnType<typeof useMutation<Tables<'profiles'>, Error, Pick<Tables<'profiles'>, 'name' | 'picture' | 'banner'>>>, modal: ReturnType<typeof useDisclosure> }) {
  const profile = useContext(ProfileContext)
  const color = mutation.isSuccess ? "success" : (mutation.isError ? "warning" : "primary")
  const [banner, setBanner] = useState(profile?.banner)
  const [picture, setPicture] = useState(profile?.picture)
  const [name, setName] = useState(profile?.name)

  return (
    <>
      <ModalHeader>
        Edit Profile
      </ModalHeader>
      <ModalBody className="w-full">
        <div className="space-y-3 w-full">
          <ImageInput onUploaded={v => setBanner(v.fullPath)} folder="profile" name="banner" path={profile?.banner ?? undefined} radius="sm" className="w-full h-full aspect-video" baseClassName="w-full" fallback={<GalleryHorizontalEndIcon size={100} />} />
          <ImageInput onUploaded={v => setPicture(v.fullPath)} folder="profile" name="picture" size="lg" path={profile?.picture ?? undefined} showFallback />
          <Input onValueChange={v => setName(v)} name="name" defaultValue={profile?.name ?? undefined} isRequired label="Nama Lengkap" placeholder="fullname" />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onPress={() => mutation.mutate({ banner: banner ?? null, picture: picture ?? null, name: name ?? null })} color={color} variant="shadow" type="submit" isLoading={mutation.isPending}>Simpan</Button>
        <Button type="reset" onPress={modal.onClose}>Batal</Button>
      </ModalFooter>
    </>
  )
}
