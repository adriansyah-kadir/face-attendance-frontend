import { useFacesQuery } from "@/lib/queries/faces";
import { supabase } from "@/lib/supabase/client";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";
import { Tables } from "@/lib/supabase/types";
import { Image, Button, Card, CardBody, CardFooter, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Tooltip, useDisclosure } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon, UserCheck } from "lucide-react";

export default function ReviewAcceptedModal({
  profile_id,
}: {
  profile_id: string;
}) {
  const modal = useDisclosure();

  return (
    <>
      <Tooltip content="Hapus" placement="left" delay={1000}>
        <Button onPress={modal.onOpen} size="sm" isIconOnly variant="light" color="success"><UserCheck strokeWidth={1.5} size={16} /></Button>
      </Tooltip>
      <Modal
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
        hideCloseButton
        scrollBehavior="outside"
      >
        <ModalContent>
          {() => <ReviewAccepted profile_id={profile_id} modal={modal} />}
        </ModalContent>
      </Modal>
    </>
  )
}

function ReviewAccepted({ profile_id, modal }: {
  profile_id: string,
  modal: ReturnType<typeof useDisclosure>;
}) {
  const accepted = useFacesQuery(profile_id, ["accepted"])

  return (
    <>
      <ModalHeader>Accepted Face</ModalHeader>
      <ModalBody>
        {accepted.isFetching && <Spinner />}
        {accepted.data.map((f) => (
          <Face face={f} />
        ))}
      </ModalBody>
      <ModalFooter><Button onPress={modal.onClose}>Kembali</Button></ModalFooter>
    </>
  )
}

function Face({ face }: { face: Tables<"faces"> }) {
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await supabase().from("face_embeddings").delete().eq("id", face.id!)
      if (result.error) throw result.error;
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faces-list"] });
    }
  })

  return (
    <Card isFooterBlurred className="border-none min-w-60 aspect-video" radius="lg">
      <Image
        className="object-cover"
        src={getPublicURLFormFullPath(face.image)}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny">Status</p>
        <Button
          className="text-tiny text-white"
          color={face.status == "accepted" ? "success" : "default"}
          radius="lg"
          size="sm"
          variant="shadow"
        >
          {face.status}
        </Button>
        <Button isLoading={deleteMutation.isPending} onPress={() => deleteMutation.mutate()} isIconOnly size="sm"><Trash2Icon size={18} /></Button>
      </CardFooter>
    </Card>
    // <Card>
    //   <CardBody className="p-0">
    //     <Image
    //       className="object-cover"
    //       height={200}
    //       src={getPublicURLFormFullPath(face.image)}
    //       width={200}
    //     />
    //   </CardBody>
    //   <CardFooter>
    //     <Button isLoading={deleteMutation.isPending} onPress={() => deleteMutation.mutate()} isIconOnly size="sm"><Trash2Icon size={18} /></Button>
    //   </CardFooter>
    // </Card>
  )
}
