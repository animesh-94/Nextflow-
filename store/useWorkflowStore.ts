"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { Node, Edge, Connection, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from "reactflow";

// Re-import apply functions
import { applyNodeChanges as _applyNodeChanges, applyEdgeChanges as _applyEdgeChanges } from "reactflow";

// ─── Types ─────────────────────────────────────────────────────────
export type NodeStatus = "idle" | "running" | "completed" | "failed";

export interface NodeExecutionState {
  status: NodeStatus;
  result?: string | null;
  error?: string | null;
  startedAt?: number;
  finishedAt?: number;
}

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  workflowId: string | null;
  workflowName: string;
  nodeExecutions: Record<string, NodeExecutionState>;
  isRunning: boolean;
  runId: string | null;
}

export interface WorkflowActions {
  // Node management
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: Partial<Record<string, unknown>>) => void;
  removeNode: (nodeId: string) => void;

  // Workflow metadata
  setWorkflowId: (id: string | null) => void;
  setWorkflowName: (name: string) => void;
  loadWorkflow: (workflow: { id: string; name: string; nodes: Node[]; edges: Edge[] }) => void;
  resetWorkflow: () => void;

  // Execution state
  setNodeExecution: (nodeId: string, state: NodeExecutionState) => void;
  clearExecutionState: () => void;
  setIsRunning: (running: boolean) => void;
  setRunId: (id: string | null) => void;
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  workflowId: null,
  workflowName: "Untitled Workflow",
  nodeExecutions: {},
  isRunning: false,
  runId: null,
};

export const useWorkflowStore = create<WorkflowState & WorkflowActions>()(
  temporal(
    (set) => ({
      ...initialState,

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      onNodesChange: (changes) =>
        set((state) => ({
          nodes: _applyNodeChanges(changes, state.nodes),
        })),

      onEdgesChange: (changes) =>
        set((state) => ({
          edges: _applyEdgeChanges(changes, state.edges),
        })),

      addNode: (node) =>
        set((state) => ({ nodes: [...state.nodes, node] })),

      updateNodeData: (nodeId, data) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
          ),
        })),

      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
        })),

      setWorkflowId: (id) => set({ workflowId: id }),
      setWorkflowName: (name) => set({ workflowName: name }),

      loadWorkflow: ({ id, name, nodes, edges }) =>
        set({ workflowId: id, workflowName: name, nodes, edges }),

      resetWorkflow: () => set(initialState),

      setNodeExecution: (nodeId, state) =>
        set((prev) => ({
          nodeExecutions: { ...prev.nodeExecutions, [nodeId]: state },
        })),

      clearExecutionState: () => set({ nodeExecutions: {}, isRunning: false }),

      setIsRunning: (running) => set({ isRunning: running }),
      setRunId: (id) => set({ runId: id }),
    }),
    {
      // Only track nodes and edges for undo/redo, not execution state
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);

// Expose undo/redo
export const useWorkflowHistory = () => useWorkflowStore.temporal;
