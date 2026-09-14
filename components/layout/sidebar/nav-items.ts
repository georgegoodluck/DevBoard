import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types/nav";

export const navItems: NavItem[] = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];
