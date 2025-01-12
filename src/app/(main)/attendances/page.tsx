"use client"

import { Button, Input } from "@nextui-org/react";
import MembersTable from "./table";
import { ListFilterIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

export default function MembersPage() {
  return (
    <div className="p-5 bg-gradient h-full">
      <div className="max-w-[1024px] mx-auto mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-white font-bold">Absensi</h2>
        </div>
        <div className="flex flex-wrap gap-3 items-center my-5">
          <Input size="sm" placeholder="Search" className="w-auto" endContent={<SearchIcon size={18} />} />
          <Button size="sm" startContent={<SlidersHorizontalIcon size={14} />}>Filter</Button>
          <Button size="sm" startContent={<ListFilterIcon size={14} />}>Sort</Button>
        </div>
        <MembersTable />
      </div>
    </div>
  )
}
