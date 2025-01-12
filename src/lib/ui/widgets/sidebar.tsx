"use client"
import { signout } from "@/lib/auth";
import { ProfileContext } from "@/lib/providers/profile";
import { SessionContext } from "@/lib/providers/session";
import { Avatar, Button, ButtonProps, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, ScrollShadow, User, UserProps } from "@nextui-org/react";
import { EllipsisVerticalIcon, ExpandIcon, FileIcon, ScanFaceIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContextType, createContext, useContext, useEffect, useState } from "react";
import Show from "./show";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";

const SidebarContext = createContext({
  expanded: true,
  setExpanded: (_: boolean) => { },
})

export default function Sidebar() {
  const [context, setContext] = useState<ContextType<typeof SidebarContext>>({
    expanded: true,
    setExpanded: expanded => setContext(prev => ({ ...prev, expanded })),
  })

  function onResize() {
    if (window.innerWidth < 600) context.setExpanded(false);
  }

  useEffect(() => {
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <SidebarContext.Provider value={context}>
      <div
        className="h-full bg-[#f3f3f3] flex flex-col flex-shrink-0"
      >
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter />
      </div>
    </SidebarContext.Provider>
  )
}

function SidebarHeader() {
  const profile = useContext(ProfileContext)
  const session = useContext(SessionContext)
  const sidebar = useContext(SidebarContext)

  return (
    <div className={cn("flex flex-col p-2 gap-2")}>
      <Link href="/" className="my-2">
        <SidebarProfile
          className="justify-start"
          name={<p className="font-bold text-inherit">{process.env.NEXT_PUBLIC_APP_NAME}</p>}
          avatarProps={{ src: "/globe.svg", radius: "lg" }}
        />
      </Link>
      <div className="flex items-center justify-between gap-3">
        <Link href={session ? "/profile" : "/signin"}>
          <SidebarProfile
            description={session?.user.role ?? "unauthenticated"}
            name={profile?.name ?? (session ? "Setup" : "Sign In")}
            avatarProps={{ src: getPublicURLFormFullPath(profile?.picture), isBordered: true, showFallback: true }}
          />
        </Link>
        {sidebar.expanded && (
          <Dropdown>
            <DropdownTrigger>
              <Button size="sm" variant="light" isIconOnly><EllipsisVerticalIcon size={16} /></Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="logout" onPress={signout}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </div>
  )
}

function SidebarContent() {
  const session = useContext(SessionContext)

  return (
    <ScrollShadow className="h-full p-2 gap-2 flex flex-col">
      <SidebarItem as={Link} href="/live" variant="light" startContent={<ScanFaceIcon size={18} />}>Live Absen</SidebarItem>
      <Show when={!!session}>
        <SidebarItem as={Link} href="/attendances" variant="light" startContent={<FileIcon size={18} />}>Rekap</SidebarItem>
        <Show when={session?.user.role === "manager"}>
          <SidebarItem as={Link} href="/members" variant="light" startContent={<UsersIcon size={18} />}>Anggota</SidebarItem>
        </Show>
      </Show>
    </ScrollShadow>
  )
}

function SidebarFooter() {
  const sidebar = useContext(SidebarContext)

  return (
    <div className="p-2 gap-2 flex flex-col">
      <SidebarItem
        onPress={() => sidebar.setExpanded(!sidebar.expanded)}
        variant="flat"
        startContent={<ExpandIcon size={18} />}
      >Expand</SidebarItem>
    </div>
  )
}

function SidebarItem(props: Partial<ButtonProps>) {
  const sidebar = useContext(SidebarContext)
  const pathname = usePathname()
  const active = props.href && pathname.startsWith(props.href)

  return (
    <Button
      {...props}
      variant={active ? "flat" : props.variant}
      color={active ? "primary" : "default"}
      isIconOnly={!sidebar.expanded}
      className={cn(props.className, { "justify-start": sidebar.expanded })}
    >{sidebar.expanded ? props.children : null}</Button>
  )
}

function SidebarProfile(props: UserProps & { href?: string }) {
  const sidebar = useContext(SidebarContext)

  if (!sidebar.expanded) return (
    <Avatar {...props.avatarProps} />
  )

  return (
    <User
      {...props}
      className={cn("justify-start min-w-40", props.className)}
    />
  )
}
