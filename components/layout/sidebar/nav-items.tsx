import { NavItem } from "@/types/nav";
import { LayoutGrid, FolderKanban, Activity, Settings } from "lucide-react";

export const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/",
    icon: <LayoutGrid size={30} />,
  },
  {
    label: "Projects",
    badge: 5,
    href: "/projects",
    icon: <FolderKanban size={30} />,
  },
  {
    label: "Activity",
    href: "/activity",
    badge: 8,
    icon: <Activity size={30} />,
  },
];

export const accountItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings size={30} />,
  },
];
