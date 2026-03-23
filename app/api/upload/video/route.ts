import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Transloadit } from "transloadit";
import { createWriteStream, unlinkSync } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { join } from "path";
import { tmpdir } from "os";

// IMPORTANT: In Next.js App Router, 'export const config' is ignored for Route Handlers.
// Standard body limits are now managed via next.config.js (experimental.serverActions.bodySizeLimit).

// POST /api/upload/video
export async function POST(req: Request) {
  // NOTE: If deploying to Vercel, there is a hard 4.5MB payload limit for API routes.
  // For 100MB files, you should ideally use Direct Upload to Transloadit from the frontend.

  const { userId: authUserId } = await auth();
  const userId = authUserId || "test-user";

  try {
    // req.formData() handles the multi-part parsing. 
    // While it does buffer somewhat, we can avoid double buffering by streaming to disk.
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: MP4, MOV, WebM, M4V" }, { status: 400 });
    }

    // Logical size limit: 100MB
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 100MB" }, { status: 400 });
    }

    const transloadit = new Transloadit({
      authKey: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY!,
      authSecret: process.env.TRANSLOADIT_SECRET!,
    });

    // Use Streaming to write the file instead of loading the entire buffer into memory twice
    const tempPath = join(tmpdir(), `${Date.now()}-${file.name}`);
    
    try {
      const nodeStream = Readable.fromWeb(file.stream() as any);
      const writeStream = createWriteStream(tempPath);
      await pipeline(nodeStream, writeStream);

      // Create Transloadit Assembly
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
        // WARNING: waitForCompletion can cause timeouts on Vercel/Serverless (30s limit typical)
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
