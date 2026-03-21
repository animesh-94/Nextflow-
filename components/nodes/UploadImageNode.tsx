"use client";

import { Handle, Position } from "reactflow";
import { Image as ImageIcon, Upload, Loader2, FileImage } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

interface UploadImageNodeData {
  label?: string;
  imageUrl?: string;
  fileName?: string;
}

const getHandleStyle = (color: string) => ({
  width: 10,
  height: 10,
  background: color,
  border: "2px solid #050505",
  boxShadow: `0 0 10px ${color}40`,
});

export function UploadImageNode({ id, data }: { id: string; data: UploadImageNodeData }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accentColor = "#3b82f6";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("nodeId", id);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      updateNodeData(id, { imageUrl: url, fileName: file.name });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <BaseNode
      id={id}
      nodeType="uploadImageNode"
      title="Upload Image"
      icon={<ImageIcon size={12} />}
      accentColor={accentColor}
      minWidth={280}
    >
      <div className="flex flex-col gap-3.5 mt-2">
        {data.imageUrl ? (
          <div className="group/preview relative rounded-2xl overflow-hidden bg-[#050505] border border-white/5 shadow-2xl">
            <img
              src={data.imageUrl}
              alt="Uploaded"
              className="w-full h-40 object-cover transition-transform duration-500 group-hover/preview:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
              <div className="flex items-center gap-2">
                <FileImage size={12} className="text-blue-400" />
                <p className="text-white text-[11px] font-bold truncate tracking-tight">{data.fileName}</p>
              </div>
            </div>
            
            <label className="absolute top-2 right-2 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover/preview:opacity-100 cursor-pointer transition-all hover:bg-white/10">
              <Upload size={12} className="text-white" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer transition-all bg-[#050505] group/drop">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover/drop:scale-110 transition-transform">
              {uploading ? (
                <Loader2 size={20} className="text-blue-400 animate-spin" />
              ) : (
                <Upload size={20} className="text-blue-400/60" />
              )}
            </div>
            <div className="text-center">
              <p className="text-zinc-200 text-[11px] font-bold tracking-tight">
                {uploading ? "Uploading media..." : "Click to upload image"}
              </p>
              <p className="text-zinc-500 text-[9px] font-medium mt-1 uppercase tracking-widest">JPG, PNG, WebP, GIF</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              disabled={uploading}
            />
          </label>
        )}

        {error && (
          <p className="text-red-400 text-[10px] font-medium px-1">{error}</p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="imageUrl"
        style={{ ...getHandleStyle(accentColor), right: -6 }}
      />
    </BaseNode>
  );
}
