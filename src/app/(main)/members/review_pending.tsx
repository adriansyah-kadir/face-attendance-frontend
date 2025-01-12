import { SessionContext } from "@/lib/providers/session";
import { useFacesPending } from "@/lib/queries/faces";
import { supabase } from "@/lib/supabase/client";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";
import { Tables } from "@/lib/supabase/types";
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
import ky from "ky";
import { EyeIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { toast } from "sonner";

export default function ReviewPendingModal({
  member,
}: {
  member: Tables<"members">;
}) {
  const modal = useDisclosure();
  return (
    <>
      <Tooltip content="Review Pending" placement="left">
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
  const session = useContext(SessionContext);
  const queryClient = useQueryClient();
  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw Error("session error");

      const blob = await ky.get(getPublicURLFormFullPath(face.image)!).blob();
      const formData = new FormData();
      formData.set("file", blob);
      formData.set("token", session.access_token);
      const response = await ky
        .post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/faces`, {
          json: {
            request_id: face.id,
            token: session.access_token,
          },
          credentials: "include",
        })
        .json<Tables<"face_embeddings">>();
      await supabase().from("face_requests").delete().eq("id", face.id);
      queryClient.invalidateQueries({ queryKey: ["faces-list"] });
      return response;
    },
  });

  const declineMutation = useMutation({
    mutationFn: async () => {
      const [bucket, ...nodes] = face.image.split("/");
      await supabase()
        .storage.from(bucket)
        .remove([nodes.join("/")]);
      await supabase().from("face_requests").delete().eq("id", face.id);
      queryClient.invalidateQueries({ queryKey: ["faces-list"] });
    },
  });

  useEffect(() => {
    if (acceptMutation.isError) {
      toast.error(acceptMutation.error.message);
    }
  }, [acceptMutation.isError]);

  useEffect(() => {
    if (declineMutation.isError) {
      toast.error(declineMutation.error.message);
    }
  }, [declineMutation.isError]);

  return (
    <Card className="w-full h-auto aspect-video">
      <Image
        className="object-cover"
        height={200}
        src={getPublicURLFormFullPath(face.image)}
        width={200}
      />
      <CardFooter className="gap-3 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 bg-black/50 backdrop-blur-sm">
        <Button
          className="text-tiny text-white"
          color="danger"
          radius="lg"
          size="sm"
          variant="bordered"
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
          href={face.image!}
          target="_blank"
        >
          <EyeIcon size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
}
