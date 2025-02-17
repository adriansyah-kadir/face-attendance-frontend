"use client"

import { pickFiles } from "@/lib/utils"
import { Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { CircleArrowRightIcon, ImageIcon } from "lucide-react"
import { useMemo, useState } from "react"
import ImageInput from "../../../image_input"
import { supabase } from "@/lib/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Tables } from "@/lib/supabase/types"

export default function FacesUploadForm() {
  const facesModal = useDisclosure({})
  const [files, setFiles] = useState<File[]>([])

  async function openModal() {
    const files = await pickFiles({ multiple: true, accept: "image/*" })
    setFiles(files)
    if (files.length > 0) facesModal.onOpen()
  }

  return (
    <>
      <Card isPressable className="shadow-none border flex-shrink-0" onPress={openModal}>
        <CardBody className="flex items-center justify-center min-w-60 aspect-video flex-shrink-0">
          <CircleArrowRightIcon />
          <small>Tambah Wajah</small>
        </CardBody>
      </Card>

      <Modal hideCloseButton isOpen={facesModal.isOpen} onOpenChange={facesModal.onOpenChange} scrollBehavior="outside">
        <ModalContent>
          {onClose => <UploadModal onClose={onClose} files={files} />}
        </ModalContent>
      </Modal>
    </>
  )
}

export function UploadModal(props: {
  onClose: () => void,
  files: File[]
}) {
  const [filesUrl, setFilesUrl] = useState<(string | null)[]>(Array(props.files.length).fill(null))
  const valids = useMemo(() => filesUrl.filter(e => e !== null), [filesUrl])
  const queryClient = useQueryClient()
  const sendMutation = useMutation<Tables<'face_requests'>[], Error, string[]>({
    mutationFn: async urls => {
      const result = await supabase()
        .from("face_requests")
        .insert(urls.map(e => ({ image: e })))
        .select()
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faces-list"] })
    }
  })
  const submitColor = useMemo(() => {
    if (sendMutation.isSuccess) return "success";
    if (sendMutation.isError) return "danger";
    return "primary"
  }, [sendMutation])

  async function sendRequest() {
    if (valids.length > 0) {
      sendMutation.mutate(valids)
    }
  }

  return (
    <>
      <ModalHeader>Input Data Wajah</ModalHeader>
      <ModalBody className="w-full">
        {props.files.map((img, i) => (
          <ImageInput
            folder="faces"
            onUploaded={data => {
              setFilesUrl(prev => {
                prev[i] = data.fullPath
                return [...prev]
              })
            }}
            onPick={() => {
              setFilesUrl(prev => {
                prev[i] = null;
                return [...prev]
              })
            }}
            fallback={<ImageIcon />}
            showFallback
            radius="sm"
            className="w-full h-auto aspect-video"
            baseClassName="w-full"
            name={img.name}
            key={img.name}
            uploadFile={img}
          />
        ))}
      </ModalBody>
      <ModalFooter>
        <Button
          color={submitColor}
          variant="shadow"
          type="submit"
          isDisabled={valids.length != props.files.length}
          isLoading={sendMutation.isPending}
          onPress={sendRequest}
        >
          Simpan
        </Button>
        <Button type="reset" onPress={props.onClose}>Batal</Button>
      </ModalFooter>
    </>
  )
}
