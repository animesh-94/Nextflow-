"use client";

import { useCallback, useEffect } from "react";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { LeftSidebar } from "./LeftSidebar";
import { TopBar } from "./TopBar";
import { FlowCanvas } from "../canvas/FlowCanvas";

export function WorkflowEditor() {
  const { undo, redo } = useWorkflowStore.temporal.getState();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((meta && e.key === "y") || (meta && e.shiftKey && e.key === "z")) { e.preventDefault(); redo(); }
    },
    [undo, redo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] selection:bg-purple-500/30">
      <TopBar />
      <div className="flex flex-1 overflow-hidden p-3 gap-3">
        <div className="h-full relative z-50">
          <LeftSidebar />
        </div>
        <main className="flex-1 relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] shadow-inner">
          <FlowCanvas />
        </main>
      </div>
    </div>
  );
}
