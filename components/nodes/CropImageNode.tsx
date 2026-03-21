"use client";

import { Handle, Position } from "reactflow";
import { Crop, Play, Loader2, Scissors } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

interface CropImageNodeData {
  label?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  imageUrl?: string;
  croppedImageUrl?: string;
}

const getHandleStyle = (color: string) => ({
  width: 10,
  height: 10,
  background: color,
  border: "2px solid #050505",
  boxShadow: `0 0 10px ${color}40`,
});

export function CropImageNode({ id, data }: { id: string; data: CropImageNodeData }) {
  const { updateNodeData, setNodeExecution, edges, nodeExecutions } = useWorkflowStore();
  const execState = nodeExecutions[id];
  const [running, setRunning] = useState(false);
  const accentColor = "#ec4899";

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setNodeExecution(id, { status: "running", startedAt: Date.now() });
    const { nodes, edges: currEdges } = useWorkflowStore.getState();
    const incomingEdge = currEdges.find(e => e.target === id && e.targetHandle === "imageUrl");
    const sourceNode = incomingEdge ? nodes.find(n => n.id === incomingEdge.source) : null;
    const imageUrl = sourceNode ? (sourceNode.data.imageUrl || sourceNode.data.croppedImageUrl || sourceNode.data.frameImageUrl) : "";

    try {
      const res = await fetch("/api/execute/node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeId: id,
          nodeType: "cropImageNode",
          data: {
            x: data.x ?? 0,
            y: data.y ?? 0,
            width: data.width ?? 100,
            height: data.height ?? 100,
          },
          inputData: {
            imageUrl: imageUrl || data.imageUrl
          }
        }),
      });
      const result = await res.json();
      if (result.croppedImageUrl) {
        updateNodeData(id, { croppedImageUrl: result.croppedImageUrl });
      }
      setNodeExecution(id, {
        status: res.ok ? "completed" : "failed",
        result: result.croppedImageUrl,
        finishedAt: Date.now(),
      });
    } catch (err) {
      setNodeExecution(id, { status: "failed", error: String(err) });
    } finally {
      setRunning(false);
    }
  };

  const isRunning = execState?.status === "running" || running;

  const SliderField = ({ label, field, value }: { label: string; field: string; value: number }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center ml-1">
        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{label}</label>
        <span className="text-[10px] text-pink-400 font-black tracking-tight">{value}%</span>
      </div>
      <div className="relative h-1.5 w-full bg-[#050505] rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className="absolute inset-y-0 left-0 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"
          style={{ width: `${value}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => updateNodeData(id, { [field]: Number(e.target.value) })}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
        />
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      nodeType="cropImageNode"
      title="Precision Crop"
      icon={<Scissors size={12} />}
      accentColor={accentColor}
      minWidth={280}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="imageUrl"
        style={getHandleStyle(accentColor)}
      />

      <div className="flex flex-col gap-4 mt-2">
        {!data.croppedImageUrl && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/5 border border-pink-500/10 mb-1">
            <div className={`w-1.5 h-1.5 rounded-full ${edges.some(e => e.target === id && e.targetHandle === "imageUrl") ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-pink-500/40"}`} />
            <span className="text-[9px] font-bold text-zinc-500 italic">
              {edges.some(e => e.target === id && e.targetHandle === "imageUrl") 
                ? "IMAGE SOURCE ACTIVE" 
                : "AWAITING IMAGE INPUT"}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <SliderField label="X Offset" field="x" value={data.x ?? 0} />
          <SliderField label="Y Offset" field="y" value={data.y ?? 0} />
          <SliderField label="Width" field="width" value={data.width ?? 100} />
          <SliderField label="Height" field="height" value={data.height ?? 100} />
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="relative group/btn w-full py-2.5 bg-pink-600 hover:bg-pink-500 rounded-xl text-white text-[11px] font-black tracking-widest transition-all disabled:opacity-50 overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.2)] active:scale-95"
        >
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <div className="flex items-center justify-center gap-2">
            {isRunning ? (
              <><Loader2 size={12} className="animate-spin" /> CROPPING...</>
            ) : (
              <><Play size={10} fill="currentColor" /> RUN CROP</>
            )}
          </div>
        </button>

        {data.croppedImageUrl && (
          <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-white/5 shadow-2xl">
            <img src={data.croppedImageUrl} alt="Cropped" className="w-full h-32 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2.5">
              <p className="text-white text-[9px] font-bold uppercase tracking-widest opacity-60">Cropped Result</p>
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="croppedImageUrl"
        style={{ ...getHandleStyle(accentColor), right: -6 }}
      />
    </BaseNode>
  );
}
