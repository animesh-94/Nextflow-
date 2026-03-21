"use client";

import { useEffect, useState } from "react";
import { WorkflowEditor } from "@/components/layout/WorkflowEditor";
import { useWorkflowStore } from "@/store/useWorkflowStore";
import { sampleWorkflow } from "@/lib/sampleWorkflow";
import { Sparkles, Plus, LayoutTemplate, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
// FIX: Added missing Link import
import Link from "next/link";

export default function WorkflowPage() {
  const { resetWorkflow, loadWorkflow, workflowId, setWorkflowName } = useWorkflowStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!workflowId) {
      setShowWelcome(true);
    }
  }, [workflowId]);

  const handleLoadSample = () => {
    loadWorkflow({
      id: "",
      name: sampleWorkflow.name,
      nodes: sampleWorkflow.nodes,
      edges: sampleWorkflow.edges,
    });
    setWorkflowName(sampleWorkflow.name);
    setShowWelcome(false);
  };

  const handleNewWorkflow = () => {
    resetWorkflow();
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">

        {/* Background Sophistication */}
        <div className="absolute inset-0 dot-grid-bg opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full" />

        <div className="relative z-10 w-full max-w-5xl px-6">

          {/* Header Section */}
          <div className="flex flex-col items-center mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <span className="text-black font-black text-2xl tracking-tighter">N</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
            >
              Start a new project
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 text-lg max-w-md"
            >
              Choose a starting point for your creative workflow.
            </motion.p>
          </div>

          {/* Massive Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">

            {/* Card 1: Start from Scratch */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleNewWorkflow}
              className="group relative flex flex-col items-center justify-center bg-[#0a0a0a] border border-zinc-800 rounded-[32px] p-12 overflow-hidden transition-all hover:border-zinc-400 hover:bg-[#0f0f0f]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Plus size={32} className="text-zinc-400 group-hover:text-white" />
              </div>

              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Empty Canvas</h3>
                <p className="text-zinc-500 text-sm max-w-[200px] mx-auto">Start with a blank slate and build your own nodes.</p>
              </div>

              <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  Create New <ArrowRight size={16} />
                </div>
              </div>
            </motion.button>

            {/* Card 2: Load Template */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleLoadSample}
              className="group relative flex flex-col items-center justify-center bg-[#0a0a0a] border border-zinc-800 rounded-[32px] p-12 overflow-hidden transition-all hover:border-purple-500/50 hover:bg-[#0f0f0f]"
            >
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <div className="absolute top-10 left-10 w-32 h-20 bg-purple-600/30 rounded-xl blur-2xl" />
                <div className="absolute bottom-10 right-10 w-32 h-20 bg-blue-600/30 rounded-xl blur-2xl" />
              </div>

              <div className="w-20 h-20 rounded-full bg-purple-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <LayoutTemplate size={32} className="text-purple-400" />
              </div>

              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Sparkles size={10} /> Popular Template
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Marketing Kit</h3>
                <p className="text-zinc-500 text-sm max-w-[240px] mx-auto">Pre-configured generator for high-end product assets.</p>
              </div>

              <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  Launch Template <ArrowRight size={16} />
                </div>
              </div>
            </motion.button>

          </div>

          {/* Minimalist Footer Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-600 text-sm">
              Need help? <Link href="#" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4">Check out the tutorials</Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <WorkflowEditor />;
}