// 数据导出工具 - CSV / JSON 真实下载
// 包含 BOM 头确保中文不乱码, 自动转义引号/逗号/换行

import { toast } from "sonner";

type Column<T> = { key: keyof T; label: string };

// CSV 字段转义: 含引号/逗号/换行的字段用双引号包裹, 内部引号转义为 ""
function escapeCsv(value: unknown): string {
  if (value == null) return "";
  const s = typeof value === "string" ? value : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 释放对象 URL, 100ms 延迟确保下载触发完成
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// 导出为 CSV 文件; 未指定 columns 时按对象 key 顺序展开
export function exportToCSV<T>(data: T[], filename: string, columns?: Column<T>[]): void {
  if (data.length === 0 && !columns) {
    toast.error("没有可导出的数据");
    return;
  }

  let cols: Column<T>[];
  if (columns && columns.length > 0) {
    cols = columns;
  } else {
    const first = (data[0] ?? {}) as Record<string, unknown>;
    cols = (Object.keys(first) as (keyof T)[]).map((k) => ({
      key: k,
      label: String(k),
    }));
  }

  const header = cols.map((c) => escapeCsv(c.label)).join(",");
  const rows = data.map((row) =>
    cols.map((c) => escapeCsv((row as Record<string, unknown>)[c.key as string])).join(","),
  );
  // \uFEFF 是 UTF-8 BOM, 防止 Excel 打开 CSV 中文乱码
  const csv = `\uFEFF${[header, ...rows].join("\r\n")}`;

  downloadBlob(csv, filename, "text/csv;charset=utf-8");
  toast.success(`已导出 ${filename}`);
}

// 导出为 JSON 文件 (格式化输出, 方便阅读)
export function exportToJSON<T>(data: T[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadBlob(json, filename, "application/json;charset=utf-8");
  toast.success(`已导出 ${filename}`);
}
