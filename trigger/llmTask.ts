import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

interface LLMTaskPayload {
  runId: string;
  nodeId: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  imageUrls: string[];
}

export const llmTask = task({
  id: "llm-task",
  maxDuration: 120,
  run: async (payload: LLMTaskPayload) => {
    const { model, systemPrompt, userMessage, imageUrls } = payload;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY not configured");

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({
      model: model || "gemini-2.0-flash",
      systemInstruction: systemPrompt || undefined,
    });

    const parts: Part[] = [];

    if (userMessage) parts.push({ text: userMessage });

    // Process image inputs for multimodal
    for (const imageUrl of imageUrls.slice(0, 4)) {
      const imageRes = await fetch(imageUrl);
      const buffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = imageRes.headers.get("content-type") || "image/jpeg";
      parts.push({ inlineData: { mimeType, data: base64 } });
    }

    if (parts.length === 0) parts.push({ text: "Hello" });

    try {
      const result = await geminiModel.generateContent({ contents: [{ role: "user", parts }] });
      const output = result.response.text();
      return { output, nodeId: payload.nodeId };
    } catch (err: any) {
      if (err.status === 429) {
        throw new Error("Gemini API quota exceeded. Please wait a minute and try again.");
      }
      throw err;
    }
  },
});
