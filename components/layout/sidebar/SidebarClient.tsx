"use client";

import { useSidebar } from "@/context/SidebarContext";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";

type Props = {
  user: { name: string; role: string; initials: string } | null;
};
