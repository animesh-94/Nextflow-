import type { Node, Edge } from "reactflow";

export const CANVAS_TEMPLATES: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  imggen: {
    nodes: [
      { id: "t1", type: "textNode", position: { x: 50, y: 50 }, data: { text: "A futuristic skyline at sunset, cyberpunk aesthetic, high detail" } },
      { id: "l1", type: "llmNode", position: { x: 400, y: 50 }, data: { model: "gemini-2.0-flash", systemPrompt: "You are an image generation prompt expert. Expand the user's prompt into a 300-word highly detailed prompt for Midjourney." } },
    ],
    edges: [
      { id: "e1", source: "t1", target: "l1", sourceHandle: "output", targetHandle: "userMessage", type: "animated", data: { color: "#fbbf24" } },
    ]
  },
  vidgen: {
    nodes: [
      { id: "t1", type: "textNode", position: { x: 50, y: 50 }, data: { text: "A slow underwater shot of a colorful coral reef with light beams" } },
      { id: "l1", type: "llmNode", position: { x: 400, y: 50 }, data: { model: "gemini-2.0-flash", systemPrompt: "You are a video direction expert. Describe the scene's movement, lighting, and camera angle based on the prompt." } },
    ],
    edges: [
      { id: "e1", source: "t1", target: "l1", sourceHandle: "output", targetHandle: "userMessage", type: "animated", data: { color: "#fbbf24" } },
    ]
  },
  upscale: {
    nodes: [
      { id: "u1", type: "uploadImageNode", position: { x: 50, y: 50 }, data: {} },
      { id: "c1", type: "cropImageNode", position: { x: 350, y: 50 }, data: { x: 0, y: 0, width: 100, height: 100 } },
    ],
    edges: [
      { id: "e1", source: "u1", target: "c1", sourceHandle: "imageUrl", targetHandle: "imageUrl", type: "animated", data: { color: "#3b82f6" } },
    ]
  },
  llmcap: {
    nodes: [
      { id: "u1", type: "uploadImageNode", position: { x: 50, y: 50 }, data: {} },
      { id: "l1", type: "llmNode", position: { x: 400, y: 50 }, data: { model: "gemini-2.0-flash", systemPrompt: "Describe what you see in this image in great detail." } },
    ],
    edges: [
      { id: "e1", source: "u1", target: "l1", sourceHandle: "imageUrl", targetHandle: "images", type: "animated", data: { color: "#3b82f6" } },
    ]
  },
  "prod-kit": {
    nodes: [
      // Branch A: Image
      { id: "u1", type: "uploadImageNode", position: { x: 50, y: 50 }, data: { title: "Product Image" } },
      { id: "t1", type: "textNode", position: { x: 50, y: 300 }, data: { text: "Premium Leather Watch" } },
      { id: "c1", type: "cropImageNode", position: { x: 350, y: 50 }, data: { x: 0, y: 0, width: 100, height: 100 } },
      { id: "l1", type: "llmNode", position: { x: 650, y: 150 }, data: { model: "gemini-2.0-flash", systemPrompt: "You are a product description expert. Create a concise, technical description." } },

      // Branch B: Video
      { id: "uv1", type: "uploadVideoNode", position: { x: 50, y: 550 }, data: { title: "Product Trailer" } },
      { id: "ef1", type: "extractFrameNode", position: { x: 350, y: 550 }, data: { timestamp: "00:00:02" } },

      // Convergence
      { id: "t2", type: "textNode", position: { x: 650, y: 500 }, data: { text: "You are a social media manager. Create a tweet-length marketing post based on the product image and video frame." } },
      { id: "l2", type: "llmNode", position: { x: 950, y: 300 }, data: { model: "gemini-2.0-flash", systemPrompt: "Social Media Manager" } },
    ],
    edges: [
      // Branch A connections
      { id: "ea1", source: "u1", target: "c1", sourceHandle: "imageUrl", targetHandle: "imageUrl", type: "animated", data: { color: "#3b82f6" } },
      { id: "ea2", source: "c1", target: "l1", sourceHandle: "croppedImageUrl", targetHandle: "images", type: "animated", data: { color: "#3b82f6" } },
      { id: "ea3", source: "t1", target: "l1", sourceHandle: "output", targetHandle: "userMessage", type: "animated", data: { color: "#fbbf24" } },

      // Branch B connections
      { id: "eb1", source: "uv1", target: "ef1", sourceHandle: "videoUrl", targetHandle: "videoUrl", type: "animated", data: { color: "#ef4444" } },

      // Convergence connections
      { id: "ec1", source: "l1", target: "l2", sourceHandle: "output", targetHandle: "userMessage", type: "animated", data: { color: "#a855f7" } },
      { id: "ec2", source: "c1", target: "l2", sourceHandle: "croppedImageUrl", targetHandle: "images", type: "animated", data: { color: "#3b82f6" } },
      { id: "ec3", source: "ef1", target: "l2", sourceHandle: "frameImageUrl", targetHandle: "images", type: "animated", data: { color: "#3b82f6" } },
      { id: "ec4", source: "t2", target: "l2", sourceHandle: "output", targetHandle: "systemPrompt", type: "animated", data: { color: "#fbbf24" } },
    ]
  }
};
