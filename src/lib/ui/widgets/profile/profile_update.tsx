import { ProfileContext } from "@/lib/providers/profile"
import { supabase } from "@/lib/supabase/client"
import { tryRemove } from "@/lib/supabase/storage"
import { Tables } from "@/lib/supabase/types"
import ProfileForm from "@/lib/ui/forms/profile_form"
import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import { useMutation } from "@tanstack/react-query"
import { useContext } from "react"

export default function ProfileUpdate() {
  const profile = useContext(ProfileContext)
  const profileFormModal = useDisclosure()

  const updateProfile = useMutation<Tables<'profiles'>, Error, Pick<Tables<'profiles'>, 'name' | 'picture' | 'banner'>>({
    mutationFn: async input => {
      const update = await supabase().from("profiles").update(input).eq("id", profile!.id).select().single().throwOnError()
      await tryRemove(input.picture && profile?.picture, input.banner && profile?.banner)
      return update.data!
    }
  })


  return (
    <>
      <Modal hideCloseButton isOpen={profileFormModal.isOpen} onOpenChange={profileFormModal.onOpenChange}>
        <ModalContent>
          {() => (
            <ProfileForm modal={profileFormModal} mutation={updateProfile} />
          )}
        </ModalContent>
      </Modal>
      <Button onPress={profileFormModal.onOpen} radius="full" variant="bordered" className="flex-shrink-0">Edit Profile</Button>
    </>
  )
}
