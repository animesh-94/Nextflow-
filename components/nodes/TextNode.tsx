"use client";

import { Handle, Position } from "reactflow";
import { Type } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

interface TextNodeData {
  label?: string;
  text?: string;
}

const getHandleStyle = (color: string) => ({
  width: 10,
  height: 10,
  background: color,
  border: "2px solid #050505",
  boxShadow: `0 0 10px ${color}40`,
});

export function TextNode({ id, data }: { id: string; data: TextNodeData }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const accentColor = "#eab308";

  return (
    <BaseNode
      id={id}
      nodeType="textNode"
      title="Text / Prompt"
      icon={<Type size={12} />}
      accentColor={accentColor}
      minWidth={280}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ ...getHandleStyle(accentColor), left: -6 }}
      />

      <div className="mt-2 group/input relative">
        <textarea
          value={data.text || ""}
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
          placeholder="Type your prompt here..."
          className="w-full bg-[#050505] border border-white/5 rounded-xl p-3 text-zinc-200 text-[13px] placeholder-zinc-700 resize-none focus:outline-none focus:border-yellow-500/40 transition-all leading-relaxed shadow-inner"
          rows={5}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover/input:opacity-100 transition-opacity">
           <Type size={10} className="text-zinc-800" />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ ...getHandleStyle(accentColor), right: -6 }}
      />
    </BaseNode>
  );
}
