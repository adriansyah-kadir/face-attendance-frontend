"use client";

import { useAttendancesQuery } from "@/lib/queries/attendances";
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
  User,
} from "@nextui-org/react";
import { EyeIcon } from "lucide-react";

function absenType(t: string) {
  switch (t) {
    case "in":
      return "Masuk"
    case "out":
      return "Pulang"
    default:
      return "Masuk"
  }
}

export default function MembersTable(props: { attendances: ReturnType<typeof useAttendancesQuery>["data"], isFetching?: boolean }) {
  const attendancesQuery = props.attendances;

  return (
    <Table isCompact>
      <TableHeader columns={["Nama"]}>
        <TableColumn>Timestamp</TableColumn>
        <TableColumn>Nama</TableColumn>
        <TableColumn>Image</TableColumn>
        <TableColumn >Persentase</TableColumn>
        <TableColumn align="center">Type</TableColumn>
        {/* <TableColumn align="center">Aksi</TableColumn> */}
      </TableHeader>
      <TableBody
        isLoading={props.isFetching}
        loadingContent={<Spinner label="Loading ..." />}
      >
        {attendancesQuery.map((attendance) => (
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
            <TableCell>
              {absenType(getany(attendance.data, ["type"], "in")!)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
