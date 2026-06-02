import { expect, test } from "@playwright/test";

test.describe("CommandPalette", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("按 Ctrl+K 打开命令面板", async ({ page }) => {
    await page.keyboard.press("Control+K");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("输入「监控」可筛选出结果", async ({ page }) => {
    await page.keyboard.press("Control+K");
    const input = page.getByPlaceholder(/输入命令|页面|功能/);
    await input.fill("监控");
    const result = page.getByRole("option", { name: /实时监控/ });
    await expect(result).toBeVisible();
  });

  test("点击「实时监控」结果跳转到 /monitor 并关闭面板", async ({ page }) => {
    await page.keyboard.press("Control+K");
    const input = page.getByPlaceholder(/输入命令|页面|功能/);
    await input.fill("监控");
    await page.getByRole("option", { name: /实时监控/ }).click();
    await expect(page).toHaveURL(/\/monitor$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("按 Escape 关闭命令面板", async ({ page }) => {
    await page.keyboard.press("Control+K");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
