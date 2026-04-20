import { span } from "framer-motion/client";
import CardHeader from "../ui/CardHeader";

const contributors = [
  {
    initials: "GG",
    name: "George G.",
    gradient:
      "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 11%, rgba(0, 212, 255, 1) 100%)",
    count: 44,
    color: "var(--accent)",
  },
  {
    initials: "TN",
    name: "Tunde N.",
    gradient:
      "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(206, 179, 213, 1) 35%, rgba(148, 187, 233, 1) 100%)",
    count: 31,
    color: "var(--green)",
  },
  {
    initials: "AK",
    name: "Ada K.",
    gradient:
      "linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(187, 189, 90, 1) 73%, rgba(253, 187, 45, 1) 100%)",
    count: 24,
    color: "var(--amber)",
  },
  {
    initials: "MO",
    name: "Mide O.",
    gradient:
      "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(126, 30, 148, 1) 35%, rgba(148, 187, 233, 1) 100%)",
    count: 16,
    color: "var(--purple)",
  },
];

export default function ContributionsPanel() {
  return (
    <div>
      <CardHeader
        title="Contributors"
        dotColor="var(--amber)"
        right={
          <span className="font-mono  text-[10px] text-(--text3)">
            This week
          </span>
        }
      />
    </div>
  );
}
