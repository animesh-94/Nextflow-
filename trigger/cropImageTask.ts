import { task } from "@trigger.dev/sdk/v3";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

interface CropImagePayload {
  runId: string;
  nodeId: string;
  imageUrl: string;
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
}

export const cropImageTask = task({
  id: "crop-image-task",
  maxDuration: 60,
  run: async (payload: CropImagePayload) => {
    const { imageUrl, x, y, width, height } = payload;
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `crop-input-${payload.nodeId}.jpg`);
    const outputPath = path.join(tmpDir, `crop-output-${payload.nodeId}.jpg`);

    try {
      // Download input image
      const res = await fetch(imageUrl);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(inputPath, Buffer.from(buffer));

      // Get image dimensions using ffprobe
      const { stdout: probeOut } = await execAsync(
        `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${inputPath}"`
      );
      const [imgWidth, imgHeight] = probeOut.trim().split(",").map(Number);

      // Convert percentages to pixels
      const cropX = Math.floor((x / 100) * imgWidth);
      const cropY = Math.floor((y / 100) * imgHeight);
      const cropW = Math.floor((width / 100) * imgWidth);
      const cropH = Math.floor((height / 100) * imgHeight);

      // Run FFmpeg crop
      await execAsync(
        `ffmpeg -i "${inputPath}" -vf "crop=${cropW}:${cropH}:${cropX}:${cropY}" -y "${outputPath}"`
      );

      const outputBuffer = fs.readFileSync(outputPath);
      const base64 = outputBuffer.toString("base64");
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      return { croppedImageUrl: dataUrl, nodeId: payload.nodeId };
    } finally {
      try { fs.unlinkSync(inputPath); } catch {}
      try { fs.unlinkSync(outputPath); } catch {}
    }
  },
});
