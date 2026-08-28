import CardHeader from "@/components/ui/CardHeader";
import Avatar from "@/components/ui/Avatar";

type Member = {
  initials: string;
  name: string;
  gradient: string;
  count: number;
  color: string;
};

type Props = {
  members?: Member[];
};

export default function ContributionsPanel({ members = [] }: Props) {
  const max = Math.max(...members.map((c) => c.count), 1);

  return (
    <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[6px] overflow-hidden">
      <CardHeader
        title="Contributions"
        dotColor="var(--amber)"
        right={
          <span className="font-mono text-[10px] text-[var(--text3)]">
            This week
          </span>
        }
      />
      <div className="p-[14px] flex flex-col gap-[10px]">
        {members.length === 0 ? (
          <div className="py-[16px] text-center font-mono text-[11px] text-[var(--text3)]">
            No contributions yet
          </div>
        ) : (
          members.map((c) => (
            <div key={c.initials} className="flex items-center gap-[8px]">
              <Avatar initials={c.initials} gradient={c.gradient} size={22} />
              <span className="text-[12px] text-[var(--text)] flex-1">
                {c.name}
              </span>
              <div className="w-[80px] h-[4px] bg-[var(--bg3)] rounded-[2px] overflow-hidden">
                <div
                  className="h-full rounded-[2px]"
                  style={{
                    width: `${(c.count / max) * 100}%`,
                    background: c.color,
                  }}
                />
              </div>
              <span className="font-mono text-[10px] text-[var(--text3)] w-[20px] text-right">
                {c.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
