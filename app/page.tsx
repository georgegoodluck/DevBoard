import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function page() {
  return (
    <div className="flex">
      <Sidebar />
        <Topbar />
    </div>
  );
}
