import CardHeader from "../ui/CardHeader";
import Avatar from "../ui/Avatar";

export default function ProfileSettings() {
  return (
    <div className="bg-(--bg1) rounded-(--radius) border border-(--border) overflow-hidden">
      <CardHeader title="Profile" dotColor="var(--accent)" />
      <div className=" p-3.5 flex flex-col gap-3">
        {/* Avatar Row */}
        <div className="flex items-center gap-3.5">
          <Avatar
            initials="GG"
            gradient="linear-gradient(135deg,#8b5cf6,#06b6d4)"
            size={56}
          />

          <div>
            <div className="text-[15px] text-(--text1) font-bold mb-0.5">
              George G.
            </div>
            <div className="font-mono text-[11px] text-(--text3) mb-1.5">
              Admin &middot; DevBoard workspace
            </div>
            <button className="px-3.5 h-6 border border-(--border) rounded-(--radius) text-(--text2) hover:text-(--text1) hover:bg-(--bg3) cursor-pointer transition-colors text-[10px] font-mono">
              Change avatar
            </button>
          </div>
        </div>

        {/* Fields Row */}

        {[
          { label: "Display Name", value: "George G." },
          { label: "Email", value: "george@devboard.app" },
          { label: "Role", value: "Lead / Fullstack" },
        ].map((field) => (
          <div key={field.label}>
            <div className="uppercase text-(--text3) font-mono font-semibold tracking-[0.08em] mb-1 text-[10px]">
              {field.label}
            </div>
            <input
              defaultValue={field.value}
              className="w-full bg-(--bg2) border border-(--border) rounded-(--radius) px-2.5 py-1.5 text-[12.5px] text-(--text) outline-none focus:border-(--accent) transition-colors"
            />
          </div>
        ))}
        <button className="cursor-pointer self-end brand-gradient border border-(--border2) h-7 px-2 rounded-(--radius) font-mono text-(--text1) text-[10px] transition-opacity hover:opacity-90">
          Save Changes
        </button>
      </div>
    </div>
  );
}
