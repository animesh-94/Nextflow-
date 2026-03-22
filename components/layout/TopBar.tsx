"use client";

import { Save, Play, Share2, Moon, Loader2, History } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export function TopBar() {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const { nodes, edges, workflowId, setWorkflowId, isRunning, runId, isHistoryOpen, setIsHistoryOpen } = useWorkflowStore();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const method = workflowId ? "PUT" : "POST";
      const url = workflowId ? `/api/workflows/${workflowId}` : "/api/workflows";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workflowName, nodes, edges }),
      });
      if (res.ok) {
        const data = await res.json();
        setWorkflowId(data.id);
      }
    } finally {
      setSaving(false);
    }
  }, [workflowId, workflowName, nodes, edges, setWorkflowId]);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    await handleSave();
    const currentId = useWorkflowStore.getState().workflowId;
    if (!currentId) return;

    useWorkflowStore.getState().clearExecutionState();
    useWorkflowStore.getState().setIsRunning(true);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: currentId }),
      });
      const data = await res.json();
      if (data.runId) {
        useWorkflowStore.getState().setRunId(data.runId);
      } else {
        useWorkflowStore.getState().setIsRunning(false);
      }
    } catch {
      useWorkflowStore.getState().setIsRunning(false);
    }
  }, [isRunning, handleSave]);

  // Polling for status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && runId && workflowId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/workflows/${workflowId}/runs`);
          if (!res.ok) return;
          const { runs } = await res.json();
          const currentRun = runs.find((r: any) => r.id === runId);

          if (currentRun) {
            // Update individual node states
            currentRun.nodeExecutions.forEach((exec: any) => {
              useWorkflowStore.getState().setNodeExecution(exec.nodeId, {
                status: exec.status.toLowerCase() as any,
                error: exec.error,
              });
            });

            // If run finished, stop polling
            if (["COMPLETED", "FAILED", "CANCELLED"].includes(currentRun.status)) {
              useWorkflowStore.getState().setIsRunning(false);
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning, runId, workflowId]);

  return (
    <header
      className="flex items-center justify-between px-3 py-2 border-b border-[#1f1f1f] bg-[#0e0e0e] z-10 flex-shrink-0"
      style={{ height: 44 }}
    >
      {/* Left – Logo + name */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">NF</span>
        </div>
        <span className="text-zinc-300 text-[13px] font-medium tracking-tight">
          {workflowName}
        </span>
      </div>

      {/* Right – actions (no UserButton here — it's in LeftSidebar bottom) */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleSave}
          disabled={saving}
          title="Save"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/8 transition-all disabled:opacity-40"
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Save size={13} />
          )}
        </button>

        <button
          title="Share"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#2a2a2a] text-zinc-400 hover:text-zinc-200 hover:border-[#3a3a3a] text-[12px] transition-all"
        >
          <Share2 size={12} /> Share
        </button>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a56f0] hover:bg-[#2060f8] disabled:opacity-50 text-white text-[12px] font-semibold transition-all"
        >
          {isRunning ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Running…
            </>
          ) : (
            <>
              <Play size={12} fill="currentColor" /> Run
            </>
          )}
        </button>

        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          title="History"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] transition-all ${
            isHistoryOpen
              ? "bg-white/10 text-white border-white/20"
              : "border-[#2a2a2a] text-zinc-400 hover:text-zinc-200 hover:border-[#3a3a3a]"
          }`}
        >
          <History size={12} /> History
        </button>

        <button
          title="Theme"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/8 transition-all"
        >
          <Moon size={13} />
        </button>
      </div>
    </header>
  );
}
