import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/workflows/[id]/runs — fetch run history for a specific workflow
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const runs = await prisma.run.findMany({
      where: { 
        workflowId: id,
        workflow: { userId } // Ensure the workflow belongs to the user
      },
      orderBy: { startedAt: "desc" },
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
      }
    });

    return NextResponse.json(runs);
  } catch (error) {
    console.error("GET /api/workflows/[id]/runs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
