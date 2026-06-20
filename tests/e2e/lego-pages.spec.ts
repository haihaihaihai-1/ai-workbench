import { expect, test } from "@playwright/test";

/**
 * 借皮页面 e2e 验证
 *
 * 覆盖 12 个借皮页面 + 主题系统 + L1 iframe + 图标系统 + 快捷键 + 状态保留
 *
 * 运行要求:
 *   1. pnpm exec playwright install chromium
 *   2. dev server 跑在配置文件中指定的端口 (默认 5173)
 *   3. pnpm exec playwright test
 *
 * 覆盖页面:
 *   /tickets /chat /memory /services /profile
 *   /feedback /flywheel /analysis /evaluation /skills
 *   /admin/users /admin/skills
 */

const PAGES = [
  { path: "/tickets", name: "工单" },
  { path: "/chat", name: "对话" },
  { path: "/memory", name: "记忆" },
  { path: "/services", name: "服务" },
  { path: "/profile", name: "个人" },
  { path: "/feedback", name: "反馈" },
  { path: "/flywheel", name: "飞轮" },
  { path: "/analysis", name: "分析" },
  { path: "/evaluation", name: "评估" },
  { path: "/skills", name: "技能市场" },
  { path: "/admin/users", name: "用户管理" },
  { path: "/admin/skills", name: "技能管理" },
];

test.describe("借皮页面 e2e", () => {
  for (const p of PAGES) {
    test(`${p.path} - 页面能正常打开 (200/304)`, async ({ page }) => {
      const response = await page.goto(p.path);
      expect([200, 304]).toContain(response?.status() ?? 0);
      await expect(page.locator("body")).not.toBeEmpty();
    });

    test(`${p.path} - 页面有 h1/h2 标题`, async ({ page }) => {
      await page.goto(p.path);
      await page.waitForLoadState("domcontentloaded");
      // 至少有一个 h1 或 h2
      const hasHeading = await page.locator("h1, h2").first().isVisible().catch(() => false);
      expect(hasHeading).toBe(true);
    });
  }
});

test.describe("主题切换系统", () => {
  test("顶栏有 ThemePicker 按钮", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "切换主题" });
    await expect(trigger).toBeVisible();
  });

  test("点击 ThemePicker 显示主题选项 (Arctic Frost)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "切换主题" }).click();
    await expect(page.getByText("Arctic Frost")).toBeVisible({ timeout: 3000 });
  });

  test("选择 Midnight Galaxy 后 data-theme 属性变化", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "切换主题" }).click();
    await page.getByText("Midnight Galaxy").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "midnight-galaxy");
  });
});

test.describe("L1 iframe 嵌入", () => {
  test("/monitor 显示 Grafana Live 标签", async ({ page }) => {
    await page.goto("/monitor");
    await expect(page.getByRole("tab", { name: /Grafana Live/ })).toBeVisible();
  });
});

test.describe("图标系统", () => {
  test("首页 SVG 图标数量大于 5", async ({ page }) => {
    await page.goto("/");
    const svgCount = await page.locator("svg").count();
    expect(svgCount).toBeGreaterThan(5);
  });
});

test.describe("快捷键", () => {
  test("/tickets - 按 C 触发新建工单 toast", async ({ page }) => {
    await page.goto("/tickets");
    await page.keyboard.press("c");
    await expect(page.getByText(/新建工单/)).toBeVisible({ timeout: 2000 });
  });
});

test.describe("借皮页面状态保留", () => {
  test("Theme 切换刷新后保持", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "切换主题" }).click();
    await page.getByText("Tech Innovation").click();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "tech-innovation");
  });
});

