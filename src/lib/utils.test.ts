import { cn, formatDate, percent, randomId, relativeTime, shortNumber } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("合并 class 字符串", () => {
    const result = cn("foo", "bar");
    expect(result).toContain("foo");
    expect(result).toContain("bar");
  });

  it("处理条件 class (falsy 值被忽略)", () => {
    const result = cn("base", false && "hidden", null, undefined, "active");
    expect(result).toContain("base");
    expect(result).toContain("active");
    expect(result).not.toContain("hidden");
  });

  it("tailwind 冲突时后者覆盖前者", () => {
    const result = cn("p-2", "p-4");
    expect(result).toContain("p-4");
    expect(result).not.toContain("p-2");
  });

  it("接受数组/对象语法", () => {
    const result = cn(["a", "b"], { c: true, d: false });
    expect(result).toContain("a");
    expect(result).toContain("b");
    expect(result).toContain("c");
    expect(result).not.toContain("d");
  });
});

describe("formatDate", () => {
  it("格式化为 yyyy-MM-dd HH:mm", () => {
    const result = formatDate(new Date(2025, 0, 5, 9, 7));
    expect(result).toBe("2025-01-05 09:07");
  });

  it("接受 ISO 字符串", () => {
    const result = formatDate("2024-12-31T23:59:00");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    expect(result).toContain("2024-12-31");
  });

  it("接受时间戳", () => {
    const ts = new Date(2025, 5, 15, 12, 30).getTime();
    expect(formatDate(ts)).toBe("2025-06-15 12:30");
  });
});

describe("relativeTime", () => {
  it("1 分钟内返回「刚刚」", () => {
    expect(relativeTime(Date.now() - 10_000)).toBe("刚刚");
    expect(relativeTime(Date.now() - 59_000)).toBe("刚刚");
  });

  it("1-59 分钟返回「X 分钟前」", () => {
    expect(relativeTime(Date.now() - 5 * 60_000)).toBe("5 分钟前");
    expect(relativeTime(Date.now() - 30 * 60_000)).toBe("30 分钟前");
  });

  it("1-23 小时返回「X 小时前」", () => {
    expect(relativeTime(Date.now() - 60 * 60_000)).toBe("1 小时前");
    expect(relativeTime(Date.now() - 5 * 60 * 60_000)).toBe("5 小时前");
  });

  it("1-6 天返回「X 天前」", () => {
    expect(relativeTime(Date.now() - 24 * 60 * 60_000)).toBe("1 天前");
    expect(relativeTime(Date.now() - 3 * 24 * 60 * 60_000)).toBe("3 天前");
  });

  it("超过 7 天回退到日期格式", () => {
    const d = new Date(2024, 0, 1);
    const result = relativeTime(d);
    // formatDate 第二个参数当前实现忽略, 总返回 yyyy-MM-dd HH:mm
    expect(result).toMatch(/^2024-01-01/);
    expect(result).toContain("2024-01-01");
  });
});

describe("shortNumber", () => {
  it("< 1000 直接返回", () => {
    expect(shortNumber(0)).toBe("0");
    expect(shortNumber(999)).toBe("999");
  });

  it(">= 1000 转 K", () => {
    expect(shortNumber(1_000)).toBe("1.0K");
    expect(shortNumber(1_234)).toBe("1.2K");
    expect(shortNumber(12_345)).toBe("12.3K");
  });

  it(">= 1_000_000 转 M", () => {
    expect(shortNumber(1_000_000)).toBe("1.0M");
    expect(shortNumber(1_500_000)).toBe("1.5M");
    expect(shortNumber(2_345_678)).toBe("2.3M");
  });
});

describe("percent", () => {
  it("total=0 时返回 0%", () => {
    expect(percent(5, 0)).toBe("0%");
    expect(percent(0, 0)).toBe("0%");
  });

  it("默认 1 位小数", () => {
    expect(percent(1, 3)).toBe("33.3%");
    expect(percent(2, 3)).toBe("66.7%");
  });

  it("digits 参数控制精度", () => {
    expect(percent(1, 3, 0)).toBe("33%");
    expect(percent(1, 2, 2)).toBe("50.00%");
  });

  it("100% 计算正确", () => {
    expect(percent(10, 10)).toBe("100.0%");
  });
});

describe("randomId", () => {
  it("返回非空字符串", () => {
    const id = randomId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("多次调用结果不同 (高概率)", () => {
    const a = randomId();
    const b = randomId();
    const c = randomId();
    expect(a).not.toBe(b);
    expect(b).not.toBe(c);
  });
});
