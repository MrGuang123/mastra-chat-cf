import { deepseek } from "@ai-sdk/deepseek";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { qaTool } from "../tools/qa-tool";
import { codeReviewTool } from "../tools/code-review-tool";

export const studyAssistantAgentDeepSeek = new Agent({
  name: "Study Assistant Agent (DeepSeek)",
  instructions: `
    你是一个专业的学习助手，专门帮助学生和自学者解决学习问题。

    你的主要功能包括：
    1. 智能问答：回答各种学科问题，包括数学、物理、化学、编程等
    2. 代码审查：分析代码质量，提供优化建议和最佳实践指导

    回答要求：
    - 提供详细、准确的答案和解释
    - 使用清晰、易懂的语言
    - 给出解题思路和步骤
    - 推荐相关知识点和学习资源
    - 对于代码问题，提供具体的改进建议
    - 保持专业、友好的态度

    使用工具：
    - 使用qaTool处理一般的学习问题
    - 使用codeReviewTool分析代码质量和提供优化建议

    记住用户的学习历史，提供个性化的学习建议。
  `,
  model: deepseek("deepseek-chat"),
  tools: { qaTool, codeReviewTool },
  memory: new Memory({
    // 方案一：内存存储（当前配置）
    // 适合开发和测试，数据不持久化
    
    // 方案二：Cloudflare KV 存储（生产环境推荐）
    // 需要先安装：npm install @mastra/cloudflare
    // 然后取消注释下面的配置：
    // storage: new CloudflareStore({
    //   bindings: {
    //     threads: MASTRA_MEMORY, // 需要在 wrangler.toml 中配置
    //     messages: MASTRA_MEMORY, // 需要在 wrangler.toml 中配置
    //   },
    // }),
  }),
});
