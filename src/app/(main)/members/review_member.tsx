import { useFacesQuery } from "@/lib/queries/faces"
import { Tables } from "@/lib/supabase/types"
import { Avatar, Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, Tooltip, useDisclosure } from "@nextui-org/react"
import { EditIcon } from "lucide-react"
import Link from "next/link"

export default function ReviewMemberModal({ member }: { member: Tables<'members'> }) {
  const modal = useDisclosure()

  return (
    <>
      <Tooltip content="Edit">
        <Button onPress={modal.onOpen} size="sm" isIconOnly variant="light"><EditIcon strokeWidth={1.5} size={16} /></Button>
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
  const facesQuery = useFacesQuery(member.id!)

  return (
    <>
      <ModalHeader>Review</ModalHeader>
      <ModalBody>
        <p>{member.name}</p>
        <div>
          <p>Pending</p>
          <ScrollShadow orientation="horizontal" className="flex py-5 gap-3">
            {facesQuery.data.filter(f => f.status === 'pending').map((f, i) => (
              <Avatar as={Link} href={f.image!} target="_blank" isBordered radius="sm" className="w-60 flex-shrink-0 h-auto aspect-video" src={f.image!} key={i} />
            ))}
          </ScrollShadow>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary">Confirm</Button>
        <Button onPress={modal.onClose}>Cancel</Button>
      </ModalFooter>
    </>
  )
}
