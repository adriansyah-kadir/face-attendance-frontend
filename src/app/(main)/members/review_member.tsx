import { useFacesQuery } from "@/lib/queries/faces"
import { supabase } from "@/lib/supabase/client"
import { Tables } from "@/lib/supabase/types"
import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, Tooltip, useDisclosure } from "@nextui-org/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UserRoundPenIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ReviewMemberModal({ member }: { member: Tables<'members'> }) {
  const modal = useDisclosure()

  return (
    <>
      <Tooltip content="Edit" placement="left">
        <Button onPress={modal.onOpen} size="sm" isIconOnly variant="light"><UserRoundPenIcon strokeWidth={1.5} size={16} /></Button>
      </Tooltip>
      <Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange} hideCloseButton scrollBehavior="outside">
        <ModalContent>
          {() => (
            <ReviewMember member={member} modal={modal} />
          )}
        </ModalContent>
      </Modal>
    </>
  )
}


function ReviewMember({ member, modal }: { member: Tables<'members'>, modal: ReturnType<typeof useDisclosure> }) {
  const query = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: async () => {
      const result = await supabase().from("profiles").update({
        uid: member.uid ?? undefined,
      }).eq("id", member.id!).select().single()
      if (result.error) throw result.error;
      return result.data;
    },
    onError(err) {
      toast.error(err.name, { description: err.message })
    },
    onSuccess() {
      query.invalidateQueries({ queryKey: ["member-list"] })
      modal.onClose()
    }
  })

  return (
    <>
      <ModalHeader>Review</ModalHeader>
      <ModalBody>
        <p>{member.name}</p>
        <Input defaultValue={member.uid ?? ""} label="UID" onValueChange={v => member.uid = v} />
      </ModalBody>
      <ModalFooter>
        <Button isLoading={updateMutation.isPending} onPress={() => updateMutation.mutate()} color="primary">Simpan</Button>
        <Button onPress={modal.onClose}>Kembali</Button>
      </ModalFooter>
    </>
  )
}
