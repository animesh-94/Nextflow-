// ─── Handle Types ─────────────────────────────────────────────────
export type HandleType = "text" | "imageUrl" | "videoUrl" | "imageUrlArray";

// Which source types can connect to which target types
export const COMPATIBLE_TYPES: Record<HandleType, HandleType[]> = {
  text: ["text"],
  imageUrl: ["imageUrl", "imageUrlArray"],
  videoUrl: ["videoUrl"],
  imageUrlArray: ["imageUrlArray", "imageUrl"],
};

// Node handle definitions
export const NODE_HANDLES: Record<
  string,
  { inputs: Record<string, HandleType>; outputs: Record<string, HandleType> }
> = {
  textNode: {
    inputs: {},
    outputs: { output: "text" },
  },
  uploadImageNode: {
    inputs: {},
    outputs: { imageUrl: "imageUrl" },
  },
  uploadVideoNode: {
    inputs: {},
    outputs: { videoUrl: "videoUrl" },
  },
  llmNode: {
    inputs: {
      systemPrompt: "text",
      userMessage: "text",
      images: "imageUrl",
    },
    outputs: { output: "text" },
  },
  cropImageNode: {
    inputs: { imageUrl: "imageUrl" },
    outputs: { croppedImageUrl: "imageUrl" },
  },
  extractFrameNode: {
    inputs: { videoUrl: "videoUrl" },
    outputs: { frameImageUrl: "imageUrl" },
  },
};

// Validate if a connection is type-compatible
export function isValidConnection(
  sourceNodeType: string,
  sourceHandle: string,
  targetNodeType: string,
  targetHandle: string
): boolean {
  const sourceNode = NODE_HANDLES[sourceNodeType];
  const targetNode = NODE_HANDLES[targetNodeType];
  if (!sourceNode || !targetNode) return true; // allow if unknown

  const sourceType = sourceNode.outputs[sourceHandle];
  const targetType = targetNode.inputs[targetHandle];
  if (!sourceType || !targetType) return false;

  return COMPATIBLE_TYPES[sourceType]?.includes(targetType) ?? false;
}
