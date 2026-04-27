import CardHeader from "../ui/CardHeader";

export default function DangerZoneSettings() {
  return (
    <div className="bg-(--bg1) border border-(--border) rounded-(--radius) overflow-hidden">
      <CardHeader title="Danger Zone" dotColor="var(--danger)" />
    </div>
  );
}
