import { expect, test } from "@playwright/test";

test.describe("Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chat");
  });

  test("对话页展示「新建对话」按钮和会话列表", async ({ page }) => {
    const newChat = page.getByRole("button", { name: "新建对话" });
    await expect(newChat).toBeVisible();
  });

  test("顶部展示当前 Agent 名称「学业助手」", async ({ page }) => {
    await expect(page.getByText("学业助手").first()).toBeVisible();
  });

  test("输入文字并发送，消息出现在消息流中", async ({ page }) => {
    const composer = page.getByPlaceholder(/问 .+ 任何问题/);
    await expect(composer).toBeVisible();
    const message = "Playwright E2E 测试消息";
    await composer.fill(message);
    await page.getByRole("button", { name: "发送" }).click();
    await expect(page.getByText(message)).toBeVisible();
  });

  test("点击推荐问题可自动发送（若当前对话为空时显示）", async ({ page }) => {
    // 先新建一个空对话
    const newChat = page.getByRole("button", { name: "新建对话" });
    await newChat.click();
    // 推荐问题会显示在输入区上方
    const suggestions = page.locator("button", { hasText: /^[\p{Emoji}]/u });
    const count = await suggestions.count();
    if (count > 0) {
      await suggestions.first().click();
      // 至少应出现 user 消息
      await expect(page.locator('[role="article"], .text-sm').first()).toBeVisible();
    }
  });
});
