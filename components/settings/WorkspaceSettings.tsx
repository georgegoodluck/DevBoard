import CardHeader from "@/components/ui/CardHeader";

export default function WorkspaceSettings() {
  return (
    <div className="bg-(--bg1) border border-(--border) rounded-md overflow-hidden">
      <CardHeader title="Workspace" dotColor="var(--purple)" />
      <div className="px-3.5">
        {[
          {
            label: "Workspace name",
            description: "Visible to all members",
            value: "devboard",
          },
          {
            label: "Default visibility",
            description: "Private or team-visible",
            value: "Private",
          },
          {
            label: "Sprint duration",
            description: "Length of each sprint cycle",
            value: "2 weeks",
          },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3.5 ${i < arr.length - 1 ? "border-b border-(--border)" : ""}`}
          >
            <div>
              <div className="text-[13px] font-medium text-(--text) mb-0.5">
                {row.label}
              </div>
              <div className="text-[11.5px] text-(--text3)">
                {row.description}
              </div>
            </div>
            <input
              defaultValue={row.value}
              className="w-35 bg-(--bg2) border border-(--border) rounded-(--radius) px-2.5 py-1 text-[12px] text-(--text) font-mono outline-none focus:border-(--accent) transition-colors text-right"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
