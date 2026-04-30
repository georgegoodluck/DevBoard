import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DangerZoneSettings from "@/components/settings/DangerZoneSettings";

export default function SettingsPage() {
  return (
    <div className="grid grid-cols-2 item-start gap-2.5">
      <div className="flex flex-col gap-2.5">
        <ProfileSettings />
      </div>
      <div className="flex flex-col gap-2.5">
        <NotificationSettings />
        <DangerZoneSettings />
      </div>
    </div>
  );
}
