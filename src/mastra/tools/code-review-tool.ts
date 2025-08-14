import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const codeReviewTool = createTool({
  id: 'code-review',
  description: '代码审查工具，支持代码质量分析、优化建议、问题识别和最佳实践指导',
  inputSchema: z.object({
    code: z.string().describe('需要审查的代码'),
    language: z.string().optional().describe('编程语言（如：python, javascript, java, cpp等）'),
    context: z.string().optional().describe('代码上下文或功能描述'),
  }),
  outputSchema: z.object({
    overallScore: z.number().min(0).max(100).describe('代码质量总体评分'),
    issues: z.array(z.object({
      type: z.enum(['error', 'warning', 'suggestion']).describe('问题类型'),
      severity: z.enum(['high', 'medium', 'low']).describe('严重程度'),
      message: z.string().describe('问题描述'),
      line: z.number().optional().describe('问题所在行号'),
      suggestion: z.string().describe('改进建议'),
    })).describe('发现的问题列表'),
    improvements: z.array(z.string()).describe('优化建议'),
    bestPractices: z.array(z.string()).describe('最佳实践建议'),
    complexity: z.object({
      cyclomatic: z.number().describe('圈复杂度'),
      cognitive: z.number().describe('认知复杂度'),
      maintainability: z.string().describe('可维护性评级'),
    }).describe('代码复杂度分析'),
    performance: z.object({
      timeComplexity: z.string().describe('时间复杂度'),
      spaceComplexity: z.string().describe('空间复杂度'),
      optimization: z.array(z.string()).describe('性能优化建议'),
    }).describe('性能分析'),
  }),
  execute: async ({ context }) => {
    return await reviewCode(context.code, context.language, context.context);
  },
});

const reviewCode = async (
  code: string, 
  language?: string, 
  context?: string
) => {
  const detectedLanguage = language || detectLanguage(code);
  const codeAnalysis = analyzeCode(code, detectedLanguage);
  
  return {
    overallScore: calculateOverallScore(codeAnalysis),
    issues: identifyIssues(code, detectedLanguage),
    improvements: generateImprovements(code, detectedLanguage),
    bestPractices: getBestPractices(detectedLanguage),
    complexity: analyzeComplexity(code),
    performance: analyzePerformance(code, detectedLanguage),
  };
};

const detectLanguage = (code: string): string => {
  const lowerCode = code.toLowerCase();
  
  if (lowerCode.includes('def ') || lowerCode.includes('import ') || 
      lowerCode.includes('print(') || lowerCode.includes('if __name__')) {
    return 'python';
  }
  
  if (lowerCode.includes('function ') || lowerCode.includes('const ') || 
      lowerCode.includes('let ') || lowerCode.includes('var ') || 
      lowerCode.includes('console.log')) {
    return 'javascript';
  }
  
  if (lowerCode.includes('public class') || lowerCode.includes('public static void') || 
      lowerCode.includes('System.out.println')) {
    return 'java';
  }
  
  if (lowerCode.includes('#include') || lowerCode.includes('int main') || 
      lowerCode.includes('std::cout')) {
    return 'cpp';
  }
  
  return 'unknown';
};

const analyzeCode = (code: string, language: string) => {
  const lines = code.split('\n');
  const totalLines = lines.length;
  const commentLines = lines.filter(line => 
    line.trim().startsWith('//') || 
    line.trim().startsWith('#') || 
    line.trim().startsWith('/*') ||
    line.trim().startsWith('*')
  ).length;
  
  return {
    totalLines,
    commentLines,
    codeLines: totalLines - commentLines,
    commentRatio: commentLines / totalLines,
  };
};

const calculateOverallScore = (analysis: any): number => {
  let score = 100;
  
  // 根据代码行数调整分数
  if (analysis.totalLines > 100) score -= 10;
  if (analysis.totalLines > 500) score -= 20;
  
  // 根据注释比例调整分数
  if (analysis.commentRatio < 0.1) score -= 15;
  if (analysis.commentRatio > 0.3) score -= 5;
  
  return Math.max(0, Math.min(100, score));
};

const identifyIssues = (code: string, language: string) => {
  const issues = [];
  const lines = code.split('\n');
  
  // 检查常见问题
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    
    // 检查过长的行
    if (line.length > 120) {
      issues.push({
        type: 'warning' as const,
        severity: 'medium' as const,
        message: '行长度超过120个字符',
        line: lineNumber,
        suggestion: '考虑将长行拆分为多行以提高可读性',
      });
    }
    
    // 检查硬编码的魔法数字
    if (/\b\d{4,}\b/.test(line) && !line.includes('//')) {
      issues.push({
        type: 'suggestion' as const,
        severity: 'low' as const,
        message: '发现可能的魔法数字',
        line: lineNumber,
        suggestion: '考虑将数字定义为常量以提高代码可维护性',
      });
    }
    
    // 检查未使用的变量（简单检查）
    if (language === 'javascript' && line.includes('const ') && !line.includes('=')) {
      issues.push({
        type: 'warning' as const,
        severity: 'medium' as const,
        message: '可能的未使用变量',
        line: lineNumber,
        suggestion: '检查变量是否被使用，如果未使用请删除',
      });
    }
  }
  
  // 检查整体结构问题
  if (code.includes('TODO') || code.includes('FIXME')) {
    issues.push({
      type: 'warning' as const,
      severity: 'medium' as const,
      message: '发现TODO或FIXME标记',
      line: undefined,
      suggestion: '请及时处理TODO和FIXME标记',
    });
  }
  
  return issues;
};

const generateImprovements = (code: string, language: string): string[] => {
  const improvements = [];
  
  // 通用改进建议
  improvements.push('添加适当的注释说明代码功能');
  improvements.push('使用有意义的变量和函数名称');
  improvements.push('考虑添加错误处理机制');
  
  // 语言特定建议
  if (language === 'python') {
    improvements.push('遵循PEP 8代码风格规范');
    improvements.push('使用类型提示提高代码可读性');
  } else if (language === 'javascript') {
    improvements.push('使用ES6+语法特性');
    improvements.push('考虑使用TypeScript提高代码质量');
  }
  
  return improvements;
};

const getBestPractices = (language: string): string[] => {
  const practices: Record<string, string[]> = {
    'python': [
      '使用描述性的变量名',
      '遵循DRY原则（Don\'t Repeat Yourself）',
      '使用列表推导式简化代码',
      '适当使用异常处理',
      '编写单元测试'
    ],
    'javascript': [
      '使用const和let替代var',
      '使用箭头函数简化代码',
      '使用解构赋值',
      '使用模板字符串',
      '避免全局变量污染'
    ],
    'java': [
      '遵循Java命名约定',
      '使用访问修饰符控制可见性',
      '实现适当的异常处理',
      '使用接口和抽象类',
      '编写Javadoc注释'
    ],
    'cpp': [
      '使用智能指针管理内存',
      '遵循RAII原则',
      '使用const修饰符',
      '避免裸指针',
      '使用STL容器和算法'
    ],
    'unknown': [
      '保持代码简洁清晰',
      '添加适当的注释',
      '遵循语言特定的编码规范',
      '进行代码审查',
      '编写测试用例'
    ]
  };
  
  return practices[language] || practices['unknown'];
};

const analyzeComplexity = (code: string) => {
  const lines = code.split('\n');
  let cyclomaticComplexity = 1; // 基础复杂度
  
  // 简单的圈复杂度计算
  for (const line of lines) {
    if (line.includes('if ') || line.includes('else if ') || 
        line.includes('for ') || line.includes('while ') || 
        line.includes('case ') || line.includes('catch ')) {
      cyclomaticComplexity++;
    }
  }
  
  const cognitiveComplexity = Math.floor(cyclomaticComplexity * 0.8);
  
  let maintainability = 'good';
  if (cyclomaticComplexity > 10) maintainability = 'poor';
  else if (cyclomaticComplexity > 5) maintainability = 'fair';
  
  return {
    cyclomatic: cyclomaticComplexity,
    cognitive: cognitiveComplexity,
    maintainability,
  };
};

const analyzePerformance = (code: string, language: string) => {
  const performanceTips = [];
  
  // 简单的性能分析
  if (code.includes('for ') && code.includes('for ')) {
    performanceTips.push('避免嵌套循环，考虑使用更高效的算法');
  }
  
  if (code.includes('document.getElementById') && code.includes('document.getElementById')) {
    performanceTips.push('缓存DOM查询结果以提高性能');
  }
  
  if (code.includes('SELECT *')) {
    performanceTips.push('避免使用SELECT *，只查询需要的字段');
  }
  
  return {
    timeComplexity: 'O(n)', // 简化处理
    spaceComplexity: 'O(1)', // 简化处理
    optimization: performanceTips.length > 0 ? performanceTips : ['代码性能表现良好'],
  };
};
