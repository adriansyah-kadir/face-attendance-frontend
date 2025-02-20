"use client";
import { Button, Input } from "@nextui-org/react";
import MembersTable from "./table";
import {
  CalendarIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAttendancesQuery } from "@/lib/queries/attendances";
import { getany, saveToExcel } from "@/lib/utils";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";

export default function MembersPage() {
  const [today, setToday] = useState(true);
  const [search, setSearch] = useState("")
  const attendances = useAttendancesQuery(today)
  const filtered = useMemo(() => attendances.data.filter((e) => {
    const keyword = search.toLowerCase() ?? ''
    const name = e.profiles?.name?.toLowerCase().includes(keyword)
    const uid = e.profiles?.uid?.toLowerCase().includes(keyword)
    const email = e.profiles?.user?.email?.includes(keyword)
    return name || uid || email
  }), [search, attendances])


  async function download() {
    await saveToExcel(filtered.map(e => {
      return {
        id: e.id,
        tanggal: e.created_at,
        nama: e.profiles?.name,
        uid: e.profiles?.uid,
        similarity: getany(e.data, ["similarity"], 0)! * 100,
        image: getPublicURLFormFullPath(getany(e.data, ["image"]))
      }
    }), "data.xlsx")
  }

  return (
    <div className="p-5 bg-gradient h-full">
      <div className="max-w-[1024px] mx-auto mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-white font-bold">Absensi</h2>
        </div>
        <div className="flex flex-wrap gap-3 items-center my-5">
          <Input
            value={search}
            onValueChange={setSearch}
            size="sm"
            placeholder="Search"
            className="w-auto"
            endContent={<SearchIcon size={18} />}
          />
          <Button
            color={today ? "primary" : "default"}
            size="sm"
            startContent={<CalendarIcon size={14} />}
            onPress={() => setToday((t) => !t)}
          >
            Today
          </Button>
          <Button
            color="primary"
            size="sm"
            startContent={<DownloadIcon size={14} />}
            onPress={download}
          >
            Download
          </Button>
        </div>
        <MembersTable attendances={filtered} isFetching={attendances.isFetching} />
      </div>
    </div>
  );
}
