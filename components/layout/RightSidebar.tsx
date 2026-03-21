"use client";

import { useState, useEffect, useCallback } from "react";
import { History, ChevronRight, CheckCircle, XCircle, Clock, Loader2, ChevronDown } from "lucide-react";
import { useWorkflowStore } from "@/store/useWorkflowStore";

interface NodeExec {
  nodeId: string;
  nodeType: string;
  status: string;
  inputs?: unknown;
  outputs?: unknown;
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

interface RunEntry {
  id: string;
  status: string;
  scope: string;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  nodeExecutions?: NodeExec[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    COMPLETED: { icon: CheckCircle, color: "text-emerald-400", label: "Success" },
    FAILED: { icon: XCircle, color: "text-red-400", label: "Failed" },
    RUNNING: { icon: Loader2, color: "text-blue-400", label: "Running" },
    PENDING: { icon: Clock, color: "text-zinc-400", label: "Pending" },
    PARTIAL: { icon: CheckCircle, color: "text-amber-400", label: "Partial" },
  };
  const conf = map[status] || map.PENDING;
  const Icon = conf.icon;
  return (
    <span className={`flex items-center gap-1 text-[10px] font-medium ${conf.color}`}>
      <Icon size={10} className={status === "RUNNING" ? "animate-spin" : ""} />
      {conf.label}
    </span>
  );
}

function formatDuration(ms?: number) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function RunRow({ run, workflowId }: { run: RunEntry; workflowId: string | null }) {
  const [expanded, setExpanded] = useState(false);
  const [nodeExecs, setNodeExecs] = useState<NodeExec[]>(run.nodeExecutions || []);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (!expanded && nodeExecs.length === 0 && workflowId) {
      setLoading(true);
      try {
        const res = await fetch(`/api/workflows/${workflowId}/runs/${run.id}`);
        if (res.ok) {
          const data = await res.json();
          setNodeExecs(data.nodeExecutions || []);
        }
      } finally {
        setLoading(false);
      }
    }
    setExpanded((e) => !e);
  };

  return (
    <div className="border border-[#222] rounded-xl overflow-hidden">
      <button
        onClick={handleExpand}
        className="w-full flex items-start gap-3 p-3 hover:bg-[#1a1a1a] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <StatusBadge status={run.status} />
            <span className="text-[10px] text-zinc-600">
              {formatDuration(run.duration)}
            </span>
          </div>
          <p className="text-zinc-400 text-[10px]">{formatTime(run.startedAt)}</p>
          <p className="text-zinc-600 text-[10px] capitalize">{run.scope} run</p>
        </div>
        <ChevronDown
          size={13}
          className={`text-zinc-600 flex-shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-[#222] bg-[#111] px-3 py-2">
          {loading ? (
            <div className="flex items-center gap-2 py-2 text-zinc-600 text-xs">
              <Loader2 size={12} className="animate-spin" />
              Loading...
            </div>
          ) : nodeExecs.length === 0 ? (
            <p className="text-zinc-600 text-xs py-2">No node details available</p>
          ) : (
            <div className="flex flex-col gap-2">
              {nodeExecs.map((ne) => (
                <div key={ne.nodeId} className="rounded-lg bg-[#1a1a1a] p-2 border border-[#2a2a2a]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-300 text-[10px] font-medium truncate">
                      {ne.nodeType.replace("Node", "")}
                    </span>
                    <StatusBadge status={ne.status} />
                  </div>
                  {Boolean(ne.outputs) && (
                    <p className="text-zinc-600 text-[10px] truncate">
                      Output: {JSON.stringify(ne.outputs).slice(0, 60)}...
                    </p>
                  )}
                  {ne.error && (
                    <p className="text-red-400 text-[10px] truncate">Error: {ne.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RightSidebar({ workflowId }: { workflowId?: string | null }) {
  const isRunning = useWorkflowStore((s) => s.isRunning);
  const [runs, setRuns] = useState<RunEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRuns = useCallback(() => {
    if (!workflowId) return;
    setLoading(true);
    fetch(`/api/workflows/${workflowId}/runs`)
      .then((r) => r.json())
      .then((data) => setRuns(data.runs || []))
      .finally(() => setLoading(false));
  }, [workflowId]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  // Re-fetch when a run completes
  useEffect(() => {
    if (!isRunning && workflowId) {
      fetchRuns();
    }
  }, [isRunning, workflowId, fetchRuns]);

  return (
    <aside
      className="flex flex-col h-full border border-white/10 rounded-2xl relative z-50 bg-[#0d0d0d]/80 backdrop-blur-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)]"
      style={{ width: "280px", minWidth: "280px" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-[#222]">
        <History size={15} className="text-purple-400" />
        <span className="text-white font-semibold text-sm">Workflow History</span>
      </div>

      {/* Runs list */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {!workflowId ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center">
              <History size={18} className="text-zinc-600" />
            </div>
            <p className="text-zinc-600 text-xs">
              Save your workflow to start tracking execution history
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-zinc-600 text-xs">
            <Loader2 size={14} className="animate-spin" />
            Loading history...
          </div>
        ) : runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center">
              <ChevronRight size={18} className="text-zinc-600" />
            </div>
            <p className="text-zinc-600 text-xs">
              No runs yet. Press &quot;Run&quot; to execute the workflow.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {runs.map((run) => (
              <RunRow key={run.id} run={run} workflowId={workflowId} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
