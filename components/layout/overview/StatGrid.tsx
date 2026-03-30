import { SquareCheckBig, Clock, MoveRight, Star } from "lucide-react";
import StatCard from "./StatCard";

export default function StatGrid() {
    return (
        <div>
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
        value="24pts"
        delta="↑ 8"
        deltaType="up"
        icon={MoveRight}
        />
        <StatCard 
        label="Completion"
        value="68%"
        delta="↑ 8"
        deltaType="up"
        icon={Star}
        />
        </div>
    )
}