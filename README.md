# 学习助手Agent - Mastra项目

## 📚 项目简介

这是一个基于Mastra框架开发的智能学习助手Agent，专注于提供智能问答和代码审查功能。项目旨在帮助学生和自学者更好地解决学习问题，提升编程技能。

**使用DeepSeek模型**，提供强大的AI学习助手功能。

## ✨ 核心功能

### 1. 智能问答 (Smart QA)

- **多学科支持**: 数学、物理、化学、编程等
- **详细解答**: 提供完整的答案和解题思路
- **知识点关联**: 自动识别相关知识点
- **难度评估**: 智能评估问题难度等级

### 2. 代码审查 (Code Review)

- **多语言支持**: Python、JavaScript、Java、C++等
- **质量分析**: 代码质量评分和问题识别
- **优化建议**: 具体的改进建议和最佳实践
- **复杂度分析**: 圈复杂度和认知复杂度评估
- **性能分析**: 时间复杂度和空间复杂度分析

## 🏗️ 项目结构

```
mastra-chat-cf/
├── src/mastra/
│   ├── agents/
│   │   └── study-assistant-agent-deepseek.ts     # 学习助手Agent (DeepSeek)
│   ├── tools/
│   │   ├── qa-tool.ts                            # 智能问答工具
│   │   └── code-review-tool.ts                   # 代码审查工具
│   ├── workflows/
│   │   └── study-assistant-workflow.ts           # 学习助手工作流
│   └── index.ts                                  # 主入口文件
├── package.json
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API密钥

```bash
# 在 .env 文件中设置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 构建项目

```bash
npm run build
```

## 🔧 模型配置

项目使用DeepSeek的deepseek-chat模型，配置在 `src/mastra/agents/study-assistant-agent-deepseek.ts` 中。

## 📖 使用示例

### 智能问答

```typescript
const result =
  await mastra.workflows.studyAssistantWorkflow.run({
    userInput: "什么是递归函数？",
    requestType: "question",
    subject: "编程",
  });
```

### 代码审查

```typescript
const result =
  await mastra.workflows.studyAssistantWorkflow.run({
    userInput: `
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  return sum;
}
    `,
    requestType: "code_review",
    language: "javascript",
  });
```

## 🔧 技术栈

- **框架**: Mastra
- **AI模型**: DeepSeek Chat
- **存储**: LibSQL
- **语言**: TypeScript
- **工具**: Zod (数据验证)

## 📊 功能特性

### 智能问答工具 (qa-tool)

- ✅ 多学科问题解答
- ✅ 自动学科识别
- ✅ 难度等级评估
- ✅ 相关知识点提取
- ✅ 置信度计算

### 代码审查工具 (code-review-tool)

- ✅ 多语言代码分析
- ✅ 代码质量评分
- ✅ 问题识别和建议
- ✅ 复杂度分析
- ✅ 性能优化建议
- ✅ 最佳实践指导

### 学习助手Agent

- ✅ 智能请求类型识别
- ✅ 个性化学习建议
- ✅ 学习历史记忆
- ✅ 上下文理解

## 🎯 开发计划

### 第一阶段 (已完成)

- [x] 基础智能问答功能
- [x] 代码审查功能
- [x] 工作流集成
- [x] 基础测试
- [x] DeepSeek模型支持

### 第二阶段 (计划中)

- [ ] 集成更强大的AI模型
- [ ] 添加更多编程语言支持
- [ ] 实现代码执行环境
- [ ] 添加学习进度跟踪

### 第三阶段 (计划中)

- [ ] 用户界面开发
- [ ] 学习数据分析
- [ ] 个性化推荐系统
- [ ] 社区功能

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

ISC License

## 📞 联系方式

如有问题或建议，请通过GitHub Issues联系我们。
