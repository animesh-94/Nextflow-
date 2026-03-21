"use client";

import { useState } from "react";
import {
  Plus, MousePointer2, Hand, Scissors,
  Sparkles, Link2, Undo2, Redo2, Keyboard,
  ZoomIn, ZoomOut, Maximize, Command
} from "lucide-react";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { motion, AnimatePresence } from "framer-motion";

const TOOLS = [
  { id: "add", icon: Plus, label: "Add node", shortcut: "A" },
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pan", icon: Hand, label: "Pan", shortcut: "H" },
  { id: "cut", icon: Scissors, label: "Cut", shortcut: "X" },
  { id: "arrange", icon: Sparkles, label: "AI arrange", shortcut: "S" },
  { id: "connect", icon: Link2, label: "Connect", shortcut: "C" },
];

export function CanvasToolbar() {
  const { undo, redo } = useWorkflowStore.temporal.getState();
  const [activeTool, setActiveTool] = useState("add");
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  return (
    <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-8 pointer-events-none z-50 select-none">

      {/* LEFT: History Cluster */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center p-1 bg-zinc-900/90 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
          <button
            onClick={() => undo()}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button
            onClick={() => redo()}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <button className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 transition-all">
          <Keyboard size={14} className="text-zinc-500 group-hover:text-zinc-300" />
          <span className="text-zinc-500 group-hover:text-zinc-300 text-[11px] font-bold uppercase tracking-widest">Shortcuts</span>
        </button>
      </div>

      {/* CENTER: Main Tool Pill */}
      <div className="relative flex items-center gap-1 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-1.5 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
              onClick={() => setActiveTool(tool.id)}
              className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-300 z-10 ${isActive ? "text-black" : "text-zinc-500 hover:text-zinc-200"
                }`}
            >
              <tool.icon size={18} strokeWidth={isActive ? 2.5 : 2} />

              {/* Tooltip on Hover */}
              <AnimatePresence>
                {hoveredTool === tool.id && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute whitespace-nowrap px-3 py-1.5 rounded-lg bg-white text-black text-[11px] font-bold shadow-xl flex items-center gap-2 pointer-events-none"
                  >
                    {tool.label}
                    <span className="opacity-30 flex items-center gap-0.5">
                      <Command size={10} /> {tool.shortcut}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sliding Active Background */}
              {isActive && (
                <motion.div
                  layoutId="activeTool"
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* RIGHT: Canvas Controls (Zoom/Fit) */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900/90 backdrop-blur-xl border border-white/5 rounded-2xl pointer-events-auto shadow-2xl">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
          <ZoomOut size={16} />
        </button>
        <div className="px-2 text-[11px] font-black text-zinc-500">100%</div>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
          <ZoomIn size={16} />
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}