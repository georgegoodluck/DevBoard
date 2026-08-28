import CardHeader from "@/components/ui/CardHeader";

type Pipeline = {
  name: string;
  status: "Passing" | "Failed" | "Deploying";
};

type Props = {
  pipelines?: Pipeline[];
};

const statusConfig = {
  Passing: {
    bg: "var(--green-dim)",
    color: "var(--green)",
    glow: "0 0 6px var(--green)",
  },
  Failed: { bg: "var(--red-dim)", color: "var(--red)", glow: "none" },
  Deploying: { bg: "var(--amber-dim)", color: "var(--amber)", glow: "none" },
};

export default function CicdStatus({ pipelines = [] }: Props) {
  return (
    <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[6px] overflow-hidden">
      <CardHeader title="CI / CD Status" dotColor="var(--red)" />
      <div className="p-[10px] flex flex-col gap-[6px]">
        {pipelines.length === 0 ? (
          <div className="py-[16px] text-center font-mono text-[11px] text-[var(--text3)]">
            No pipelines connected yet
          </div>
        ) : (
          pipelines.map((p) => {
            const s = statusConfig[p.status];
            return (
              <div
                key={p.name}
                className="flex items-center gap-[8px] px-[10px] py-[7px] rounded-[4px]"
                style={{ background: s.bg }}
              >
                <span
                  className="w-[6px] h-[6px] rounded-full shrink-0"
                  style={{ background: s.color, boxShadow: s.glow }}
                />
                <span className="flex-1 text-[12px] text-[var(--text)]">
                  {p.name}
                </span>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: s.color }}
                >
                  {p.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
