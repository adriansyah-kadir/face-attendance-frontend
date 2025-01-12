"use client"

import { supabase } from "@/lib/supabase/client";
import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";

export default function MembersTable() {
  const attendancesQuery = useQuery({
    initialData: [],
    queryKey: ["attendance-list"],
    queryFn: async () => {
      const result = await supabase().from("attendances").select("*, profiles(*, user:users!profiles_id_fkey(*))")
      if (result.error) throw result.error;
      return result.data;
    }
  })

  return (
    <Table isCompact>
      <TableHeader columns={["Nama"]}>
        <TableColumn>
          Timestamp
        </TableColumn>
        <TableColumn>
          Nama
        </TableColumn>
        <TableColumn>
          Image
        </TableColumn>
        <TableColumn align="center">
          Persentase
        </TableColumn>
        <TableColumn align="center">
          Aksi
        </TableColumn>
      </TableHeader>
      <TableBody isLoading={attendancesQuery.isFetching} loadingContent={<Spinner label="Loading ..." />}>
        {attendancesQuery.data.map(attendance => (
          <TableRow key={attendance.id}>
            <TableCell>{new Date(attendance.created_at).toLocaleString()}</TableCell>
            <TableCell>
              <User name={attendance.profiles?.name} description={attendance.profiles?.user?.email} avatarProps={{ src: attendance.profiles?.picture ?? undefined, size: "sm" }} />
            </TableCell>
            <TableCell>Image</TableCell>
            <TableCell>100%</TableCell>
            <TableCell>
              <Tooltip content="Hapus">
                <Button size="sm" isIconOnly variant="light" color="danger"><Trash2Icon strokeWidth={1.5} size={16} /></Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

  )
}
