"use client";

import { useState } from "react";
import CardHeader from "@/components/ui/CardHeader";

export default function WorkspaceSettings() {
  const [workspaceName, setWorkspaceName] = useState("devboard");
  const [visibility, setVisibility] = useState("Private");
  const [sprintDuration, setSprintDuration] = useState("2 weeks");

  return (
    <div className="bg-(--bg1) border border-(--border) rounded-md overflow-hidden">
      <CardHeader title="Workspace" dotColor="var(--purple)" />
      <div className="px-3.5">
        {/* Workspace Name */}
        <div className="flex items-center justify-between py-3.5 border-b border-(--border)">
          <div>
            <div className="text-[13px] font-medium text-(--text) mb-0.5">
              Workspace name
            </div>
            <div className="text-[11.5px] text-(--text3)">
              Visible to all members
            </div>
          </div>
          <input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-32 bg-(--bg2) border border-(--border) rounded-(--radius) px-2.5 py-1 text-[12px] text-(--text) font-mono outline-none focus:border-(--accent) transition-colors text-left"
          />
        </div>

        {/* Default Project Visibility */}
        <div className="flex items-center justify-between py-3.5 border-b border-(--border)">
          <div>
            <div className="text-[13px] font-medium text-(--text) mb-0.5">
              Default project visibility
            </div>
            <div className="text-[11.5px] text-(--text3)">
              Private or team-visible
            </div>
          </div>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="bg-(--bg2) border border-(--border) rounded-(--radius) w-22 px-2.5 py-1 text-[12px] text-(--text) font-mono outline-none hover:border-(--accent) focus:border-(--accent) transition-colors cursor-pointer"
          >
            <option value="Private">Private</option>
            <option value="Team-visible">Team-visible</option>
            <option value="Public">Public</option>
          </select>
        </div>

        {/* Sprint Duration */}
        <div className="flex items-center justify-between py-3.5">
          <div>
            <div className="text-[13px] font-medium text-(--text) mb-0.5">
              Sprint duration
            </div>
            <div className="text-[11.5px] text-(--text3)">
              Length of each sprint cycle
            </div>
          </div>
          <select
            value={sprintDuration}
            onChange={(e) => setSprintDuration(e.target.value)}
            className="bg-(--bg2) border border-(--border) rounded-(--radius) px-2.5 py-1 text-[12px] text-(--text) font-mono outline-none focus:border-(--accent) transition-colors cursor-pointer"
          >
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
            <option value="3 weeks">3 weeks</option>
            <option value="4 weeks">4 weeks</option>
          </select>
        </div>
      </div>
    </div>
  );
}
