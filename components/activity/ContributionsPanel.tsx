import CardHeader from "../ui/CardHeader";
import Avatar from "../ui/Avatar";

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

const max = Math.max(...contributors.map((c) => c.count));

export default function ContributionsPanel() {
  return (
    <div className="bg-(--bg1) border border-(--border) rounded-md overflow-hidden">
      <CardHeader
        title="Contributions"
        dotColor="var(--amber)"
        right={
          <span className="font-mono text-[10px] text-(--text3)">
            This week
          </span>
        }
      />
      <div className="p-3.5 flex flex-col gap-2.5">
        {contributors.map((c) => (
          <div key={c.initials} className="flex items-center gap-[8px]">
            <Avatar initials={c.initials} gradient={c.gradient} size={22} />
            <span className="text-[12px] text-[var(--text)] w-[60px] shrink-0 truncate">
              {c.name}
            </span>
            <div className="flex-1 h-[4px] bg-[var(--bg3)] rounded-[2px] overflow-hidden">
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${(c.count / max) * 100}%`,
                  background: c.color,
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-[var(--text3)] w-[20px] text-right shrink-0">
              {c.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
