
import { GoogleGenAI, Type } from "@google/genai";
import { FlightRecord, AISettings } from "../types";

export const getFlightInsights = async (records: FlightRecord[], settings: AISettings) => {
  if (records.length === 0) return null;

  // 始终在调用前创建实例以确保使用最新的 API KEY 环境
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const defaultInstruction = "作为机长健康与生活方式顾问（使用“飞行”作为活动的航空术语代称），分析这些最近的飞行日志，并提供简短、专业且具有鼓励性的总结。请称呼用户为“机长”。";
  const systemInstruction = settings.customInstruction || defaultInstruction;

  const prompt = `
    机长，这是您最近的飞行数据。请根据这些记录生成一份情报简报。
    必须使用简体中文回答。
    
    日志数据: ${JSON.stringify(records.slice(-10))}
    
    以 JSON 格式提供输出，包含以下字段：
    - title: 一个酷炫的航空风格标题 (中文)
    - content: 简短的飞行状态分析 (中文)
    - suggestion: 一条关于生活平衡或健康的机长建议 (中文)
  `;

  try {
    const isPro = settings.model.includes('pro');
    
    const response = await ai.models.generateContent({
      model: settings.model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // 仅对支持思考的模型系列设置预算
        thinkingConfig: isPro ? { thinkingBudget: settings.thinkingBudget } : undefined,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["title", "content", "suggestion"]
        }
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Insight Error:", error);
    return null;
  }
};
