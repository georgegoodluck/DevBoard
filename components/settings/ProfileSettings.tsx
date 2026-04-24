import CardHeader from "../ui/CardHeader";
import Avatar from "../ui/Avatar";

export default function ProfileSettings() {
  return (
    <div>
      <CardHeader title="Profile" dotColor="var(--accent)" />
      {/* Avatar Row */}
      <div className="flex">
        <Avatar
          initials="GG"
          gradient="linear-gradient(135deg,#8b5cf6,#06b6d4)"
          size={56}
        />

        <div>
          <div>George G.</div>
          <div>Admin &middot; DevBoard workspace</div>
          <button>Change Avatar</button>
        </div>
      </div>

      {/* Fields Row */}
    </div>
  );
}
