"use client"

import { ProfileContext } from "@/lib/providers/profile";
import { SessionContext } from "@/lib/providers/session";
import { useHasRegisterFace } from "@/lib/states/profile";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function RegisterFaceInfo() {
  const session = useContext(SessionContext)
  const profile = useContext(ProfileContext)
  const hasRegistered = useHasRegisterFace(profile)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (hasRegistered === false && session?.user.role !== "manager") setShow(true)
  }, [hasRegistered])

  return (
    <Modal isOpen={show} hideCloseButton onOpenChange={setShow}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Anda Belum Registrasi Wajah
            </ModalHeader>
            <ModalBody>
              Untuk dapat melakukan absensi anda terlebih dahulu harus meregistrasi foto wajah anda
              yang nantinya akan di terima oleh Admin jika sesuai dengan ketentuan
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>Abaikan</Button>
              <Button onPress={onClose} color="primary" as={Link} href="/profile?registerFaceForm">Register Wajah</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
