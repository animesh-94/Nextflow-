import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { workflowTask } from "@/trigger/workflowTask";

export const dynamic = 'force-dynamic';

const ExecuteSchema = z.object({
  workflowId: z.string(),
  scope: z.enum(["full", "node", "selection"]).default("full"),
  nodeIds: z.array(z.string()).optional(),
});

// POST /api/execute — trigger full workflow execution
export async function POST(req: Request) {
  const { userId: authUserId } = await auth();
  const userId = authUserId || "test-user";

  const body = await req.json().catch(() => ({}));
  const parsed = ExecuteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { workflowId, scope } = parsed.data;

  // 1. Ensure workflow exists and belongs to user
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, userId }
  });
  if (!workflow) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });

  // 2. Create a Run record
  const run = await prisma.run.create({
    data: {
      workflowId,
      scope,
      triggeredBy: userId,
      status: "RUNNING",
      startedAt: new Date(),
    },
  });

  // 3. Trigger the orchestrated task on Trigger.dev
  try {
    const handle = await workflowTask.trigger({
      workflowId,
      runId: run.id
    });

    return NextResponse.json({
      runId: run.id,
      status: "RUNNING",
      triggerHandle: handle.id
    });
  } catch (err: any) {
    console.error("CRITICAL: Failed to trigger workflow task:", err);
    console.error("Payload:", { workflowId, runId: run.id });

    // Fallback/Cleanup: Mark run as failed if trigger fails
    await prisma.run.update({
      where: { id: run.id },
      data: { status: "FAILED", finishedAt: new Date() }
    }).catch((prismaErr: any) => { 
      console.error("Failed to update Run status after trigger failure:", prismaErr);
    });

    return NextResponse.json({ 
      error: "Failed to initiate execution",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    }, { status: 500 });
  }
}
