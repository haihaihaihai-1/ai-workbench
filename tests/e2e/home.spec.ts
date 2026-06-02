import { expect, test } from "@playwright/test";

test.describe("Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("首页展示「AI 协作工作台」欢迎语", async ({ page }) => {
    const banner = page.getByText("AI 协作工作台");
    await expect(banner).toBeVisible();
  });

  test("首页展示 4 个核心指标", async ({ page }) => {
    for (const label of ["今日对话", "总会话", "平均响应", "飞轮健康度"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("首页展示 6 个快捷入口", async ({ page }) => {
    for (const label of ["对话", "记忆", "工单", "监控", "飞轮", "评估"]) {
      const button = page.getByRole("button", { name: new RegExp(label) });
      await expect(button.first()).toBeVisible();
    }
  });

  test("点击「对话」快捷入口跳转到 /chat", async ({ page }) => {
    const chatButton = page.getByRole("button", { name: /对话/ }).first();
    await chatButton.click();
    await expect(page).toHaveURL(/\/chat$/);
  });
});
