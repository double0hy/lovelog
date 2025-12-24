import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEventMessage = async (
  title: string,
  daysCount: number,
  isFuture: boolean
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "请配置 API Key 以使用 AI 功能。";

  const prompt = isFuture
    ? `请用中文为即将到来的"${title}"（还有${daysCount}天）写一句简短、充满期待和激动人心的一句话寄语。`
    : `请用中文为已经过去${daysCount}天的"${title}"写一句简短、浪漫或感性的一句话回顾。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "享受这美好的时刻！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "暂时无法生成寄语。";
  }
};