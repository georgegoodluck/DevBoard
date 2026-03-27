import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItems } from "@/types/nav";

export default function NavLink({ item }: { item: NavItems }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {item.icon}
      {item.label}
      {item.badge && (
        <span className="ml-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
