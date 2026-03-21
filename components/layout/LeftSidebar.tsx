"use client";

import { useEffect, useRef, useState } from "react";
import {
  Type, Image, Video, Bot, Crop, Film,
  MoreHorizontal, Layers, Plus, BarChart2,
  Settings, CreditCard, Zap, LogOut, ChevronRight,
  Command
} from "lucide-react";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { useUser, useClerk } from "@clerk/nextjs";
import type { Node as RFNode } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";

export const NODE_CATALOG = [
  { id: "textNode", label: "Text / Prompt", icon: Type, color: "#fbbf24" },
  { id: "uploadImageNode", label: "Upload Image", icon: Image, color: "#3b82f6" },
  { id: "uploadVideoNode", label: "Upload Video", icon: Video, color: "#10b981" },
  { id: "llmNode", label: "Run any LLM", icon: Bot, color: "#8b5cf6" },
  { id: "cropImageNode", label: "Crop Image", icon: Crop, color: "#ec4899" },
  { id: "extractFrameNode", label: "Extract Frame", icon: Film, color: "#f97316" },
];

let nodeCounter = 0;

/* ── Refined User Menu Popover ─────────────────────────────────── */
function UserMenuPopover({ onClose }: { onClose: () => void }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const ref = useRef<HTMLDivElement>(null);

  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "User";

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as any)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const menuItems = [
    { icon: Zap, label: "Upgrade plan", badge: "PRO" },
    { icon: CreditCard, label: "Buy credits" },
    { icon: Settings, label: "Settings" },
    { icon: BarChart2, label: "Usage Statistics" },
    { icon: LogOut, label: "Log out", onClick: () => signOut({ redirectUrl: "/" }), danger: true },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-[calc(100%+12px)] left-0 w-[260px] rounded-[22px] overflow-hidden z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0d0d0d]/95 backdrop-blur-2xl p-2"
    >
      <div className="px-3 py-3 border-b border-white/5 mb-2">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-3">Workspace</p>
        <button className="w-full flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-lg">
            {displayName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-bold truncate leading-none mb-1">{displayName}&apos;s Studio</p>
            <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-tighter">Personal Free</p>
          </div>
        </button>
      </div>

      <div className="space-y-0.5">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-[13px] font-medium group ${item.danger ? "text-zinc-400 hover:text-red-400 hover:bg-red-500/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={16} className={item.danger ? "" : "group-hover:text-blue-400 transition-colors"} />
              {item.label}
            </div>
            {item.badge && <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-widest">{item.badge}</span>}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Improved LeftSidebar ────────────────────────────────────────── */
export function LeftSidebar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "User";
  const initial = displayName[0]?.toUpperCase() ?? "U";

  const handleAdd = (type: string) => {
    nodeCounter++;
    addNode({
      id: `${type}-${Date.now()}-${nodeCounter}`,
      type,
      position: { x: 300, y: 200 },
      data: { label: type },
    });
  };

  return (
    <aside className="flex flex-col items-center py-4 gap-4 border border-white/10 rounded-2xl relative z-50 bg-[#0d0d0d]/80 backdrop-blur-3xl w-[60px] min-w-[60px] h-full shadow-[0_0_30px_rgba(0,0,0,0.5)]">

      {/* Brand Icon */}
      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-2">
        <Layers size={18} className="text-black" />
      </div>

      <div className="w-8 h-px bg-white/5" />

      {/* Node Catalog - Vertical Pill Style */}
      <div className="flex flex-col gap-3">
        {NODE_CATALOG.map((node) => (
          <motion.button
            key={node.id}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            draggable
            onDragStart={(e: any) => e.dataTransfer.setData("application/reactflow-nodetype", node.id)}
            onClick={() => handleAdd(node.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center relative group transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${node.color}20, ${node.color}05)`,
              border: `1px solid ${node.color}30`,
              color: node.color
            }}
          >
            <node.icon size={16} strokeWidth={2.5} />

            {/* Tooltip Label */}
            <div className="absolute left-14 px-2 py-1 rounded-md bg-white text-black text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl tracking-tight">
              {node.label}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex-1" />

      {/* User Area */}
      <div className="relative pb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl relative group overflow-hidden transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:opacity-100 opacity-0 transition-opacity" />
          <span className="text-indigo-400 font-bold text-xs relative z-10">{initial}</span>
        </motion.button>

        {/* The Overlapping Label (Pill) - Modernised */}
        <div className="absolute left-14 bottom-2 pointer-events-none">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0d0d0d] border border-white/5 shadow-2xl min-w-[180px]">
            <div className="flex flex-col min-w-0">
              <span className="text-white text-[12px] font-bold tracking-tight truncate leading-tight">{displayName}</span>
              <span className="text-zinc-500 text-[9px] uppercase font-black tracking-widest mt-0.5">Free Plan</span>
            </div>
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && <UserMenuPopover onClose={() => setMenuOpen(false)} />}
        </AnimatePresence>
      </div>
    </aside>
  );
}