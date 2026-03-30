import { SquareCheckBig, Clock, Gauge, Star } from "lucide-react";
import StatCard from "./StatCard";

export default function StatGrid() {
  return (
    <div className="grid grid-cols-4 gap-[10px] mb-[16px] w-full">
      <StatCard
        label="Active Tasks"
        value="142"
        delta="↑ 8"
        deltaType="up"
        icon={SquareCheckBig}
      />
      <StatCard
        label="In Progress"
        value="38"
        delta="↑ 8"
        deltaType="up"
        icon={Clock}
      />
      <StatCard
        label="Velocity"
        value="24"
        delta="↑ 8"
        deltaType="up"
        icon={Gauge}
      />
      <StatCard
        label="Completion"
        value="68"
        delta="↑ 8"
        deltaType="up"
        icon={Star}
      />
    </div>
  );
}
