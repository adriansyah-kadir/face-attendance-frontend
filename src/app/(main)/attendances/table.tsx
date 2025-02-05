"use client";

import { supabase } from "@/lib/supabase/client";
import { getAttendancesToday } from "@/lib/supabase/query";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";
import { getany } from "@/lib/utils";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, Trash2Icon } from "lucide-react";

export default function MembersTable(props: { today?: boolean, search?: string }) {
  const attendancesQuery = useQuery({
    initialData: [],
    queryKey: ["attendance-list", props.today],
    queryFn: async () => {
      if (props.today) {
        const result = await getAttendancesToday(supabase(), "Asia/Makassar");
        if (result.error) throw result.error;
        return result.data;
      }

      const result = await supabase()
        .from("attendances")
        .select("*, profiles(*, user:users!profiles_id_fkey(*))");
      if (result.error) throw result.error;
      return result.data;
    },
  });

  return (
    <Table isCompact>
      <TableHeader columns={["Nama"]}>
        <TableColumn>Timestamp</TableColumn>
        <TableColumn>Nama</TableColumn>
        <TableColumn>Image</TableColumn>
        <TableColumn align="center">Persentase</TableColumn>
        {/* <TableColumn align="center">Aksi</TableColumn> */}
      </TableHeader>
      <TableBody
        isLoading={attendancesQuery.isFetching}
        loadingContent={<Spinner label="Loading ..." />}
      >
        {attendancesQuery.data.filter(e => {
          const search = props.search?.toLowerCase() ?? ''
          const name = e.profiles?.name?.toLowerCase().includes(search)
          const uid = e.profiles?.uid?.toLowerCase().includes(search)
          const email = e.profiles?.user?.email?.includes(search)
          return name || uid || email
        }).map((attendance) => (
          <TableRow key={attendance.id}>
            <TableCell>
              {new Date(attendance.created_at).toLocaleString("id")}
            </TableCell>
            <TableCell>
              <User
                name={attendance.profiles?.name}
                description={
                  attendance.profiles?.uid ?? attendance.profiles?.user?.email
                }
                avatarProps={{
                  src: attendance.profiles?.picture ?? undefined,
                  size: "sm",
                }}
              />
            </TableCell>
            <TableCell>
              <a
                href={getPublicURLFormFullPath(
                  getany(attendance.data, ["image"]),
                )}
              >
                <Button size="sm" isIconOnly variant="flat">
                  <EyeIcon size={18} />
                </Button>
              </a>
            </TableCell>
            <TableCell>
              {(getany(attendance.data, ["similarity"], 0)! * 100).toFixed(2)}%
            </TableCell>
            {/* <TableCell> */}
            {/*   <Tooltip content="Hapus"> */}
            {/*     <Button size="sm" isIconOnly variant="light" color="danger"> */}
            {/*       <Trash2Icon strokeWidth={1.5} size={16} /> */}
            {/*     </Button> */}
            {/*   </Tooltip> */}
            {/* </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
