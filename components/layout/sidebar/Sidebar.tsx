import SidebarClient from "./SidebarClient";

type Props = {
  user: {
    name: string;
    email: string;
    initials: string;
    role: string;
  } | null;
};

export default function Sidebar({ user }: Props) {
  return <SidebarClient user={user} />;
}
