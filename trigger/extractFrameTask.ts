import { task } from "@trigger.dev/sdk/v3";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

interface ExtractFramePayload {
  runId: string;
  nodeId: string;
  videoUrl: string;
  timestamp: string; // HH:MM:SS
}

export const extractFrameTask = task({
  id: "extract-frame-task",
  maxDuration: 120,
  run: async (payload: ExtractFramePayload) => {
    const { videoUrl, timestamp } = payload;
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `video-input-${payload.nodeId}.mp4`);
    const outputPath = path.join(tmpDir, `frame-output-${payload.nodeId}.jpg`);

    try {
      // Download video
      const res = await fetch(videoUrl);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(inputPath, Buffer.from(buffer));

      // Extract single frame at timestamp
      await execAsync(
        `ffmpeg -ss ${timestamp} -i "${inputPath}" -vframes 1 -q:v 2 -y "${outputPath}"`
      );

      const outputBuffer = fs.readFileSync(outputPath);
      const base64 = outputBuffer.toString("base64");
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      return { frameImageUrl: dataUrl, nodeId: payload.nodeId, timestamp };
    } finally {
      try { fs.unlinkSync(inputPath); } catch {}
      try { fs.unlinkSync(outputPath); } catch {}
    }
  },
});
