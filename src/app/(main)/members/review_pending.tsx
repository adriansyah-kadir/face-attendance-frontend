import { SessionContext } from "@/lib/providers/session";
import { useFacesPending } from "@/lib/queries/faces";
import { supabase } from "@/lib/supabase/client";
import { useRealtimeSettings } from "@/lib/supabase/realtime/settings";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";
import { Tables } from "@/lib/supabase/types";
import { getany } from "@/lib/utils";
import {
  Button,
  Card,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky, { HTTPError } from "ky";
import { EyeIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { toast } from "sonner";

export default function ReviewPendingModal({
  member,
}: {
  member: Tables<"members">;
}) {
  const modal = useDisclosure();
  return (
    <>
      <Tooltip content="Review Pending" placement="left" delay={1000}>
        <Button
          onPress={modal.onOpen}
          size="sm"
          isIconOnly
          variant="light"
          color="warning"
        >
          <ListTodoIcon strokeWidth={1.5} size={16} />
        </Button>
      </Tooltip>
      <Modal
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
        hideCloseButton
        scrollBehavior="outside"
      >
        <ModalContent>
          {() => <ReviewPending member={member} modal={modal} />}
        </ModalContent>
      </Modal>
    </>
  );
}

function ReviewPending({
  member,
  modal,
}: {
  member: Tables<"members">;
  modal: ReturnType<typeof useDisclosure>;
}) {
  const facesQuery = useFacesPending(member.id!);

  return (
    <>
      <ModalHeader>Review {member.name} Pending</ModalHeader>
      <ModalBody className="items-center">
        {facesQuery.data.map((f) => (
          <FaceRequestCard key={f.id} face={f} />
        ))}
      </ModalBody>
      <ModalFooter>
        <Button onPress={modal.onClose}>Kembali</Button>
      </ModalFooter>
    </>
  );
}

function FaceRequestCard({ face }: { face: Tables<"face_requests"> }) {
  const settings = useRealtimeSettings()
  const session = useContext(SessionContext);
  const queryClient = useQueryClient();
  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!session || session.user.role !== "manager") throw Error("Authorization Error");

      const response = await ky
        .post(`${getany(settings, ["BACKEND_SERVER", "value"], "http://localhost:9898")}/faces`, {
          json: {
            request_id: face.id,
            token: session.access_token,
          },
          credentials: "include",
          keepalive: true,
          timeout: false,
        })
        .json<Tables<"face_embeddings">>();
      return response;
    },
    async onSuccess() {
      toast.success("Registrasi wajah sukses")
      await supabase().from("face_requests").delete().eq("id", face.id);
      queryClient.invalidateQueries({ queryKey: ["faces-list"] });
    },
    async onError(err) {
      if (err instanceof HTTPError) {
        const data = await err.response.json()
        toast.error(data["detail"])
      } else {

        toast.error(err.message);
      }
    }
  });

  const declineMutation = useMutation({
    mutationFn: async () => {
      const [bucket, ...nodes] = face.image.split("/");
      await supabase()
        .storage.from(bucket)
        .remove([nodes.join("/")]);
      await supabase().from("face_requests").delete().eq("id", face.id);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["faces-list"] });
    },
    onError(err) {
      toast.error(err.message);
    }
  });

  return (
    <Card isFooterBlurred className="border-none min-w-60 aspect-video" radius="lg">
      <Image
        className="object-cover"
        src={getPublicURLFormFullPath(face.image)}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <Button
          className="text-tiny text-white"
          color="danger"
          radius="lg"
          size="sm"
          isLoading={declineMutation.isPending}
          onPress={() => declineMutation.mutate()}
        >
          Decline
        </Button>
        <Button
          className="text-tiny text-white"
          color="success"
          radius="lg"
          size="sm"
          isLoading={acceptMutation.isPending}
          onPress={() => acceptMutation.mutate()}
        >
          Accept
        </Button>
        <Button
          className="text-tiny"
          radius="lg"
          size="sm"
          isIconOnly
          as={Link}
          href={getPublicURLFormFullPath(face.image)}
          target="_blank"
        >
          <EyeIcon size={18} />
        </Button>
      </CardFooter>
    </Card>
    // <Card className="w-full h-auto aspect-video">
    //   <Image
    //     className="object-cover"
    //     height={200}
    //     src={getPublicURLFormFullPath(face.image)}
    //     width={200}
    //   />
    //   <CardFooter className="gap-3 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 bg-black/50 backdrop-blur-sm">
    //     <Button
    //       className="text-tiny text-white"
    //       color="danger"
    //       radius="lg"
    //       size="sm"
    //       variant="bordered"
    //       isLoading={declineMutation.isPending}
    //       onPress={() => declineMutation.mutate()}
    //     >
    //       Decline
    //     </Button>
    //     <Button
    //       className="text-tiny text-white"
    //       color="success"
    //       radius="lg"
    //       size="sm"
    //       isLoading={acceptMutation.isPending}
    //       onPress={() => acceptMutation.mutate()}
    //     >
    //       Accept
    //     </Button>
    //     <Button
    //       className="text-tiny"
    //       radius="lg"
    //       size="sm"
    //       isIconOnly
    //       as={Link}
    //       href={getPublicURLFormFullPath(face.image)}
    //       target="_blank"
    //     >
    //       <EyeIcon size={18} />
    //     </Button>
    //   </CardFooter>
    // </Card>
  );
}
