type Member = {
  initials: string;
  name: string;
  role: string;
  status: "Online" | "Away" | "Offline";
  gradient: string;
};

const members: Member[] = [
  {
    initials: "GG",
    name: "George Goodluck",
    role: "Lead / Fullstack",
    status: "Online",
    gradient: "red",
  },
  {
    initials: "AK",
    name: "Ada Kenny",
    role: "Frontend",
    status: "Online",
    gradient: "red",
  },
  {
    initials: "TN",
    name: "Tunde Nolan",
    role: "Backend",
    status: "Away",
    gradient: "red",
  },
  {
    initials: "MO",
    name: "Mide Oba",
    role: "Design",
    status: "Offline",
    gradient: "red",
  },
];

export default function TeamPanel() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-(--green)" />
          Header
        </div>
        <span className="text-(--accent)">Manage &#8594;</span>
      </div>
    </div>
  );
}
