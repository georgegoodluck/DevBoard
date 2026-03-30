import { SquareCheckBig, Clock, Gauge, Star } from "lucide-react";
import StatCard from "./StatCard";

export default function StatGrid() {
  return (
    <div className="grid grid-cols-4 gap-2.5 mb-4 w-full">
      <StatCard
        label="Active Tasks"
        value="142"
        delta="8"
        unit=""
        subLabel=""
        deltaType="up"
        icon={SquareCheckBig}
      />
      <StatCard
        label="In Progress"
        value="38"
        delta="3"
        unit=""
        subLabel=""
        deltaType="up"
        icon={Clock}
      />
      <StatCard
        label="Velocity"
        value="24"
        delta="2"
        unit="pts"
        subLabel="last sprint"
        deltaType="down"
        icon={Gauge}
      />
      <StatCard
        label="Completion"
        value="68"
        delta="4%"
        unit="%"
        subLabel="last week"
        deltaType="up"
        icon={Star}
      />
    </div>
  );
}
