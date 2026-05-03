import CardHeader from "@/components/ui/CardHeader";

const integrations = [
  {
    emoji: "🐙",
    name: "GitHub",
    detail: "Connected · @georgedev",
    connected: true,
  },
  {
    emoji: "▲",
    name: "Vercel",
    detail: "Connected · devboard team",
    connected: true,
  },
  { emoji: "🔔", name: "Slack", detail: "Not connected", connected: false },
  { emoji: "🛡️", name: "Sentry", detail: "Not connected", connected: false },
];

export default function IntegrationSettings() {
  return (
    <div className="bg-(--bg1) border border-(--border) rounded-(--radius) overflow-hidden">
      <CardHeader title="Integrations" dotColor="var(--green)" />
      <div></div>
    </div>
  );
}
