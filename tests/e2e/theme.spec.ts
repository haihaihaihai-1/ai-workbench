import { expect, test } from "@playwright/test";

test.describe("Theme", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("点击主题切换器弹出主题选项", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "切换主题" });
    await trigger.click();
    await expect(page.getByRole("radio", { name: "暗色" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "亮色" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "跟随系统" })).toBeVisible();
  });

  test("选择「亮色」后 html 移除 dark class", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "切换主题" });
    await trigger.click();
    await page.getByRole("radio", { name: "亮色" }).click();
    const html = page.locator("html");
    const cls = await html.getAttribute("class");
    expect(cls ?? "").not.toContain("dark");
  });

  test("选择「暗色」后 html 添加 dark class", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "切换主题" });
    await trigger.click();
    await page.getByRole("radio", { name: "暗色" }).click();
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });
});
