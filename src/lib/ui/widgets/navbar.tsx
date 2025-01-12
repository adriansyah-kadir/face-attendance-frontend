'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import SessionActions from "./session_actions";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { SessionContext } from "@/lib/providers/session";

export default function MyNavbar() {
  const session = useContext(SessionContext)
  const pathname = usePathname()
  const sessionLinks = [{ label: "Profile", uri: "/profile" }, { label: "Absensi", uri: "/attendances" }]
  const defaultLinks = [{ label: "Live Absen", uri: "/absen" }, { label: "Tentang", uri: "/about" }]
  const adminLinks = [{ label: "Anggota", uri: "/members" }]


  return (
    <Navbar>
      <NavbarBrand>
        <a href="/">
          <p className="font-bold text-inherit">ACME</p>
        </a>
      </NavbarBrand>
      <NavbarContent justify="center">
        {defaultLinks.map(link => {
          const isActive = pathname.startsWith(link.uri)
          return (
            <NavbarItem key={link.uri} isActive={isActive}>
              <Link color={isActive ? "primary" : "foreground"} href={link.uri} aria-current={isActive && "page"}>{link.label}</Link>
            </NavbarItem>
          )
        })}
        {session && sessionLinks.map(link => {
          const isActive = pathname.startsWith(link.uri)
          return (
            <NavbarItem key={link.uri} isActive={isActive}>
              <Link color={isActive ? "primary" : "foreground"} href={link.uri} aria-current={isActive && "page"}>{link.label}</Link>
            </NavbarItem>
          )
        })}
        {session?.user.role === 'admin' && adminLinks.map(link => {
          const isActive = pathname.startsWith(link.uri)
          return (
            <NavbarItem key={link.uri} isActive={isActive}>
              <Link color={isActive ? "primary" : "foreground"} href={link.uri} aria-current={isActive && "page"}>{link.label}</Link>
            </NavbarItem>
          )
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <SessionActions />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
