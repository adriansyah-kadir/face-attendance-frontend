"use client"

import { useQuery } from "@tanstack/react-query";
import FacesUploadForm from "./upload_form";
import { supabase } from "@/lib/supabase/client";
import { Button, Card, CardFooter, Image } from "@nextui-org/react";
import { useContext } from "react";
import { SessionContext } from "@/lib/providers/session";
import For from "../../../for";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";

export default function MemberView() {
  const session = useContext(SessionContext)
  const facesQuery = useQuery({
    initialData: [],
    queryKey: ['faces-list'],
    queryFn: async () => {
      const result = await supabase().from('faces').select("*").eq("profile_id", session!.user.id)
      if (result.error) throw result.error;
      return result.data;
    }
  })

  return (
    <div >
      <h4 className="text-lg mb-5">Data Wajah Absensi</h4>
      <div className="flex flex-wrap overflow-y-visible gap-3">
        <For items={facesQuery.data}>
          {(face, i) => (
            <Card key={i} isFooterBlurred className="border-none min-w-60 aspect-video" radius="lg">
              <Image
                className="object-cover"
                height={200}
                src={getPublicURLFormFullPath(face.image)}
                width={200}
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
              </CardFooter>
            </Card>
          )}
        </For>
        <FacesUploadForm />
      </div>
    </div>
  )
}
