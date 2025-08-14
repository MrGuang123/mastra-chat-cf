import {
  createWorkflow,
  createStep,
} from "@mastra/core/workflows";
import { z } from "zod";
import { studyAssistantAgentDeepSeek } from "../agents/study-assistant-agent-deepseek";

// 创建学习助手工作流
export const studyAssistantWorkflow = createWorkflow({
  id: "study-assistant-workflow",
  description: "处理学习问题和代码审查的智能工作流",
  inputSchema: z.object({
    userInput: z.string().describe("用户输入的问题或代码"),
    requestType: z
      .enum(["question", "code_review"])
      .optional()
      .describe("请求类型：问题或代码审查"),
  }),
  outputSchema: z.object({
    response: z.string().describe("AI助手的回答"),
    analysis: z
      .object({
        type: z.string().describe("分析类型"),
        score: z
          .number()
          .optional()
          .describe("评分（代码审查时）"),
        suggestions: z
          .array(z.string())
          .optional()
          .describe("建议列表"),
      })
      .optional()
      .describe("分析结果"),
    relatedTopics: z
      .array(z.string())
      .describe("相关知识点"),
    confidence: z.number().describe("答案置信度"),
  }),
})
  .then(
    createStep({
      id: "process-request",
      description: "处理用户请求",
      inputSchema: z.object({
        userInput: z.string(),
        requestType: z
          .enum(["question", "code_review"])
          .optional(),
      }),
      outputSchema: z.object({
        response: z.string(),
        analysis: z.any().optional(),
        relatedTopics: z.array(z.string()),
        confidence: z.number(),
      }),
      execute: async ({ inputData, mastra }) => {
        const { userInput, requestType } = inputData;

        // 自动检测请求类型
        let detectedType = requestType;
        if (!detectedType) {
          const lowerInput = userInput.toLowerCase();
          if (
            lowerInput.includes("function ") ||
            lowerInput.includes("def ") ||
            lowerInput.includes("class ") ||
            lowerInput.includes("const ") ||
            lowerInput.includes("public ") ||
            lowerInput.includes("#include")
          ) {
            detectedType = "code_review";
          } else {
            detectedType = "question";
          }
        }

        // 构建发送给Agent的消息
        let message = userInput;
        if (detectedType === "code_review") {
          message = `请审查以下代码并提供改进建议：\n\n${userInput}`;
        }

        // 调用学习助手Agent
        const agentResponse =
          await studyAssistantAgentDeepSeek.generate(
            message
          );

        // 解析Agent响应
        const response = agentResponse.text;
        const relatedTopics = extractKeywords(userInput);
        const confidence = 0.9;

        // 如果是代码审查，添加分析结果
        let analysis = undefined;
        if (detectedType === "code_review") {
          analysis = {
            type: "code_review",
            score: 85,
            suggestions: [
              "添加注释",
              "优化变量命名",
              "考虑使用更高效的数据结构",
            ],
          };
        }

        return {
          response,
          analysis,
          relatedTopics,
          confidence,
        };
      },
    })
  )
  .commit();

// 辅助函数
const extractKeywords = (input: string): string[] => {
  const keywords = [];
  const lowerInput = input.toLowerCase();

  // 提取学科关键词
  const subjects = [
    "数学",
    "物理",
    "化学",
    "编程",
    "算法",
    "数据结构",
  ];
  for (const subject of subjects) {
    if (lowerInput.includes(subject)) {
      keywords.push(subject);
    }
  }

  // 提取编程语言关键词
  const languages = [
    "python",
    "javascript",
    "java",
    "cpp",
    "c++",
    "typescript",
  ];
  for (const language of languages) {
    if (lowerInput.includes(language)) {
      keywords.push(language);
    }
  }

  return keywords;
};
