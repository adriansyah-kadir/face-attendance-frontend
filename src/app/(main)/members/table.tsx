"use client"

import { supabase } from "@/lib/supabase/client";
import { Button, Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon, Trash2Icon, UserRoundPenIcon } from "lucide-react";
import { DateTime } from "luxon";
import ReviewPendingModal from "./review_pending";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";

function memberStatusColor(status?: string | null) {
  switch (status) {
    case "accepted": return "success"
    case "pending": return "warning"
    default: return "default"
  }
}

export default function MembersTable(props: { search?: string, status?: string }) {
  const membersQuery = useQuery({
    initialData: [],
    queryKey: ["member-list", "faces-list"],
    queryFn: async () => {
      const result = await supabase().from("members").select("*")
      if (result.error) throw result.error;
      return result.data;
    }
  })

  return (
    <Table isCompact>
      <TableHeader columns={["Nama"]}>
        <TableColumn>
          Nama
        </TableColumn>
        <TableColumn>
          UID
        </TableColumn>
        <TableColumn>
          Role
        </TableColumn>
        <TableColumn>
          Joined At
        </TableColumn>
        <TableColumn>
          <div className="flex items-center gap-2">
            <Tooltip content={<StatusHelp />} showArrow shouldFlip>
              <InfoIcon size={16} />
            </Tooltip>
            Status
          </div>
        </TableColumn>
        <TableColumn align="center">
          Aksi
        </TableColumn>
      </TableHeader>
      <TableBody isLoading={membersQuery.isFetching} loadingContent={<Spinner label="Loading ..." />}>
        {membersQuery.data.filter(e => {
          const search = props.search?.toLowerCase() ?? ''
          const name = e.name?.toLowerCase().includes(search)
          const uid = e.uid?.toLowerCase().includes(search)
          const email = e.email?.includes(search)
          const status = props.status === undefined ? true : props.status === e.status
          return name || uid || email && status
        }).map(member => (
          <TableRow key={member.id}>
            <TableCell>
              <User name={member.name} description={member.email} avatarProps={{ src: getPublicURLFormFullPath(member.picture), size: "sm" }} />
            </TableCell>
            <TableCell>
              {member.uid ?? '-'}
            </TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>{DateTime.fromISO(member.created_at!).toLocaleString()}</TableCell>
            <TableCell >
              <Chip size="sm" className="border-none" variant="dot" color={memberStatusColor(member.status)}>
                {member.status}
              </Chip>
            </TableCell>
            <TableCell>
              <Tooltip content="Edit" placement="left">
                <Button size="sm" isIconOnly variant="light"><UserRoundPenIcon strokeWidth={1.5} size={16} /></Button>
              </Tooltip>
              <Tooltip content="Hapus" placement="left">
                <Button size="sm" isIconOnly variant="light" color="danger"><Trash2Icon strokeWidth={1.5} size={16} /></Button>
              </Tooltip>
              <ReviewPendingModal member={member} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

  )
}

function StatusHelp() {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <Chip size="sm" className="border-none" variant="dot" color={memberStatusColor("idle")}>
              Idle
            </Chip>
          </td>
          <td>
            anggota hanya login dan tidak menginput data wajah
          </td>
        </tr>
        <tr>
          <td>
            <Chip size="sm" className="border-none" variant="dot" color={memberStatusColor("pending")}>
              Pending
            </Chip>
          </td>
          <td>
            anggota telah menginput data wajah yang belum di review
          </td>
        </tr>
        <tr>
          <td>
            <Chip size="sm" className="border-none" variant="dot" color={memberStatusColor("accepted")}>
              Accepted
            </Chip>
          </td>
          <td>
            semua data wajah anggota telah di review dan di terima
          </td>
        </tr>
      </tbody>
    </table>
  )
}
