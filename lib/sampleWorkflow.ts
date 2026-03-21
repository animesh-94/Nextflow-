import type { Node, Edge } from "reactflow";

interface SampleWorkflow {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

// Product Marketing Kit Generator — demonstrates all 6 node types + parallel execution
export const sampleWorkflow: SampleWorkflow = {
  name: "Product Marketing Kit Generator",
  description: "Demonstrates all 6 node types with parallel branches and convergence",
  nodes: [
    // ─── Branch A ────────────────────────────────────────────────────
    // Text Node #1 — Product Details
    {
      id: "text-1",
      type: "textNode",
      position: { x: 80, y: 100 },
      data: {
        label: "Product Details",
        text: "NextFlow Pro Sneakers - Limited Edition 2026. Featuring responsive foam technology, sustainable materials, and a retro-futuristic design. Available in 5 colorways. Retail price: $180.",
      },
    },
    // Text Node #2 — System Prompt for LLM #1
    {
      id: "text-2",
      type: "textNode",
      position: { x: 80, y: 320 },
      data: {
        label: "System Prompt (Branch A)",
        text: "You are a creative product copywriter. Analyze the provided product image and details to create a compelling, detailed product description of 3-4 sentences. Focus on visual appeal, key features, and target audience.",
      },
    },
    // Upload Image Node
    {
      id: "upload-image-1",
      type: "uploadImageNode",
      position: { x: 430, y: 80 },
      data: { label: "Product Photo" },
    },
    // Crop Image Node
    {
      id: "crop-image-1",
      type: "cropImageNode",
      position: { x: 720, y: 80 },
      data: { label: "Crop Product", x: 10, y: 5, width: 80, height: 90 },
    },
    // LLM Node #1 — Product Description
    {
      id: "llm-1",
      type: "llmNode",
      position: { x: 1010, y: 80 },
      data: {
        label: "Product Description LLM",
        model: "gemini-2.0-flash",
        systemPrompt: "",
        userMessage: "",
      },
    },

    // ─── Branch B ────────────────────────────────────────────────────
    // Upload Video Node
    {
      id: "upload-video-1",
      type: "uploadVideoNode",
      position: { x: 430, y: 430 },
      data: { label: "Product Video" },
    },
    // Extract Frame Node
    {
      id: "extract-frame-1",
      type: "extractFrameNode",
      position: { x: 720, y: 430 },
      data: { label: "Extract Key Frame", timestamp: "00:00:03" },
    },

    // ─── Convergence ─────────────────────────────────────────────────
    // Text Node #3 — Final System Prompt
    {
      id: "text-3",
      type: "textNode",
      position: { x: 80, y: 580 },
      data: {
        label: "Social Media Prompt",
        text: "You are a social media manager. Create a tweet-length marketing post (max 280 chars) based on the product image and video frame. Include 2-3 relevant hashtags. Make it punchy and engaging.",
      },
    },
    // LLM Node #2 — Final Marketing Tweet (Convergence)
    {
      id: "llm-2",
      type: "llmNode",
      position: { x: 1300, y: 300 },
      data: {
        label: "Final Marketing Tweet",
        model: "gemini-2.0-flash",
        systemPrompt: "",
        userMessage: "",
      },
    },
  ],

  edges: [
    // Branch A connections
    { id: "e-text1-llm1", source: "text-1", target: "llm-1", sourceHandle: "output", targetHandle: "userMessage", type: "animated" },
    { id: "e-text2-llm1", source: "text-2", target: "llm-1", sourceHandle: "output", targetHandle: "systemPrompt", type: "animated" },
    { id: "e-img-crop", source: "upload-image-1", target: "crop-image-1", sourceHandle: "imageUrl", targetHandle: "imageUrl", type: "animated" },
    { id: "e-crop-llm1", source: "crop-image-1", target: "llm-1", sourceHandle: "croppedImageUrl", targetHandle: "images", type: "animated" },

    // Branch B connections
    { id: "e-video-extract", source: "upload-video-1", target: "extract-frame-1", sourceHandle: "videoUrl", targetHandle: "videoUrl", type: "animated" },

    // Convergence connections → LLM #2
    { id: "e-text3-llm2", source: "text-3", target: "llm-2", sourceHandle: "output", targetHandle: "systemPrompt", type: "animated" },
    { id: "e-llm1-llm2", source: "llm-1", target: "llm-2", sourceHandle: "output", targetHandle: "userMessage", type: "animated" },
    { id: "e-crop-llm2", source: "crop-image-1", target: "llm-2", sourceHandle: "croppedImageUrl", targetHandle: "images", type: "animated" },
    { id: "e-frame-llm2", source: "extract-frame-1", target: "llm-2", sourceHandle: "frameImageUrl", targetHandle: "images", type: "animated" },
  ],
};
