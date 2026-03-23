"use client";

import { Handle, Position } from "reactflow";
import { Video, Upload, Loader2, PlayCircle } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

interface UploadVideoNodeData {
  label?: string;
  videoUrl?: string;
  fileName?: string;
}

const getHandleStyle = (color: string) => ({
  width: 10,
  height: 10,
  background: color,
  border: "2px solid #050505",
  boxShadow: `0 0 10px ${color}40`,
});

export function UploadVideoNode({ id, data }: { id: string; data: UploadVideoNodeData }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accentColor = "#f59e0b";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side quick check
    if (file.size > 100 * 1024 * 1024) {
      setError("File is too large (Max 100MB)");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Get Signature & Params from our backend
      const sigRes = await fetch("/api/upload/signature", { method: "POST" });
      if (!sigRes.ok) throw new Error("Could not authorize upload");
      const { params, signature } = await sigRes.json();

      // 2. Upload directly to Transloadit
      const formData = new FormData();
      formData.append("params", params);
      formData.append("signature", signature);
      formData.append("file", file);

      // We use api2.transloadit.com and set wait=true in params to get results back
      const res = await fetch("https://api2.transloadit.com/assemblies", { 
        method: "POST", 
        body: formData 
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Direct upload to Transloadit failed");
      }
      
      const assembly = await res.json();
      
      // Since we didn't specify waitForCompletion: true in server params (browser handles it differently), 
      // we might need to pole if it's not immediate, but standard Transloadit /assemblies handles moderate files well.
      // For immediate response, the params we generated should ideally have "wait": true.
      
      const videoUrl = assembly.results?.encode?.[0]?.ssl_url;
      
      if (!videoUrl) {
        throw new Error("Transloadit processed the upload but failed to generate a playable video URL.");
      }
      
      updateNodeData(id, { videoUrl, fileName: file.name });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <BaseNode
      id={id}
      nodeType="uploadVideoNode"
      title="Upload Video"
      icon={<Video size={12} />}
      accentColor={accentColor}
      minWidth={300}
    >
      <div className="flex flex-col gap-3.5 mt-2">
        {data.videoUrl ? (
          <div className="group/preview relative rounded-2xl overflow-hidden bg-[#050505] border border-white/5 shadow-2xl">
            <video
              src={data.videoUrl}
              controls
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 h-1/3 flex items-end pointer-events-none">
              <div className="flex items-center gap-2 min-w-0">
                <PlayCircle size={12} className="text-amber-400 flex-shrink-0" />
                <p className="text-white text-[11px] font-bold truncate tracking-tight">{data.fileName}</p>
              </div>
            </div>
            
            <label className="absolute top-2 right-2 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover/preview:opacity-100 cursor-pointer transition-all hover:bg-white/10">
              <Upload size={12} className="text-white" />
              <input type="file" accept="video/*" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5 cursor-pointer transition-all bg-[#050505] group/drop">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover/drop:scale-110 transition-transform">
              {uploading ? (
                <Loader2 size={20} className="text-amber-400 animate-spin" />
              ) : (
                <Upload size={20} className="text-amber-400/60" />
              )}
            </div>
            <div className="text-center">
              <p className="text-zinc-200 text-[11px] font-bold tracking-tight">
                {uploading ? "Analyzing video..." : "Click to upload video"}
              </p>
              <p className="text-zinc-500 text-[9px] font-medium mt-1 uppercase tracking-widest">MP4, MOV, WebM, M4V</p>
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="sr-only"
              disabled={uploading}
            />
          </label>
        )}

        {error && <p className="text-red-400 text-[10px] font-medium px-1">{error}</p>}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="videoUrl"
        style={{ ...getHandleStyle(accentColor), right: -6 }}
      />
    </BaseNode>
  );
}
