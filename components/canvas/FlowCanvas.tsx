"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  addEdge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  type OnConnect,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";

import { useWorkflowStore } from "@/store/useWorkflowStore";
import { isValidConnection as checkConnection } from "@/lib/connectionTypes";
import { AnimatedEdge } from "./edges/AnimatedEdge";
import { CanvasToolbar } from "./CanvasToolbar";
import { NODE_CATALOG } from "@/components/layout/LeftSidebar";
import { CANVAS_TEMPLATES } from "@/lib/templates";

// Node components
import { TextNode } from "../nodes/TextNode";
import { UploadImageNode } from "../nodes/UploadImageNode";
import { UploadVideoNode } from "../nodes/UploadVideoNode";
import { LLMNode } from "../nodes/LLMNode";
import { CropImageNode } from "../nodes/CropImageNode";
import { ExtractFrameNode } from "../nodes/ExtractFrameNode";

import { Plus, X, Sparkles, Box } from "lucide-react";

// ── FIX: Define types OUTSIDE component to prevent re-render cycles ────
const nodeTypes: NodeTypes = {
  textNode: TextNode,
  uploadImageNode: UploadImageNode,
  uploadVideoNode: UploadVideoNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge
};

const NODE_COLORS: Record<string, string> = Object.fromEntries(
  NODE_CATALOG.map((n) => [n.id, n.color])
);

// ── Cycle detection logic (Kept intact) ──────────────────────────
function hasCycle(nodes: { id: string }[], edges: { source: string; target: string }[]) {
  const graph: Record<string, string[]> = {};
  nodes.forEach((n) => (graph[n.id] = []));
  edges.forEach((e) => { if (graph[e.source]) graph[e.source].push(e.target); });
  const visited = new Set<string>();
  const inStack = new Set<string>();
  function dfs(id: string): boolean {
    visited.add(id); inStack.add(id);
    for (const nb of graph[id] || []) {
      if (!visited.has(nb) && dfs(nb)) return true;
      if (inStack.has(nb)) return true;
    }
    inStack.delete(id); return false;
  }
  return nodes.some((n) => !visited.has(n.id) && dfs(n.id));
}

// ── Improved Template Previews ─────────────────────────────────────
const PREVIEWS: Record<string, React.FC> = {
  imggen: () => (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 rounded bg-yellow-500/20 border border-yellow-500/50" />
        <div className="w-8 h-[2px] bg-zinc-700" />
        <div className="w-20 h-16 rounded bg-blue-500/20 border border-blue-500/50" />
      </div>
    </div>
  ),
  vidgen: () => (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 rounded bg-yellow-500/20 border border-yellow-500/50" />
        <div className="w-20 h-20 rounded bg-green-500/20 border border-green-500/50" />
      </div>
    </div>
  ),
  upscale: () => (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded bg-blue-500/20 border border-blue-500/50" />
        <div className="w-20 h-16 rounded bg-pink-500/20 border border-pink-500/50" />
      </div>
    </div>
  ),
  llmcap: () => (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="w-10 h-10 rounded bg-blue-500/20 border border-blue-500/50" />
        <div className="w-10 h-10 rounded bg-yellow-500/20 border border-blue-500/50" />
        <div className="col-span-2 h-10 rounded bg-purple-500/20 border border-purple-500/50" />
      </div>
    </div>
  ),
  "prod-kit": () => (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full h-full">
        {/* Branch A */}
        <div className="absolute top-0 left-0 w-8 h-8 rounded bg-blue-500/20 border border-blue-500/50" />
        <div className="absolute top-10 left-0 w-12 h-4 rounded bg-yellow-500/20 border border-yellow-500/50 scale-75" />
        {/* Branch B */}
        <div className="absolute bottom-0 left-0 w-8 h-8 rounded bg-red-500/20 border border-red-500/50" />
        {/* Convergence */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-16 rounded bg-purple-600/20 border border-purple-500/50" />
        {/* Edges */}
        <div className="absolute top-4 left-8 w-12 h-[1px] bg-zinc-800 rotate-12" />
        <div className="absolute bottom-4 left-8 w-16 h-[1px] bg-zinc-800 -rotate-12" />
      </div>
    </div>
  ),
};

const TEMPLATES = [
  { id: "prod-kit", label: "Marketing Kit", accent: "#a855f7", desc: "Image + Video Social Post" },
  { id: "imggen", label: "Image Gen", accent: "#3b82f6", desc: "Text to Image" },
  { id: "vidgen", label: "Video Gen", accent: "#22c55e", desc: "Wan 2.1 Model" },
  { id: "upscale", label: "Upscaler", accent: "#ec4899", desc: "8K Enhancement" },
  { id: "llmcap", label: "Vision LLM", accent: "#eab308", desc: "Image Captioning" },
];

// ── REFINED EMPTY STATE OVERLAY ────────────────────────────────────
function EmptyStateOverlay({ onDismiss, onLoadTemplate }: { onDismiss: () => void, onLoadTemplate: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-sm pointer-events-none"
    >
      <div className="max-w-5xl w-full px-10 pointer-events-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-zinc-100 text-3xl font-bold tracking-tight mb-2">Build your workflow</h2>
          <p className="text-zinc-500 text-sm">Select a preset template or start with a blank canvas.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Empty Option */}
          <button
            onClick={onDismiss}
            className="group flex flex-col gap-3 p-2 rounded-[24px] bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all hover:bg-zinc-900"
          >
            <div className="aspect-[4/3] w-full rounded-[18px] bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-800">
              <Plus className="text-zinc-500 group-hover:text-white group-hover:scale-110 transition-all" size={24} />
            </div>
            <div className="px-2 pb-2">
              <p className="text-white text-[13px] font-bold text-left">Empty Canvas</p>
              <p className="text-zinc-500 text-[11px] text-left">Start from zero</p>
            </div>
          </button>

          {/* Templates */}
          {TEMPLATES.map((t) => {
            const Preview = PREVIEWS[t.id];
            return (
              <button
                key={t.id}
                onClick={() => onLoadTemplate(t.id)}
                className="group flex flex-col gap-3 p-2 rounded-[24px] bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all hover:bg-zinc-900"
              >
                <div className="aspect-[4/3] w-full rounded-[18px] bg-zinc-950 border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: `radial-gradient(circle at center, ${t.accent}, transparent)` }} />
                  <Preview />
                </div>
                <div className="px-2 pb-2">
                  <p className="text-white text-[13px] font-bold text-left">{t.label}</p>
                  <p className="text-zinc-500 text-[11px] text-left">{t.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button onClick={onDismiss} className="text-zinc-600 hover:text-zinc-300 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors">
            <X size={12} /> Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN CANVAS ────────────────────────────────────────────────────
export function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, setEdges, addNode, loadWorkflow } = useWorkflowStore();
  const [showEmptyState, setShowEmptyState] = useState(true);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);
      if (!sourceNode || !targetNode) return;

      const valid = checkConnection(
        sourceNode.type || "",
        params.sourceHandle || "output",
        targetNode.type || "",
        params.targetHandle || "input"
      );

      if (!valid) return;

      const color = NODE_COLORS[sourceNode.type || ""] || "#555";
      const newEdges = addEdge(
        { ...params, type: "animated", data: { color } },
        edges
      );

      if (hasCycle(nodes, newEdges)) return;
      setEdges(newEdges);
    },
    [nodes, edges, setEdges]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData("application/reactflow-nodetype");
      if (!nodeType) return;
      const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

      addNode({
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position: { x: e.clientX - bounds.left - 80, y: e.clientY - bounds.top - 40 },
        data: { label: nodeType },
      });
      setShowEmptyState(false);
    },
    [addNode]
  );

  const handleLoadTemplate = (id: string) => {
    const template = CANVAS_TEMPLATES[id];
    if (template) {
      loadWorkflow({
        id: "",
        name: TEMPLATES.find(t => t.id === id)?.label || "New Workflow",
        nodes: template.nodes,
        edges: template.edges,
      });
    }
    setShowEmptyState(false);
  };

  return (
    <div className="w-full h-full relative" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={nodes.length > 0}
        minZoom={0.1}
        maxZoom={4}
        className="bg-[#080808]"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1a1a1a"
        />
      </ReactFlow>

      <AnimatePresence>
        {nodes.length === 0 && showEmptyState && (
          <EmptyStateOverlay
            onDismiss={() => setShowEmptyState(false)}
            onLoadTemplate={handleLoadTemplate}
          />
        )}
      </AnimatePresence>

      <CanvasToolbar />
    </div>
  );
}