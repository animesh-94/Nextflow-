"use client";

import { type ReactNode } from "react";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { X, Info, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface BaseNodeProps {
  id: string;
  nodeType: string;
  title: string;
  icon: ReactNode;
  accentColor: string;
  children: ReactNode;
  minWidth?: number;
  showInput?: boolean;
  showOutput?: boolean;
}

const STATUS_GLOW: Record<string, string> = {
  running: "shadow-[0_0_20px_rgba(59,130,246,0.2)] border-blue-500/30",
  completed: "shadow-[0_0_20px_rgba(16,185,129,0.2)] border-emerald-500/30",
  failed: "shadow-[0_0_20px_rgba(239,68,68,0.2)] border-red-500/30",
};

export function BaseNode({
  id,
  title,
  icon,
  accentColor,
  children,
  minWidth = 240,
  showInput = true,
  showOutput = true,
}: BaseNodeProps) {
  const removeNode = useWorkflowStore((s) => s.removeNode);
  const execState = useWorkflowStore((s) => s.nodeExecutions[id]);
  const status = execState?.status || "idle";
  const statusClass = STATUS_GLOW[status] || "border-white/10 shadow-2xl";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl overflow-visible select-none transition-all duration-300 group relative bg-[#0a0a0a]/80 backdrop-blur-2xl border ${statusClass}`}
      style={{ minWidth }}
    >
      {/* Subtle Accent Glow */}
      <div 
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% 0%, ${accentColor}20, transparent 70%)` 
        }}
      />

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5 bg-white/[0.02] rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            {icon}
          </div>
          <span className="text-[12px] font-bold text-zinc-200 tracking-tight">{title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {status === "running" && (
            <Activity size={12} className="text-blue-400 animate-spin" />
          )}
          <button
            onClick={() => removeNode(id)}
            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all rounded-md p-1 hover:bg-red-500/10"
            title="Delete node"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Input / Output hint labels (extremely small and elegant) */}
      {(showInput || showOutput) && (
        <div className="flex justify-between items-center px-4 pt-3 pb-0">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
            {showInput ? "Input" : ""}
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
            {showOutput ? "Output" : ""}
          </span>
        </div>
      )}

      {/* Node Body */}
      <div className="px-4 pb-4 pt-2 relative z-10">{children}</div>

      {/* Error Message */}
      {status === "failed" && execState?.error && (
        <div className="mx-4 mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 shadow-inner">
          <p className="text-[10px] text-red-400 leading-tight font-medium">
            {execState.error}
          </p>
        </div>
      )}
    </motion.div>
  );
}
