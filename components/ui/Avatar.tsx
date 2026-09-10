import { cn } from "@/lib/cn";

interface AvatarProps {
  name: string;
  initials: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

// Deterministic color from the name, so the same person always gets the
// same avatar tint across renders/sessions without storing a color field.
const TINTS = [
  "bg-accent/20 text-accent",
  "bg-green/20 text-green",
  "bg-amber/20 text-amber",
  "bg-purple/20 text-purple",
];
function tintFor(name: string) {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TINTS[hash % TINTS.length];
}

export function Avatar({
  name,
  initials,
  online,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      title={name}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold",
          SIZE_CLASSES[size],
          tintFor(name),
        )}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-bg1",
            online ? "bg-green" : "bg-text3",
          )}
        />
      )}
    </div>
  );
}
