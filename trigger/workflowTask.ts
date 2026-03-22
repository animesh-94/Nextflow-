import { task, wait } from "@trigger.dev/sdk/v3";
import prisma from "@/lib/prisma";
import { llmTask } from "./llmTask";
import { cropImageTask } from "./cropImageTask";
import { extractFrameTask } from "./extractFrameTask";

interface WorkflowTaskPayload {
  workflowId: string;
  runId: string;
}

export const workflowTask = task({
  id: "workflow-task",
  maxDuration: 600,
  run: async (payload: WorkflowTaskPayload) => {
    const { workflowId, runId } = payload;

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });
    if (!workflow) throw new Error("Workflow not found");

    const nodes = workflow.nodes as any[];
    const edges = workflow.edges as any[];

    const results: Record<string, any> = {};
    const nodeStatus: Record<string, "PENDING" | "RUNNING" | "COMPLETED" | "FAILED"> = {};
    nodes.forEach(n => nodeStatus[n.id] = "PENDING");

    // ── Build Dependency Graph ──────────────────────────────────────
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    nodes.forEach(n => {
      adj[n.id] = [];
      inDegree[n.id] = 0;
    });

    edges.forEach(e => {
      if (adj[e.source]) adj[e.source].push(e.target);
      if (inDegree[e.target] !== undefined) inDegree[e.target]++;
    });

    // ── Execution Helper ─────────────────────────────────────────────
    const executeNode = async (node: any) => {
      nodeStatus[node.id] = "RUNNING";
      const nodeExec = await prisma.nodeExecution.create({
        data: {
          runId,
          nodeId: node.id,
          nodeType: node.type,
          status: "RUNNING",
          startedAt: new Date(),
        },
      });

      try {
        let output: any = null;
        const nodeInputs: Record<string, any> = { ...node.data };
        const incomingEdges = edges.filter((e) => e.target === node.id);
        
        for (const edge of incomingEdges) {
          const sourceOutput = results[edge.source];
          if (sourceOutput !== undefined) {
            if (edge.targetHandle) {
              // If it's the images handle, accumulate into an array
              if (edge.targetHandle === "images") {
                if (!Array.isArray(nodeInputs.images)) nodeInputs.images = [];
                if (Array.isArray(sourceOutput)) {
                  nodeInputs.images.push(...sourceOutput);
                } else {
                  nodeInputs.images.push(sourceOutput);
                }
              } else {
                nodeInputs[edge.targetHandle] = sourceOutput;
              }
            } else {
              // Default mapping (Legacy fallback)
              if (node.type === "llmNode") {
                if (!Array.isArray(nodeInputs.images)) nodeInputs.images = [];
                nodeInputs.images.push(sourceOutput);
              }
              else if (node.type === "cropImageNode") nodeInputs.imageUrl = sourceOutput;
              else if (node.type === "extractFrameNode") nodeInputs.videoUrl = sourceOutput;
            }
          }
        }

        // Execution
        if (node.type === "llmNode") {
          const res = await llmTask.triggerAndWait({
            runId,
            nodeId: node.id,
            model: nodeInputs.model || "gemini-3.0-flash",
            systemPrompt: nodeInputs.systemPrompt || "",
            userMessage: nodeInputs.userMessage || nodeInputs.text || "",
            imageUrls: Array.isArray(nodeInputs.images) ? nodeInputs.images : (nodeInputs.imageUrl ? [nodeInputs.imageUrl] : []),
          });
          if (res.ok) output = res.output;
        } else if (node.type === "cropImageNode") {
          const res = await cropImageTask.triggerAndWait({
            runId,
            nodeId: node.id,
            imageUrl: nodeInputs.imageUrl || nodeInputs.images?.[0] || "",
            x: nodeInputs.x ?? 0,
            y: nodeInputs.y ?? 0,
            width: nodeInputs.width ?? 100,
            height: nodeInputs.height ?? 100,
          });
          if (res.ok) output = res.output.croppedImageUrl;
        } else if (node.type === "extractFrameNode") {
          const res = await extractFrameTask.triggerAndWait({
            runId,
            nodeId: node.id,
            videoUrl: nodeInputs.videoUrl || "",
            timestamp: nodeInputs.timestamp || "00:00:01",
          });
          if (res.ok) output = res.output.frameImageUrl;
        } else if (node.type === "textNode") {
          output = node.data.text;
        } else if (node.type === "uploadImageNode") {
          output = node.data.imageUrl;
        } else if (node.type === "uploadVideoNode") {
          output = node.data.videoUrl;
        }

        results[node.id] = output;
        nodeStatus[node.id] = "COMPLETED";

        await prisma.nodeExecution.update({
          where: { id: nodeExec.id },
          data: {
            status: "COMPLETED",
            outputs: output ? { result: output } : undefined,
            finishedAt: new Date(),
          },
        });
      } catch (err: any) {
        nodeStatus[node.id] = "FAILED";
        await prisma.nodeExecution.update({
          where: { id: nodeExec.id },
          data: {
            status: "FAILED",
            error: err.message,
            finishedAt: new Date(),
          },
        });
        throw err;
      }
    };

    // ── Parallel Layered Execution ───────────────────────────────────
    let processedNodeCount = 0;
    const queue: string[] = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);

    while (queue.length > 0) {
      // Execute all currently ready nodes in parallel
      const currentLayerIds = [...queue];
      queue.length = 0; // Clear queue for next layer

      await Promise.all(currentLayerIds.map(async (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        await executeNode(node);
        processedNodeCount++;

        // Unlock dependents
        for (const neighborId of adj[nodeId]) {
          inDegree[neighborId]--;
          if (inDegree[neighborId] === 0) {
            queue.push(neighborId);
          }
        }
      }));
    }

    if (processedNodeCount < nodes.length) {
      throw new Error("Cycle detected or unreachable nodes in workflow");
    }

    await prisma.run.update({
      where: { id: runId },
      data: { status: "COMPLETED", finishedAt: new Date() },
    });

    return { success: true };
  },
});
