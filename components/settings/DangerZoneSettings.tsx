import CardHeader from "../ui/CardHeader";

export default function DangerZoneSettings() {
  return (
    <div className="bg-(--bg1) border border-(--danger) opacity-90 rounded-(--radius) overflow-hidden">
      <CardHeader title="Danger Zone" dotColor="var(--danger)" />

      {/* content */}
      <div className="flex items-center justify-between p-5">
        <div>
            <div className="text-[13px] font-medium text-(--text) mb-0.5">
              Delete workspace
            </div>
            <div className="text-[11px] text-(--text3)">
              Permanently remove everything
            </div>
        </div>
        <button className="border border-(--danger) bg-(--danger-dim) h-7 px-3.5 rounded-(--radius) text-(--danger) font-semibold">
          Delete
        </button>
      </div>
    </div>
  );
}
