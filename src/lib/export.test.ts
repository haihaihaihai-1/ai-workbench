import { exportToCSV, exportToJSON } from "@/lib/export";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SampleRow = { name: string; age: number; city: string };

const SAMPLE: SampleRow[] = [
  { name: "Alice", age: 30, city: "Shanghai" },
  { name: "张三", age: 25, city: "北京" },
];

let capturedParts: BlobPart[] = [];
let capturedType: string | undefined;
let lastClickEl: HTMLAnchorElement | null = null;
let origCreate: typeof URL.createObjectURL;
let origRevoke: typeof URL.revokeObjectURL;

beforeEach(() => {
  capturedParts = [];
  capturedType = undefined;
  lastClickEl = null;

  origCreate = URL.createObjectURL;
  origRevoke = URL.revokeObjectURL;

  // 拦截 Blob 构造以捕获 parts
  const OrigBlob = globalThis.Blob;
  const blobSpy = vi
    .spyOn(globalThis, "Blob")
    .mockImplementation((parts: BlobPart[] = [], opts?: BlobPropertyBag) => {
      capturedParts = parts;
      capturedType = opts?.type;
      return new OrigBlob(parts, opts);
    });

  URL.createObjectURL = vi.fn(() => "blob:mock-url") as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

  // 拦截 <a>.click 防止真实下载
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    lastClickEl = this;
  });

  // 抑制 blobSpy 类型警告
  void blobSpy;
});

afterEach(() => {
  URL.createObjectURL = origCreate;
  URL.revokeObjectURL = origRevoke;
  vi.restoreAllMocks();
});

function csvContent(): string {
  // parts[0] 是字符串 parts
  return String(capturedParts[0] ?? "");
}

describe("exportToCSV", () => {
  it("生成包含 BOM 头 + 表头 + 行的 CSV", () => {
    exportToCSV(SAMPLE, "users.csv");
    const text = csvContent();
    expect(text.charCodeAt(0)).toBe(0xfeff);
    expect(text).toContain("name,age,city");
    expect(text).toContain("Alice,30,Shanghai");
  });

  it("使用 columns 指定的顺序和 label", () => {
    exportToCSV(SAMPLE, "users.csv", [
      { key: "city", label: "城市" },
      { key: "name", label: "姓名" },
    ]);
    const text = csvContent();
    expect(text).toContain("城市,姓名");
    expect(text).toContain("Shanghai,Alice");
  });

  it("中文不被破坏 (BOM 防乱码)", () => {
    exportToCSV([{ title: "你好,世界" }], "cn.csv");
    const text = csvContent();
    expect(text).toContain("你好,世界");
  });

  it("包含引号/逗号/换行的字段被双引号包裹", () => {
    exportToCSV([{ note: 'hi, "world"\nline2' }], "esc.csv");
    const text = csvContent();
    expect(text).toContain('"hi, ""world""');
  });

  it("空数据 + 无列时跳过导出 (toast.error)", async () => {
    const toast = await import("sonner");
    exportToCSV([], "empty.csv");
    expect(toast.toast.error).toHaveBeenCalled();
    expect(capturedParts).toHaveLength(0);
  });

  it("设置 download 属性为指定 filename 并触发 click", () => {
    exportToCSV(SAMPLE, "report.csv");
    expect(lastClickEl?.download).toBe("report.csv");
  });

  it("MIME 类型为 text/csv;charset=utf-8", () => {
    exportToCSV(SAMPLE, "users.csv");
    expect(capturedType).toBe("text/csv;charset=utf-8");
  });
});

describe("exportToJSON", () => {
  it("生成格式化 JSON", () => {
    exportToJSON(SAMPLE, "data.json");
    const text = csvContent();
    const parsed = JSON.parse(text);
    expect(parsed).toEqual(SAMPLE);
    expect(text).toContain("\n");
  });

  it("MIME 类型为 application/json;charset=utf-8", () => {
    exportToJSON(SAMPLE, "data.json");
    expect(capturedType).toBe("application/json;charset=utf-8");
  });

  it("设置 download 属性", () => {
    exportToJSON(SAMPLE, "out.json");
    expect(lastClickEl?.download).toBe("out.json");
  });
});
