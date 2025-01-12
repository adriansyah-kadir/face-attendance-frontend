import { ProfileContext } from "@/lib/providers/profile"
import { supabase } from "@/lib/supabase/client"
import { tryRemove } from "@/lib/supabase/storage"
import { Tables } from "@/lib/supabase/types"
import ProfileForm from "@/lib/ui/forms/profile_form"
import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
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

  const color = updateProfile.isSuccess ? "success" : (updateProfile.isError ? "warning" : "primary")

  return (
    <>
      <Modal hideCloseButton isOpen={profileFormModal.isOpen} onOpenChange={profileFormModal.onOpenChange}>
        <ModalContent>
          {onClose => (
            <Form onSubmit={ev => {
              ev.preventDefault()
              const data = Object.fromEntries(new FormData(ev.currentTarget!))
              updateProfile.mutate(data as any)
            }}>
              <ModalHeader>
                Edit Profile
              </ModalHeader>
              <ModalBody className="w-full">
                <ProfileForm />
              </ModalBody>
              <ModalFooter>
                <Button color={color} variant="shadow" type="submit" isLoading={updateProfile.isPending}>Simpan</Button>
                <Button type="reset" onPress={onClose}>Batal</Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
      <Button onPress={profileFormModal.onOpen} radius="full" variant="bordered" className="flex-shrink-0">Edit Profile</Button>
    </>
  )
}
