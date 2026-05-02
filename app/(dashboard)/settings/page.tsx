import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DangerZoneSettings from "@/components/settings/DangerZoneSettings";
import WorkspaceSettings from "@/components/settings/WorkspaceSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";

export default function SettingsPage() {
  return (
    <div className="grid grid-cols-2 item-start gap-2.5">
      <div className="flex flex-col gap-2.5">
        <ProfileSettings />
        <WorkspaceSettings />
      </div>
      <div className="flex flex-col gap-2.5">
        <NotificationSettings />
        <IntegrationSettings />
        <DangerZoneSettings />
      </div>
    </div>
  );
}
