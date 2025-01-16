"use client";
import { Button, Input } from "@nextui-org/react";
import MembersTable from "./table";
import {
  CalendarIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";

export default function MembersPage() {
  const [today, setToday] = useState(true);
  const [search, setSearch] = useState("")

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
        </div>
        <MembersTable today={today} search={search}/>
      </div>
    </div>
  );
}
