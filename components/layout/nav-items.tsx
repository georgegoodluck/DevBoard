import { NavItems } from "@/types/nav";
import { LayoutGrid, FolderKanban, Activity, Settings } from "lucide-react";

export const navItems: NavItems[] = [
  {
    label: "Overview",
    href: "/",
    icon: <LayoutGrid size={14} />,
  },
  {
    label: "Projects",
    badge: 12,
    href: "/projects",
    icon: <FolderKanban size={14} />,
  },
  {
      label: "Activity",
      href: "/activity",
      badge: 6,
      icon: <Activity size={14} />,
    },
];

export const accountItems : NavItems[] = [
    {
        label: "Settings",
        href: '/settings',
        icon: <Settings size={14} />
    }
]