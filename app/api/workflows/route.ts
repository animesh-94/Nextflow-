import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/workflows — fetch all workflows for the user
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const workflows = await prisma.workflow.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(workflows);
  } catch (error) {
    console.error("GET /api/workflows error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/workflows — create a new workflow
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name: body.name || "Untitled Workflow",
        description: body.description || "",
        nodes: body.nodes || [],
        edges: body.edges || [],
      },
    });
    return NextResponse.json(workflow);
  } catch (error) {
    console.error("POST /api/workflows error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
