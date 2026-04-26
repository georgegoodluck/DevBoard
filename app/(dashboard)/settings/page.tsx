import NotificationSettings from "@/components/settings/NotificationSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";

export default function SettingsPage() {
  return (
    <div>
      <ProfileSettings />
      <NotificationSettings />
    </div>
  );
}
