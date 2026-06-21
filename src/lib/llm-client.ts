/**
 * llm-client.ts · 模拟 OpenAI 兼容的 LLM 流式 API
 *
 * 借皮要点：
 * - SSE (Server-Sent Events) 风格：data: {...}\n\n 流式输出
 * - 真实 OpenAI ChatCompletionChunk 格式：{ choices: [{ delta: { content: '...' } }] }
 * - 支持 abort signal（fetch 的标准 signal）
 * - 模拟网络延迟 + 字符级流式（20-40ms per chunk）
 *
 * 用法：
 *   const stream = createLLMStream({ messages, signal, model })
 *   const reader = stream.getReader()
 *   while (...) { const { value, done } = await reader.read() ... }
 *
 * 实际接入真实 LLM 时只需替换 createLLMStream 内部实现。
 */

export type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LLMChunk = {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: { role?: "assistant"; content?: string };
    finish_reason: "stop" | "length" | null;
  }>;
};

export type LLMRequest = {
  messages: LLMMessage[];
  model?: string;
  signal?: AbortSignal;
  /** 每个 chunk 间隔 (ms)，默认 30 */
  chunkDelayMs?: number;
  /** 每个 chunk 包含的字符数，默认 3 */
  chunkSize?: number;
};

/**
 * 创建一个 LLM 流，模仿 fetch + ReadableStream 的形态
 * 实际生产环境替换为：fetch('/v1/chat/completions', { ... }).then(r => r.body)
 */
export function createLLMStream(req: LLMRequest): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const model = req.model ?? "mock-gpt-4o";
  const delay = req.chunkDelayMs ?? 30;
  const size = req.chunkSize ?? 3;

  // 根据最后一条 user 消息匹配 mock 回复
  const lastUser = [...req.messages].reverse().find((m) => m.role === "user");
  const reply = pickReply(lastUser?.content ?? "");

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const chunkId = `chatcmpl-${Math.random().toString(36).slice(2, 12)}`;
      const created = Math.floor(Date.now() / 1000);

      // 1. 第一个 chunk：role 标识
      const first: LLMChunk = {
        id: chunkId,
        object: "chat.completion.chunk",
        created,
        model,
        choices: [{ index: 0, delta: { role: "assistant" }, finish_reason: null }],
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(first)}\n\n`));

      let i = 0;
      let aborted = false;

      // 监听 abort
      const onAbort = () => {
        aborted = true;
        clearInterval(timer);
        try {
          controller.close();
        } catch {
          /* 已关闭 */
        }
      };
      req.signal?.addEventListener("abort", onAbort, { once: true });

      // 2. 内容 chunk：按 size 切片
      const timer = setInterval(() => {
        if (aborted) return;
        if (i >= reply.length) {
          // 结束 chunk
          const end: LLMChunk = {
            id: chunkId,
            object: "chat.completion.chunk",
            created,
            model,
            choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(end)}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          clearInterval(timer);
          controller.close();
          return;
        }
        const delta = reply.slice(i, i + size);
        i += size;
        const chunk: LLMChunk = {
          id: chunkId,
          object: "chat.completion.chunk",
          created,
          model,
          choices: [{ index: 0, delta: { content: delta }, finish_reason: null }],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      }, delay);
    },
  });
}

/**
 * 简易 mock 回复库：根据用户输入关键词匹配回复模板
 * 实际生产环境替换为后端 LLM 调用
 */
function pickReply(input: string): string {
  const lower = input.toLowerCase();
  if (/(你好|hi|hello|嗨)/.test(lower)) {
    return "你好！我是 Workbench AI，一个面向高校场景的多智能体助手。\n\n我可以帮你：\n- 📚 学业辅导（知识图谱、解题思路）\n- 💚 心理支持（情绪疏导、压力管理）\n- 📋 教务咨询（请假、选课、奖学金）\n- ✨ 通用问答（写作、翻译、规划）\n\n请告诉我你想聊什么？";
  }
  if (/(数据|学习|课程|知识|考试|作业|论文|编程|代码|数学|英语|物理|化学|生物|历史|政治|语文)/.test(lower)) {
    return `关于"${input.trim()}"，我从三个维度帮你拆解：\n\n## 1. 知识框架\n梳理相关概念的层级关系和依赖图谱，建立完整的认知地图。\n\n## 2. 方法路径\n- **基础阶段**：理解定义、定理、典型例题\n- **进阶阶段**：归纳题型、提炼套路、刻意练习\n- **融会贯通**：跨章节联想、跨学科迁移\n\n## 3. 行动建议\n1. 每天 30 分钟专项训练\n2. 错题本：归类、重做、总结\n3. 每周一次综合复盘\n\n> 想要更具体的指导，请告诉我你的学习目标和当前水平。`;
  }
  if (/(心情|情绪|压力|焦虑|抑郁|难过|失眠|睡不着|想死|自杀|自残|活不下去|心理)/.test(lower)) {
    return `我听到你最近不太舒服，这很正常，先深呼吸一下。\n\n## 短期应对\n- 🧘 4-7-8 呼吸法：吸气 4 秒、屏息 7 秒、呼气 8 秒\n- 📝 把烦恼写下来，外化情绪\n- 🚶 出门走走 10 分钟\n\n## 中期调整\n- 保持规律作息，固定起床时间\n- 减少咖啡因摄入，尤其是下午\n- 每天给自己 30 分钟"无目的"时间\n\n## 重要提醒\n如果你持续两周以上情绪低落，或有自伤想法，请**立即联系学校心理咨询中心**：\n- 📞 校内热线：1234-5678\n- 🏥 24 小时危机干预：400-161-9995\n\n你愿意先聊聊具体是什么事情让你不舒服吗？`;
  }
  if (/(请假|选课|退课|成绩|奖学金|学籍|转专业|考试|缓考|补考|休学|复学|教务)/.test(lower)) {
    return `关于"${input.trim()}"，根据学校最新规定：\n\n## 办理流程\n1. **登录教务系统**：http://jw.example.edu\n2. **在线申请**：填写申请表 + 上传证明材料\n3. **辅导员审核**：1-2 个工作日\n4. **院系审批**：2-3 个工作日\n5. **教务处备案**：完成后系统自动通知\n\n## 常见注意事项\n- 请假超过 3 天需附医院证明\n- 考试期间请假需办理缓考手续\n- 奖学金评审需提前 30 天提交材料\n\n> 如需加急处理，请联系辅导员或院系教务老师。`;
  }
  if (/(代码|编程|python|javascript|js|ts|react|vue|api|bug|报错|异常|sql|git|docker)/.test(lower)) {
    return `这是个很棒的技术问题！\n\n## 排查思路\n1. **复现问题**：最小化复现代码 + 准确报错信息\n2. **看错误栈**：定位到具体文件和行号\n3. **查文档/源码**：理解相关 API 的预期行为\n4. **打印调试**：在关键位置添加日志\n5. **二分定位**：逐步缩小问题范围\n\n## 推荐工具\n- **调试**：浏览器 DevTools / VS Code Debugger\n- **网络**：Charles / Wireshark\n- **性能**：Lighthouse / Chrome Performance\n\n\`\`\`bash\n# 常用排查命令\ngit log --oneline -20     # 查看最近改动\nnpm run dev --verbose     # 详细启动日志\n\`\`\`\n\n> 把你的代码和报错贴出来，我可以帮你具体分析。`;
  }
  // 默认通用回复
  return `收到你的问题："${input.trim()}"\n\n我来梳理一下要点：\n\n## 关键信息\n- 这是一个需要进一步澄清的问题\n- 建议先明确具体场景和目标\n- 拆解为可执行的小步骤\n\n## 我的建议\n1. 补充更多上下文，让问题更具体\n2. 列出你已经尝试过的方法\n3. 明确期望的结果\n\n你愿意从哪个方向继续？`;
}

/**
 * 解析 SSE 流（data: {...}\\n\\n 格式）
 * 借皮：与 OpenAI / Anthropic / vLLM / Ollama 的流式响应一致
 */
export async function* parseSSEStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<LLMChunk> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // 按 \\n\\n 切分
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const evt of events) {
        const line = evt.trim();
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          yield JSON.parse(data) as LLMChunk;
        } catch {
          /* 跳过解析失败的 chunk */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
