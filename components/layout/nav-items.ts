import { NavItems } from "@/types/nav";

export const navItems: NavItems[] = [
  {
    label: "Overview",
    href: "/",
    icon: null,
  },
  {
    label: "Activity",
    href: "/activity",
    badge: 6,
    icon: null,
  },
  {
    label: "Projects",
    badge: 12,
    href: "/projects",
    icon: null,
  },
];

export const accountItems : NavItems[] = [
    {
        label: "Settings",
        href: '/settings',
        icon: null
    }
]