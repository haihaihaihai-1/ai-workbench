import type { AgentDomain } from "@/lib/types";

export const AGENTS: Record<
  AgentDomain,
  { name: string; description: string; emoji: string; color: string }
> = {
  academic: {
    name: "学业助手",
    description: "课程辅导、学习方法、学术规划",
    emoji: "📚",
    color: "text-blue-400 bg-blue-500/10",
  },
  emotional: {
    name: "心理助手",
    description: "情绪疏导、压力管理、心理支持",
    emoji: "💚",
    color: "text-emerald-400 bg-emerald-500/10",
  },
  affairs: {
    name: "教务助手",
    description: "请假、选课、学籍、奖学金",
    emoji: "📋",
    color: "text-amber-400 bg-amber-500/10",
  },
  general: {
    name: "通用助手",
    description: "友好、全面的校园 AI 助手",
    emoji: "✨",
    color: "text-violet-400 bg-violet-500/10",
  },
};

export const MODELS = [
  { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", provider: "Anthropic", context: "200K" },
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI", context: "128K" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", context: "1M" },
  { id: "minimax-m3", name: "MiniMax M3", provider: "MiniMax", context: "256K" },
] as const;

export type ModelId = (typeof MODELS)[number]["id"];

// 模拟流式输出片段
const SAMPLE_RESPONSES: Record<
  AgentDomain,
  {
    content: string;
    sources: { title: string; url: string; snippet: string; domain: string }[];
    tools: {
      name: string;
      status: "running" | "success" | "error";
      input?: string;
      output?: string;
      durationMs?: number;
    }[];
  }
> = {
  academic: {
    content: `针对你的问题，我从**课程知识图谱**和**历年考试数据**出发，建议按以下步骤推进：

## 1. 知识体系梳理
- 核心概念：定义、性质、典型应用
- 关键定理：证明思路 + 适用条件
- 易错点：常见反例与边界情况

## 2. 解题方法论
按 **题型 → 方法 → 套路** 三层组织：
1. 选择题：排除法 + 特殊值验证
2. 解答题：分步拆解 + 关键步骤标注
3. 证明题：逆推法 + 构造反例

## 3. 练习与反馈
- 每日 30 分钟专项训练
- 错题本：归类 + 重做 + 总结
- 每周模拟一次，检测薄弱点

> 推荐资料：教材第 3-5 章 + 配套习题集，建议先做 A 组基础题，再挑战 B 组提高题。`,
    sources: [
      {
        title: "课程知识图谱 v3.2",
        url: "/kb/graph/2024-cs101",
        snippet: "包含 12 章核心知识点的依赖关系",
        domain: "kb.internal",
      },
      {
        title: "历年考试数据 (2018-2024)",
        url: "/kb/exam-stats",
        snippet: "高频考点 TOP 20",
        domain: "kb.internal",
      },
    ],
    tools: [
      {
        name: "knowledge_search",
        status: "success",
        input: "{ query: '拓扑学', limit: 5 }",
        output: "返回 5 条结果，匹配度最高 0.92",
        durationMs: 234,
      },
      {
        name: "exam_stats",
        status: "success",
        input: "{ course: 'CS101', years: 6 }",
        output: "高频考点: 极限计算 38% / 连续性 24% / 多元函数 21%",
        durationMs: 156,
      },
    ],
  },
  emotional: {
    content: `听起来你最近承受了不小的压力。**先深呼吸一下**，我们一起看看怎么把这种状态调整回来。

## 我感受到的
- 你提到"睡不好 + 焦虑 + 提不起劲"，这 3 个信号同时出现，确实很消耗
- 持续 2 周以上就需要认真对待了

## 一些具体建议
1. **睡眠优先**：今晚开始固定 23:30 关灯，睡前 1 小时不刷手机
2. **微运动**：每天 15 分钟散步，让身体先动起来
3. **情绪命名**：当感到焦虑时，试着写下"我现在感到 ___，因为 ___"
4. **寻求支持**：跟信任的朋友聊聊，或者预约学校心理咨询中心

> 如果你**有更严重的想法或感觉控制不住**，请**立即**联系：
> - 学校心理中心：010-xxxx-xxxx（24h）
> - 全国心理援助热线：400-161-9995

我在这里，可以继续聊。`,
    sources: [
      {
        title: "校园心理资源清单",
        url: "/kb/psych-resources",
        snippet: "咨询师、热线、自助资源",
        domain: "kb.internal",
      },
    ],
    tools: [
      {
        name: "emotion_detect",
        status: "success",
        input: "{ text: '...' }",
        output: "检测到: 焦虑 ↑ / 兴趣 ↓ / 睡眠问题 ↑",
        durationMs: 89,
      },
    ],
  },
  affairs: {
    content: `关于**请假流程**，按照《学生手册 2024 版》第 5 章规定：

## 请假类型与审批
| 类别 | 时长 | 审批人 | 材料 |
|------|------|--------|------|
| 事假 | ≤3 天 | 辅导员 | 申请表 + 证明 |
| 病假 | ≤7 天 | 辅导员 + 校医 | 医院诊断 |
| 紧急 | 立即 | 电话报备 + 事后补办 | 情况说明 |

## 操作步骤
1. 登录教务系统 → **学生事务 → 请假申请**
2. 填写表单（注意：日期格式 YYYY-MM-DD）
3. 上传证明材料（PDF / 图片，≤ 5MB）
4. 提交后等待审批（一般 1-2 个工作日）
5. 审批通过后系统自动通知任课教师

## 注意事项
- ⚠️ 考试期间请假需额外附**缓考申请**
- ⚠️ 累计请假 ≥ 1/3 课时可能影响期末成绩
- 💡 紧急情况可先电话辅导员，事后再补办系统流程

> 系统链接：oa.example.edu/leave`,
    sources: [
      {
        title: "学生手册 2024 版 第 5 章",
        url: "/kb/handbook-2024",
        snippet: "请假与考勤管理办法",
        domain: "kb.internal",
      },
    ],
    tools: [
      {
        name: "policy_lookup",
        status: "success",
        input: "{ keyword: '请假' }",
        output: "命中 3 条相关政策条款",
        durationMs: 112,
      },
    ],
  },
  general: {
    content: `我理解你的问题了。让我从**通用角度**给你一些思路。

## 拆解一下
先把大问题拆成几个可操作的小问题：
1. **明确目标**：你最终想达成什么？
2. **识别约束**：时间、资源、关键障碍是什么？
3. **评估选项**：列出 2-3 种可行方案
4. **选择 + 行动**：选一个，立刻开始（哪怕是 5 分钟）

## 我可以帮你
- 📋 梳理思路 → 用结构化提问
- 🔍 查资料 → 知识库 + 工具调用
- 🗓 制定计划 → 拆解为可执行步骤
- 💬 陪你推演 → 苏格拉底式对话

> 你愿意先从哪个方向开始？`,
    sources: [],
    tools: [],
  },
};

// 流式打字机：把 content 按字符切片成多个 chunk
// 借皮：使用 src/lib/llm-client 的 SSE 风格流式，模拟 OpenAI ChatCompletion API
export function createMockStream(
  domain: AgentDomain,
  onChunk: (delta: string, done: boolean) => void,
  signal?: AbortSignal,
) {
  const text = SAMPLE_RESPONSES[domain].content;
  // 字符级分块（每 2-3 个字符一个 chunk），模拟真实 LLM 的 token 流
  const chunkSize = 2;
  const delay = 24;
  let i = 0;
  let aborted = false;

  const onAbort = () => {
    aborted = true;
    clearInterval(timer);
  };
  signal?.addEventListener("abort", onAbort, { once: true });

  const timer = setInterval(() => {
    if (aborted) {
      clearInterval(timer);
      return;
    }
    if (i >= text.length) {
      clearInterval(timer);
      onChunk("", true);
      return;
    }
    onChunk(text.slice(i, i + chunkSize), false);
    i += chunkSize;
  }, delay);
  return () => {
    aborted = true;
    clearInterval(timer);
  };
}

export function getMockResponse(domain: AgentDomain) {
  return SAMPLE_RESPONSES[domain];
}

// 推荐问题（首页未开始对话时显示）
export const SUGGESTED_PROMPTS = [
  { icon: "📚", text: "帮我梳理《数据结构》的核心知识图谱", domain: "academic" as AgentDomain },
  { icon: "💚", text: "最近压力大，怎么调整睡眠？", domain: "emotional" as AgentDomain },
  { icon: "📋", text: "请假超过 3 天的流程是什么？", domain: "affairs" as AgentDomain },
  { icon: "✨", text: "帮我想想周末怎么安排比较充实", domain: "general" as AgentDomain },
];
