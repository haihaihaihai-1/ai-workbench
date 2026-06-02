import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("侧边栏展示 AI Workbench 品牌", async ({ page }) => {
    await page.goto("/");
    const brand = page.getByText("AI Workbench", { exact: true });
    await expect(brand).toBeVisible();
  });

  test("点击侧边栏「对话工作台」跳转到 /chat", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "对话工作台" }).first();
    await link.click();
    await expect(page).toHaveURL(/\/chat$/);
  });

  test("点击侧边栏「实时监控」跳转到 /monitor", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "实时监控" }).first();
    await link.click();
    await expect(page).toHaveURL(/\/monitor$/);
  });

  test("点击侧边栏「工单中心」跳转到 /tickets", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "工单中心" }).first();
    await link.click();
    await expect(page).toHaveURL(/\/tickets$/);
  });

  test("点击侧边栏「记忆中心」跳转到 /memory", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "记忆中心" }).first();
    await link.click();
    await expect(page).toHaveURL(/\/memory$/);
  });
});
