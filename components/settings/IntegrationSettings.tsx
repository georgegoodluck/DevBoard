import CardHeader from "@/components/ui/CardHeader";
import Badge from "../ui/Badge";
import { FaGithub, FaSlack } from "react-icons/fa";
import { IoLogoVercel } from "react-icons/io5";
import { SiSentry } from "react-icons/si";

// Added TypeScript typing to fix the 'any' error
const IconWrapper = ({
  children,
  bgColor = "bg-black",
}: {
  children: React.ReactNode;
  bgColor?: string;
}) => (
  <div
    className={`${bgColor} rounded-full w-7 h-7 flex items-center justify-center shrink-0`}
  >
    {children}
  </div>
);

const integrations = [
  {
    icon: (
      <IconWrapper bgColor="bg-[#24292e]">
        <FaGithub size={16} className="text-white" />
      </IconWrapper>
    ),
    name: "GitHub",
    detail: "Connected · @georgedev",
    connected: true,
  },
  {
    icon: (
      <IconWrapper bgColor="bg-black">
        <IoLogoVercel size={14} className="text-white" />
      </IconWrapper>
    ),
    name: "Vercel",
    detail: "Connected · devboard team",
    connected: true,
  },
  {
    icon: (
      <IconWrapper bgColor="bg-[#4A154B]">
        <FaSlack size={14} className="text-white" />
      </IconWrapper>
    ),
    name: "Slack",
    detail: "Not connected",
    connected: false,
  },
  {
    icon: (
      <IconWrapper bgColor="bg-[#362D59]">
        <SiSentry size={14} className="text-white" />
      </IconWrapper>
    ),
    name: "Sentry",
    detail: "Not connected",
    connected: false,
  },
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
            {/* Removed the extra <span> to let the wrapper handle alignment */}
            {item.icon}
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
