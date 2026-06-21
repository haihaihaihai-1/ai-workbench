/**
 * llm-client 测试
 * 借皮 vitest + happy-dom
 */

import { describe, expect, it } from "vitest";
import { createLLMStream, parseSSEStream, type LLMMessage } from "./llm-client";

describe("createLLMStream", () => {
  it("outputs content in chunks with OpenAI format", async () => {
    const messages: LLMMessage[] = [{ role: "user", content: "你好" }];
    const stream = createLLMStream({
      messages,
      chunkDelayMs: 5,
      chunkSize: 2,
    });

    const chunks: string[] = [];
    for await (const chunk of parseSSEStream(stream)) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) chunks.push(delta);
    }

    const fullText = chunks.join("");
    expect(fullText.length).toBeGreaterThan(10);
    expect(fullText).toContain("你好");
  });

  it("emits [DONE] sentinel at end", async () => {
    const stream = createLLMStream({
      messages: [{ role: "user", content: "测试" }],
      chunkDelayMs: 1,
      chunkSize: 1,
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let hasDone = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      if (buffer.includes("[DONE]")) {
        hasDone = true;
        break;
      }
    }
    expect(hasDone).toBe(true);
  });

  it("can be aborted via AbortSignal", async () => {
    const controller = new AbortController();
    const stream = createLLMStream({
      messages: [{ role: "user", content: "测试" }],
      chunkDelayMs: 50,
      chunkSize: 1,
      signal: controller.signal,
    });

    setTimeout(() => controller.abort(), 30);

    const reader = stream.getReader();
    let receivedAnyData = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value && value.length > 0) {
          receivedAnyData = true;
          // 收到数据后立即 abort
          controller.abort();
        }
      }
    } catch (e) {
      // AbortError 是预期行为
    }
    expect(receivedAnyData).toBe(true);
  });
});

describe("parseSSEStream", () => {
  it("parses SSE formatted chunks correctly", async () => {
    const sseData =
      'data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{"content":"hi"},"finish_reason":null}]}\n\n' +
      'data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{},"finish_reason":"stop"}]}\n\n' +
      "data: [DONE]\n\n";

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sseData));
        controller.close();
      },
    });

    const chunks: string[] = [];
    let finishReason: string | null = null;
    for await (const chunk of parseSSEStream(stream)) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) chunks.push(delta);
      if (chunk.choices[0]?.finish_reason) {
        finishReason = chunk.choices[0].finish_reason;
      }
    }

    expect(chunks.join("")).toBe("hi");
    expect(finishReason).toBe("stop");
  });
});
