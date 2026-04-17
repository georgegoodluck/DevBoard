import { ActivityEvent } from "@/types/activity";
import {
  GitMerge,
  SquareCheck,
  MessageSquare,
  Rocket,
  CircleAlert,
  RefreshCw,
} from "lucide-react";

const iconConfig = {
  merge: { icon: GitMerge, bg: "var(--green-dim)", color: "var(--green)" },
  task: { icon: SquareCheck, bg: "var(--accent-dim)", color: "var(--accent)" },
  comment: {
    icon: MessageSquare,
    bg: "var(--accent-dim)",
    color: "var(--accent)",
  },
  deploy: { icon: Rocket, bg: "var(--green-dim)", color: "var(--green)" },
  ci: { icon: CircleAlert, bg: "var(--red-dim)", color: "var(--red)" },
  update: { icon: RefreshCw, bg: "var(--amber-dim)", color: "var(--amber)" },
};

export default function Activity() {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}
