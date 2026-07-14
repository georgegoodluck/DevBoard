import CardHeader from "@/components/ui/CardHeader";
import Avatar from "@/components/ui/Avatar";

type Member = {
  initials: string;
  name: string;
  role: string;
  status: "Online" | "Away" | "Offline";
  gradient: string;
};

const members: Member[] = [
  {
    initials: "GG",
    name: "George Goodluck",
    role: "Lead / Fullstack",
    status: "Online",
    gradient:
      "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 11%, rgba(0, 212, 255, 1) 100%)",
  },
  {
    initials: "AK",
    name: "Ada Kenny",
    role: "Frontend",
    status: "Online",
    gradient:
      "linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(187, 189, 90, 1) 73%, rgba(253, 187, 45, 1) 100%)",
  },
  {
    initials: "TN",
    name: "Tunde Nolan",
    role: "Backend",
    status: "Away",
    gradient:
      "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(206, 179, 213, 1) 35%, rgba(148, 187, 233, 1) 100%)",
  },
  {
    initials: "MO",
    name: "Mide Oba",
    role: "Design",
    status: "Offline",
    gradient:
      "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(126, 30, 148, 1) 35%, rgba(148, 187, 233, 1) 100%)",
  },
];

const formatName = (name: string) => {
  const parts = name.split(" ");
  if (parts.length === 2) {
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  }
  return name;
};

const statusConfig = {
  Online: {
    color: "var(--green)",
    label: "Online",
    glow: "0 0 6px var(--green)",
  },
  Away: { color: "var(--amber)", label: "Away", glow: "none" },
  Offline: { color: "var(--text3)", label: "Offline", glow: "none" },
};

export default function TeamPanel() {
  return (
    <div className="border rounded-(--radius) border-(--border2) bg-(--bg1) overflow-hidden mb-2">
      {/* <div className="flex items-center justify-between px-3.5 py-3 border-b border-(--border)">
        <div className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.08em] text-(--text3) font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-(--green)" />
          Team
        </div>
        <span className="text-(--green) font-mono cursor-pointer text-[10px] hover:opacity-70">
          Manage &#8594;
        </span>
      </div> */}

      <CardHeader
        title="Team"
        dotColor="var(--green)"
        action={{ label: "View all \u2192" }}
      />

      <div>
        {members.map((m) => {
          const s = statusConfig[m.status];
          return (
            <div
              key={m.initials}
              className="flex items-center gap-2 px-3.5 py-3 border-b border-(--border) bg-(--bg1) last:border-none hover:bg-(--bg2) transition-colors cursor-default"
            >
              {/* <div
                className="w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono text-[10px] text-white shrink-0"
                style={{ background: m.gradient }}
              >
                {m.initials}
              </div> */}
              <Avatar initials={m.initials} gradient={m.gradient} size={26} />
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium text-(--text)">
                  {formatName(m.name)}
                </div>
                <div className="text-mono text-[10px] text-(--text3)">
                  {m.role}
                </div>
              </div>
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: s.color, boxShadow: s.glow }}
              />
              <span className="font-mono text-[10px] text-(--text3)">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
