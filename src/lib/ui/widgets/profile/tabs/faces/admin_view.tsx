import { supabase } from "@/lib/supabase/client";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export default function AdminView() {
  const facesQuery = useQuery({
    initialData: [],
    queryKey: ['faces-list'],
    queryFn: async () => {
      const result = await supabase().from('faces').select("*")
      if (result.error) throw result.error;
      return result.data
    }
  })
  const grouped = useMemo(() => Object.groupBy(facesQuery.data, e => e.profile_id!), [facesQuery.data])

  useEffect(() => {
    facesQuery.refetch()
  }, [])

  return (
    <div>
      <h4 className="text-lg mb-5">Data Wajah Absensi</h4>
      <div className="space-y-10">
        {Object.keys(grouped).map(user_id => {
          return (
            <div key={user_id}>
              <h4>{user_id}</h4>
              <div className="flex gap-3">
                {grouped[user_id]!.map((face, i) => (
                  <Card key={i} isFooterBlurred>
                    <CardBody className="flex items-center justify-center min-w-60 aspect-video">
                      <img src={face.image!} />
                    </CardBody>
                    <CardFooter className="absolute bottom-0 bg-black/20 border-t left-0">
                      <Button size="sm">{face.status}</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        <div>
          <h4></h4>
        </div>
      </div>
    </div>
  )
}
