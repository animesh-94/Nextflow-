import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Transloadit } from "transloadit";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "120mb",
    },
  },
};

// POST /api/upload/video
export async function POST(req: Request) {
  const { userId: authUserId } = await auth();
  const userId = authUserId || "test-user";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: MP4, MOV, WebM, M4V" }, { status: 400 });
    }

    // Size limit: 100MB
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 100MB" }, { status: 400 });
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
            encode: {
              robot: "/video/encode",
              preset: "iphone",
            },
          },
        },
        files: {
          [file.name]: tempPath,
        },
        waitForCompletion: true,
      });

      const url = assembly.results?.encode?.[0]?.ssl_url || assembly.assembly_ssl_url;

      return NextResponse.json({
        url,
        fileName: file.name,
        fileType: file.type,
        fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
        assemblyId: assembly.assembly_id,
      });
    } finally {
      try { unlinkSync(tempPath); } catch (e) { console.error("Temp file cleanup error:", e); }
    }
  } catch (err) {
    console.error("Transloadit Video Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
