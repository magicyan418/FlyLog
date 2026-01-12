import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { FlightRecord, AISettings } from "../types";

/**
 * 测试 AI 模型连接
 */
export const testAIConnection = async (
  settings: AISettings
): Promise<{ success: boolean; message: string }> => {
  if (!settings.apiKey) {
    return { success: false, message: "请先配置 API Key" };
  }

  try {
    let llm;

    switch (settings.provider) {
      case "openai":
        llm = new ChatOpenAI({
          apiKey: settings.apiKey,
          model: settings.model || "gpt-4o-mini",
          configuration: settings.baseURL
            ? { baseURL: settings.baseURL }
            : undefined,
        });
        break;

      case "anthropic":
        llm = new ChatAnthropic({
          apiKey: settings.apiKey,
          model: settings.model || "claude-3-5-sonnet-20241022",
          clientOptions: settings.baseURL
            ? { baseURL: settings.baseURL }
            : undefined,
        });
        break;

      case "google":
        llm = new ChatGoogleGenerativeAI({
          apiKey: settings.apiKey,
          model: settings.model || "gemini-2.0-flash-exp",
        });
        break;

      case "custom":
        if (!settings.baseURL) {
          return { success: false, message: "自定义厂商需要提供 Base URL" };
        }
        llm = new ChatOpenAI({
          apiKey: settings.apiKey,
          model: settings.model || "gpt-4o-mini",
          configuration: { baseURL: settings.baseURL },
        });
        break;

      default:
        return { success: false, message: "不支持的 AI 厂商" };
    }

    // 发送简单的测试消息
    const response = await llm.invoke([
      {
        role: "user",
        content: "你好，请回复'连接成功'",
      },
    ]);

    if (response && response.content) {
      return { success: true, message: `连接成功！模型: ${settings.model}` };
    } else {
      return { success: false, message: "模型响应异常" };
    }
  } catch (error: any) {
    console.error("AI Connection Test Error:", error);
    return {
      success: false,
      message: `连接失败: ${error.message || "未知错误"}`,
    };
  }
};

export const getFlightInsights = async (
  records: FlightRecord[],
  settings: AISettings
) => {
  if (records.length === 0) return null;

  // 验证必要配置
  if (!settings.apiKey) {
    console.error("API Key 未配置");
    return null;
  }

  const defaultInstruction = `你是一位经验丰富的飞行健康顾问。在这个应用中，"飞行"是对男性自慰活动的航空术语隐喻：
- "飞行" = 自慰行为
- "航程时长" = 自慰持续时间
- "天气状况" = 心情/感受状态
- "引擎推力" = 强度等级
- "起飞" = 开始
- "着陆" = 结束

你的任务是以专业、不评判的态度，用航空术语分析用户的飞行日志，提供健康建议。保持幽默但不色情的语气，像一个关心驾驶员身心健康的塔台管制员。称呼用户为"机长"。`;

  // 使用自定义指令或默认指令
  const systemInstruction = settings.customInstruction?.trim()
    ? settings.customInstruction
    : defaultInstruction;

  const prompt = `机长，塔台收到您最近的飞行数据。请根据这些航班记录生成一份专业的飞行情报简报。
必须使用简体中文回答。

最近10次航班数据: ${JSON.stringify(
    records.slice(-10).map((r) => ({
      时间: new Date(r.timestamp).toLocaleString("zh-CN"),
      航程: r.duration + "分钟",
      天气: r.mood,
      推力: r.intensity,
      备注: r.notes || "无",
    }))
  )}

分析要点：
1. 注意飞行频率是否合理（过于频繁或过少都需要提醒）
2. 观察航程时长的变化趋势
3. 关注天气状况（心情）的波动
4. 评估引擎推力（强度）是否稳定
5. 提供健康、平衡的生活建议

请严格按照以下 JSON 格式输出，不要添加任何额外文字：
{
  "title": "航空风格的情报标题（中文，15字以内）",
  "content": "简短的飞行状态分析，使用航空术语（中文，80字以内）",
  "suggestion": "一条具体的健康建议（中文，50字以内）"
}`;

  try {
    let llm;

    // 根据 provider 创建对应的 LLM 实例
    switch (settings.provider) {
      case "openai":
        llm = new ChatOpenAI({
          apiKey: settings.apiKey,
          model: settings.model || "gpt-4o-mini",
          configuration: settings.baseURL
            ? {
                baseURL: settings.baseURL,
              }
            : undefined,
        });
        break;

      case "anthropic":
        llm = new ChatAnthropic({
          apiKey: settings.apiKey,
          model: settings.model || "claude-3-5-sonnet-20241022",
          clientOptions: settings.baseURL
            ? {
                baseURL: settings.baseURL,
              }
            : undefined,
        });
        break;

      case "google":
        llm = new ChatGoogleGenerativeAI({
          apiKey: settings.apiKey,
          model: settings.model || "gemini-2.0-flash-exp",
        });
        break;

      case "custom":
        if (!settings.baseURL) {
          console.error("自定义厂商需要提供 baseURL");
          return null;
        }
        // 使用 OpenAI 兼容接口
        llm = new ChatOpenAI({
          apiKey: settings.apiKey,
          model: settings.model || "gpt-4o-mini",
          configuration: {
            baseURL: settings.baseURL,
          },
        });
        break;

      default:
        console.error("不支持的 AI 厂商:", settings.provider);
        return null;
    }

    // 调用 LLM
    // const response = await llm.invoke([
    //   {
    //     role: "system",
    //     content: systemInstruction,
    //   },
    //   {
    //     role: "user",
    //     content: prompt,
    //   },
    // ]);
    const response = await llm.invoke([
      new SystemMessage(systemInstruction),
      new HumanMessage(prompt),
    ]);

    // 解析响应
    const content = response.content as string;

    // 尝试提取 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || "飞行情报",
        content: parsed.content || "数据分析中...",
        suggestion: parsed.suggestion || "保持飞行状态",
      };
    }

    // 如果没有找到 JSON，尝试智能解析
    const lines = content.split("\n").filter((line) => line.trim());
    return {
      title: lines[0] || "飞行情报",
      content: lines.slice(1, -1).join(" ") || "数据分析中...",
      suggestion: lines[lines.length - 1] || "保持飞行状态",
    };
  } catch (error) {
    console.error("AI Insight Error:", error);
    return null;
  }
};
