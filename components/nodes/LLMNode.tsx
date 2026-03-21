"use client";

import { Handle, Position } from "reactflow";
import { Bot, Play, Loader2, Sparkles, Cpu } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

const MODELS = [
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { id: "gemini-1.5-flash-8b", label: "Gemini 1.5 Flash-8b" },
];

const getHandleStyle = (color: string) => ({
  width: 10,
  height: 10,
  background: color,
  border: "2px solid #050505",
  boxShadow: `0 0 10px ${color}40`,
});

export function LLMNode({ id, data }: { id: string; data: any }) {
  const { updateNodeData, setNodeExecution } = useWorkflowStore();
  const [running, setRunning] = useState(false);
  const accentColor = "#a855f7";

  const handleRunNode = async () => {
    if (running) return;
    setRunning(true);
    setNodeExecution(id, { status: "running", startedAt: Date.now() });

    const { nodes, edges } = useWorkflowStore.getState();
    const incomingEdges = edges.filter(e => e.target === id);
    const inputData: Record<string, any> = {};
    const imgUrls: string[] = [];

    incomingEdges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode) {
        if (edge.targetHandle === "images") {
          const u = sourceNode.data.croppedImageUrl || sourceNode.data.frameImageUrl || sourceNode.data.imageUrl;
          if (u) imgUrls.push(u);
        } else if (edge.targetHandle === "userMessage") {
          inputData.userMessage = sourceNode.data.result || sourceNode.data.text || sourceNode.data.output || "";
        } else if (edge.targetHandle === "systemPrompt") {
          inputData.systemPrompt = sourceNode.data.result || sourceNode.data.text || sourceNode.data.output || "";
        }
      }
    });

    if (imgUrls.length > 0) inputData.images = imgUrls;

    try {
      const fallbackImages = Array.isArray(data.images) ? data.images : (data.imageUrl ? [data.imageUrl] : []);
      
      const res = await fetch("/api/execute/node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeId: id,
          nodeType: "llmNode",
          data: {
            model: data.model || "gemini-2.0-flash",
            systemPrompt: data.systemPrompt || "",
            userMessage: data.userMessage || "",
            images: fallbackImages,
          },
          inputData
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setNodeExecution(id, { status: "failed", error: json.error || "AI Failure", finishedAt: Date.now() });
      } else {
        updateNodeData(id, { result: json.output });
        setNodeExecution(id, { status: "completed", result: json.output, finishedAt: Date.now() });
      }
    } catch (err: any) {
      setNodeExecution(id, { status: "failed", error: err.message, finishedAt: Date.now() });
    } finally {
      setRunning(false);
    }
  };

  const isSocialPost = data.result && (data.result.length < 280 || data.result.includes("#"));

  return (
    <BaseNode id={id} nodeType="llmNode" title="Gemini AI Engine" icon={<Cpu size={12} />} accentColor={accentColor} minWidth={300}>
      <div className="absolute -left-[6px] top-0 bottom-0 flex flex-col justify-around py-8 z-20">
        <Handle type="target" position={Position.Left} id="systemPrompt" style={getHandleStyle("#fbbf24")} />
        <Handle type="target" position={Position.Left} id="userMessage" style={getHandleStyle("#a855f7")} />
        <Handle type="target" position={Position.Left} id="images" style={getHandleStyle("#3b82f6")} />
      </div>
      
      <div className="flex flex-col gap-3.5 mt-2">
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-1">Model Config</label>
          <select
            value={data.model || "gemini-2.0-flash"}
            onChange={(e) => updateNodeData(id, { model: e.target.value })}
            className="w-full bg-[#050505] border border-white/5 rounded-xl px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-purple-500/30 shadow-inner"
          >
            {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>

        <button
          onClick={handleRunNode}
          disabled={running}
          className="relative group/btn w-full py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-[11px] font-black tracking-widest transition-all disabled:opacity-50 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)] active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <div className="flex items-center justify-center gap-2">
            {running ? <Loader2 className="animate-spin" size={12} /> : <><Play size={10} fill="currentColor" /> RUN NODE</>}
          </div>
        </button>

        {data.result && (
          <div className={`p-4 rounded-2xl border transition-all duration-500 shadow-2xl ${
            isSocialPost 
              ? "bg-gradient-to-br from-purple-900/20 to-black/40 border-purple-500/20" 
              : "bg-black/40 border-white/5"
          }`}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} className="text-purple-400" />
                <span className="text-[9px] uppercase tracking-[0.15em] font-black text-zinc-500">Output</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <div className="text-[12px] text-zinc-200 leading-relaxed font-medium whitespace-pre-wrap selection:bg-purple-500/30">
              {data.result}
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="output" style={{ ...getHandleStyle("#f8fafc"), right: -6 }} />
    </BaseNode>
  );
}