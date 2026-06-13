"use client";

import { useState } from "react";
import { useNewTask } from "@/context/NewTaskContext";
import { X, Plus } from "lucide-react";

export default function NewTaskModal() {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={close}>
        {/* Modal */}
        <div className="fixed">
          {/* Header */}
          <div>
            <span>New Task</span>
            <button>
              <X size={14} />
            </button>
          </div>
          {/* Body */}
          <div>
            {/* Title */}
            <input type="text" />
          </div>
        </div>
        {/* Footer */}
        <div>
          <button>Cancel</button>
          <button>
            <Plus size={14} />
            Create Task
          </button>
        </div>
      </div>
    </>
  );
}
