import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Transloadit } from "transloadit";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// POST /api/upload/image
export async function POST(req: Request) {
  const { userId: authUserId } = await auth();
  const userId = authUserId || "test-user";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF" }, { status: 400 });
    }

    // Transloadit implementation
    const transloadit = new Transloadit({
      authKey: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY!,
      authSecret: process.env.TRANSLOADIT_SECRET!,
    });

    const buffer = await file.arrayBuffer();
    const tempPath = join(tmpdir(), `${Date.now()}-${file.name}`);
    writeFileSync(tempPath, Buffer.from(buffer));

    try {
      const assembly = await transloadit.createAssembly({
        params: {
          steps: {
            resize: {
              robot: "/image/resize",
            },
          },
        },
        files: {
          [file.name]: tempPath,
        },
        waitForCompletion: true,
      });

      const url = assembly.results?.resize?.[0]?.ssl_url || assembly.assembly_ssl_url;

      return NextResponse.json({
        url,
        fileName: file.name,
        fileType: file.type,
        assemblyId: assembly.assembly_id,
      });
    } finally {
      try { unlinkSync(tempPath); } catch (e) { console.error("Temp file cleanup error:", e); }
    }
  } catch (err) {
    console.error("Transloadit Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
