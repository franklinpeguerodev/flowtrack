"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Receipt,
  FileBarChart,
  FolderOpen,
  Wallet,
  CreditCard,
  TrendingUp,
  LogOut,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EditProfileDialog } from "@/components/edit-profile-dialog";

const navItems = [
  { title: "Categorías", url: "/dashboard", icon: Receipt },
  { title: "Gastos", url: "/dashboard/expenses", icon: Wallet },
  { title: "Presupuestos", url: "/dashboard/budgets", icon: TrendingUp },
  { title: "Métodos de pago", url: "/dashboard/payment-methods", icon: CreditCard },
  { title: "Reporte", url: "/dashboard/reports", icon: FileBarChart },
  { title: "Archivos", url: "/dashboard/files/import", icon: FolderOpen },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "??";

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2 px-1">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="size-4" />
          </div>
          <span className="text-base font-semibold">flowtrack</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="h-auto py-2" size="lg">
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col text-left">
                  <span className="truncate text-sm font-medium">
                    {user?.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
              <UserCog />
              Editar perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </Sidebar>
  );
}