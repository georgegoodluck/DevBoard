import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DangerZoneSettings from "@/components/settings/DangerZoneSettings";

export default function SettingsPage() {
  return (
    <div>
      <ProfileSettings />
      <NotificationSettings />
      <DangerZoneSettings />
    </div>
  );
}
