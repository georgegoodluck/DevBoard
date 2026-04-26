import CardHeader from "@/components/ui/CardHeader";

type Setting = {
  label: string;
  value: string;
  key: string;
  default: boolean;
};

export default function NotificationSettings() {
  return (
    <div className="border border-(--border) rounded-(--radius) bg-(--bg1 overflow-hidden">
      <CardHeader title="Notifications" dotColor="var-(--amber)" />
    </div>
  );
}
