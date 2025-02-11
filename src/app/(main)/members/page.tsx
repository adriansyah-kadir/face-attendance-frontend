"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import MembersTable from "./table";
import {
  CirclePlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useState } from "react";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"accepted" | "pending" | "idle">();

  return (
    <div className="p-5 bg-gradient h-full">
      <div className="max-w-[1024px] mx-auto mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-white font-bold">Anggota</h2>
          {/* <Button color="primary" endContent={<CirclePlusIcon size={18} />}> */}
          {/*   Tambah */}
          {/* </Button> */}
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
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                startContent={<SlidersHorizontalIcon size={14} />}
              >
                Status: {status ?? "all"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(e) =>
                setStatus(
                  e.toString() === "all" ? undefined : (e.toString() as any),
                )
              }
            >
              <DropdownItem key={"all"}>all</DropdownItem>
              <DropdownItem key={"accepted"}>accepted</DropdownItem>
              <DropdownItem key={"pending"}>pending</DropdownItem>
              <DropdownItem key={"idle"}>idle</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <MembersTable search={search} status={status} />
      </div>
    </div>
  );
}
