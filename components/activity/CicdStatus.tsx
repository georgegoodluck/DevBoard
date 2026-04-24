import CardHeader from "../ui/CardHeader";

const pipelines = [
  { name: "TickrPay", status: "Passing" as const },
  { name: "Pulse", status: "Failed" as const },
  { name: "fin·snap", status: "Passing" as const },
  { name: "SubTrack", status: "Deploying" as const },
];

const statusConfig = {
  Passing: {
    bg: "var(--green-dim)",
    color: "var(--green)",
    glow: "0 0 6px var(--green)",
  },
  Failed: { bg: "var(--red-dim)", color: "var(--red)", glow: "none" },
  Deploying: { bg: "var(--amber-dim)", color: "var(--amber)", glow: "none" },
};

export default function CicdStatus() {
  return (
    <div className="bg-(--bg1)">
      <CardHeader title="CI / CD Status" dotColor="var(--danger)" />
    </div>
  );
}
