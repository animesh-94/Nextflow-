"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { X, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface NodeExecution {
  nodeId: string;
  nodeType: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  error: string | null;
}

interface Run {
  id: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  nodeExecutions: NodeExecution[];
}

export function HistoryPanel() {
  const { isHistoryOpen, setIsHistoryOpen, workflowId, workflowName } = useWorkflowStore();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHistoryOpen && workflowId) {
      setLoading(true);
      fetch(`/api/workflows/${workflowId}/runs`)
        .then((res) => res.json())
        .then((data) => {
          if (data.runs) {
            setRuns(data.runs);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isHistoryOpen, workflowId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "FAILED":
        return <XCircle size={16} className="text-red-500" />;
      case "RUNNING":
      case "PENDING":
        return <Loader2 size={16} className="text-blue-500 animate-spin" />;
      default:
        return <Clock size={16} className="text-zinc-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isHistoryOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute right-3 top-3 bottom-3 w-80 bg-[#0d0d0d]/90 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex flex-col">
              <h2 className="text-white text-[14px] font-bold">Execution History</h2>
              <span className="text-zinc-500 text-[11px] truncate w-48">{workflowName}</span>
            </div>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {!workflowId ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <Clock size={32} className="text-zinc-700 mb-3" />
                <p className="text-zinc-400 text-[13px] font-medium">No history available.</p>
                <p className="text-zinc-600 text-[11px] mt-1">Save your workflow to track executions.</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 size={24} className="text-zinc-500 animate-spin" />
              </div>
            ) : runs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <p className="text-zinc-400 text-[13px] font-medium">No runs yet.</p>
                <p className="text-zinc-600 text-[11px] mt-1">Run your workflow to see it here.</p>
              </div>
            ) : (
              runs.map((run) => (
                <div
                  key={run.id}
                  className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-default"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      <span className="text-zinc-200 text-[13px] font-semibold tracking-wide">
                        {run.status.charAt(0) + run.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <span className="text-zinc-500 text-[10px]">
                      {formatDate(run.startedAt)}
                    </span>
                  </div>
                  
                  {run.nodeExecutions.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {run.nodeExecutions.map((nodeRun) => (
                        <div
                          key={nodeRun.nodeId}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              nodeRun.status === "COMPLETED" ? "#10b981"
                              : nodeRun.status === "FAILED" ? "#ef4444"
                              : "#3b82f6"
                          }}
                          title={`${nodeRun.nodeType}: ${nodeRun.status}`}
                        />
                      ))}
                      <span className="text-zinc-600 text-[10px] ml-1">
                        {run.nodeExecutions.length} nodes
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
