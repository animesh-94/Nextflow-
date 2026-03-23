"use client";

import { Handle, Position } from "reactflow";
import { Film, Play, Loader2, Target } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

interface ExtractFrameNodeData {
  label?: string;
  timestamp?: string;
  videoUrl?: string;
  frameImageUrl?: string;
}

const getHandleStyle = (color: string) => ({
  width: 10,
  height: 10,
  background: color,
  border: "2px solid #050505",
  boxShadow: `0 0 10px ${color}40`,
});

export function ExtractFrameNode({ id, data }: { id: string; data: ExtractFrameNodeData }) {
  const { updateNodeData, setNodeExecution, edges, nodeExecutions } = useWorkflowStore();
  const execState = nodeExecutions[id];
  const [running, setRunning] = useState(false);
  const accentColor = "#f97316";

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setNodeExecution(id, { status: "running", startedAt: Date.now() });
    const { nodes, edges: currEdges } = useWorkflowStore.getState();
    const incomingEdge = currEdges.find(e => e.target === id && e.targetHandle === "videoUrl");
    const sourceNode = incomingEdge ? nodes.find(n => n.id === incomingEdge.source) : null;
    const videoUrl = sourceNode ? sourceNode.data.videoUrl : "";

    try {
      const res = await fetch("/api/execute/node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeId: id,
          nodeType: "extractFrameNode",
          data: { timestamp: data.timestamp || "00:00:01" },
          inputData: {
            videoUrl: videoUrl || data.videoUrl
          }
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Execution failed");
      }

      if (result.frameImageUrl) {
        updateNodeData(id, { frameImageUrl: result.frameImageUrl });
      }

      setNodeExecution(id, {
        status: "completed",
        result: result.frameImageUrl,
        finishedAt: Date.now(),
      });
    } catch (err: any) {
      setNodeExecution(id, { status: "failed", error: err.message || String(err) });
    } finally {
      setRunning(false);
    }
  };

  const isRunning = execState?.status === "running" || running;

  return (
    <BaseNode
      id={id}
      nodeType="extractFrameNode"
      title="Frame Extraction"
      icon={<Target size={12} />}
      accentColor={accentColor}
      minWidth={280}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="videoUrl"
        style={getHandleStyle(accentColor)}
      />

      <div className="flex flex-col gap-4 mt-2">
        {!data.frameImageUrl && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/5 border border-orange-500/10 mb-1">
            <div className={`w-1.5 h-1.5 rounded-full ${edges.some(e => e.target === id && e.targetHandle === "videoUrl") ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-orange-500/40"}`} />
            <span className="text-[9px] font-bold text-zinc-500 italic">
              {edges.some(e => e.target === id && e.targetHandle === "videoUrl") 
                ? "VIDEO STREAM DETECTED" 
                : "AWAITING VIDEO LINK"}
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-1">Time Marker (HH:MM:SS)</label>
          <input
            type="text"
            value={data.timestamp || "00:00:01"}
            onChange={(e) => updateNodeData(id, { timestamp: e.target.value })}
            placeholder="00:00:01"
            className="w-full bg-[#050505] border border-white/5 rounded-xl px-3 py-2 text-orange-400 text-xs font-mono focus:outline-none focus:border-orange-500/30 shadow-inner"
          />
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="relative group/btn w-full py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-white text-[11px] font-black tracking-widest transition-all disabled:opacity-50 overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95"
        >
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <div className="flex items-center justify-center gap-2">
            {isRunning ? (
              <><Loader2 size={12} className="animate-spin" /> EXTRACTING...</>
            ) : (
              <><Play size={10} fill="currentColor" /> RUN EXTRACT</>
            )}
          </div>
        </button>

        {data.frameImageUrl && (
          <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-white/5 shadow-2xl">
            <img src={data.frameImageUrl} alt="Extracted frame" className="w-full h-36 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2.5 flex justify-between items-center">
              <p className="text-white text-[9px] font-bold uppercase tracking-widest opacity-60">Snapshot Captured</p>
              <span className="text-orange-400 text-[9px] font-mono">{data.timestamp}</span>
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="frameImageUrl"
        style={{ ...getHandleStyle(accentColor), right: -6 }}
      />
    </BaseNode>
  );
}
