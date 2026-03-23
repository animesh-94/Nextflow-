export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds on Vercel

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transloadit } from "transloadit";

const ExecuteNodeSchema = z.object({
  nodeId: z.string(),
  nodeType: z.string(),
  data: z.record(z.string(), z.any()).default({}),
  inputData: z.record(z.string(), z.any()).optional().default({}),
});

export async function POST(req: Request) {
  const { userId: authUserId } = await auth();
  const userId = authUserId || "test-user";

  try {
    const body = await req.json();
    const parsed = ExecuteNodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    const { nodeId, nodeType, data, inputData } = parsed.data;

    const transloaditKey = process.env.TRANSLOADIT_KEY || process.env.NEXT_PUBLIC_TRANSLOADIT_KEY;
    const transloaditSecret = process.env.TRANSLOADIT_SECRET;

    if (!transloaditKey || !transloaditSecret) {
      console.error("Transloadit credentials missing in environment");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const transloadit = new Transloadit({
      authKey: transloaditKey,
      authSecret: transloaditSecret,
    });

    // ================= CROP IMAGE =================
    if (nodeType === "cropImageNode") {
      const imageUrl =
        (inputData?.imageUrl as string) ||
        (data.imageUrl as string) ||
        (data.images?.[0] as string) ||
        "";

      if (!imageUrl) {
        return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
      }

      try {
        const assembly = await transloadit.createAssembly({
          params: {
            steps: {
              import: {
                robot: "/http/import",
                url: imageUrl,
              },
              crop: {
                use: "import",
                robot: "/image/resize",
                crop: {
                  x1: `${data.x ?? 0}%`,
                  y1: `${data.y ?? 0}%`,
                  x2: `${(data.x ?? 0) + (data.width ?? 100)}%`,
                  y2: `${(data.y ?? 0) + (data.height ?? 100)}%`,
                },
              },
            },
          },
          waitForCompletion: true,
        });

        const croppedUrl = assembly.results?.crop?.[0]?.ssl_url;

        if (!croppedUrl) throw new Error("Crop failed");

        return NextResponse.json({ croppedImageUrl: croppedUrl });
      } catch (err) {
        console.error("Crop Error:", err);
        return NextResponse.json({ error: "Crop failed" }, { status: 500 });
      }
    }

    // ================= EXTRACT FRAME =================
    if (nodeType === "extractFrameNode") {
      const videoUrl =
        (inputData?.videoUrl as string) || (data.videoUrl as string) || "";

      if (!videoUrl) {
        return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
      }

      try {
        const assembly = await transloadit.createAssembly({
          params: {
            steps: {
              import: {
                robot: "/http/import",
                url: videoUrl,
              },
              extract: {
                use: "import",
                robot: "/video/thumbs",
                count: 1,
                offsets: [String(data.timestamp || "00:00:01")],
              },
            },
          },
          waitForCompletion: true,
        });

        if (assembly.error) {
          throw new Error(`Transloadit Error: ${assembly.error} - ${assembly.message}`);
        }

        const frameUrl = assembly.results?.extract?.[0]?.ssl_url;

        if (!frameUrl) {
          throw new Error(`Frame extraction yielded 0 results. The video might be shorter than the requested timestamp (${data.timestamp || "00:00:01"}).`);
        }

        return NextResponse.json({ frameImageUrl: frameUrl });
      } catch (err: any) {
        console.error("Extract Error:", err);
        return NextResponse.json({ error: err.message || "Extraction failed" }, { status: 500 });
      }
    }

    // ================= LLM NODE =================
    if (nodeType === "llmNode") {
      const systemPrompt =
        (inputData?.systemPrompt as string) ||
        (data.systemPrompt as string) ||
        "";

      const userMessage =
        (inputData?.userMessage as string) ||
        (data.userMessage as string) ||
        "Hello";

      const imageUrls =
        (inputData?.images as string[]) ||
        (data.images as string[]) ||
        (data.imageUrl ? [data.imageUrl] : []);

      try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
          return NextResponse.json(
            { error: "API Key Missing" },
            { status: 500 }
          );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
          model: data.model || "gemini-3-flash-preview",
          systemInstruction: systemPrompt || undefined,
        });

        const parts: any[] = [];

        if (userMessage) {
          parts.push({ text: userMessage });
        }

        for (const url of imageUrls.slice(0, 4)) {
          try {
            const imageRes = await fetch(url);
            const buffer = await imageRes.arrayBuffer();

            const base64 = Buffer.from(buffer).toString("base64"); // ✅ SAFE (Node runtime)

            parts.push({
              inlineData: {
                mimeType:
                  imageRes.headers.get("content-type") || "image/jpeg",
                data: base64,
              },
            });
          } catch (e) {
            console.error("Image fetch failed:", e);
          }
        }

        if (parts.length === 0) {
          parts.push({ text: "Hello" });
        }

        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
        });

        return NextResponse.json({
          output: result.response.text(),
        });
      } catch (err: any) {
        console.error("LLM Error:", err);

        return NextResponse.json(
          {
            error:
              err?.status === 429
                ? "Rate limit reached"
                : err?.message || "LLM failed",
          },
          { status: err?.status || 500 }
        );
      }
    }

    return NextResponse.json({ output: "Success" });
  } catch (err) {
    console.error("Global Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}