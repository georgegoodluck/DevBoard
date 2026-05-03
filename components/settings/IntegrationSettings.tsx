import CardHeader from "@/components/ui/CardHeader";
import Badge from "../ui/Badge";

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
      <div className="flex flex-col p-3">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 p-2.5 bg-(--bg2) rounded-(--radius) m-1 border border-(--border)"
          >
            <span>{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-(--text)">
                {item.name}
              </div>
              <div className="font-mono text-[10px] text-(--text3)">
                {item.detail}
              </div>
            </div>
            {item.connected ? (
              <Badge label="Connected" variant="green" />
            ) : (
              <button className="border bg-(--bg2) border-(--border2) font-mono text-(--text3) hover:text-(--text) hover:bg-(--bg3) rounded-(--radius) h-6 px-2.5 transition-colors cursor-pointer">
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
