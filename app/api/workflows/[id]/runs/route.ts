import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/workflows/[id]/runs
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const workflow = await prisma.workflow.findFirst({ where: { id, userId } });
  if (!workflow) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const runs = await prisma.run.findMany({
    where: { workflowId: id },
    orderBy: { startedAt: "desc" },
    take: 50,
    include: {
      nodeExecutions: {
        select: {
          nodeId: true,
          nodeType: true,
          status: true,
          startedAt: true,
          finishedAt: true,
          error: true,
        },
      },
    },
  });

  return NextResponse.json({ runs });
}

// POST /api/workflows/[id]/runs — create new run entry
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const workflow = await prisma.workflow.findFirst({ where: { id, userId } });
  if (!workflow) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const run = await prisma.run.create({
    data: {
      workflowId: id,
      scope: body.scope || "full",
      triggeredBy: userId,
      status: "PENDING",
    },
  });
  return NextResponse.json(run, { status: 201 });
}
