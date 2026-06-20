import { readFile, writeFile } from "node:fs/promises";

const file = "src/components/icons/index.tsx";
let src = await readFile(file, "utf8");

const m = src.match(/const ICON_NAMES = \[([\s\S]*?)\] as const;/);
if (!m) { console.error("ICON_NAMES not found"); process.exit(1); }

const names = [...m[1].matchAll(/"([A-Za-z0-9]+)"/g)].map(x => x[1]);

// 生成 destructure 段
const destructureLines = [];
let line = "";
for (const n of names) {
  const sym = `Icon${n}`;
  const piece = sym + ", ";
  if (line.length + piece.length > 110) {
    destructureLines.push("  " + line.trim().replace(/,\s*$/, ""));  // 去掉尾随逗号
    line = "";
  }
  line += piece;
}
if (line) destructureLines.push("  " + line.trim().replace(/,\s*$/, ""));
const destructure = "const {\n" + destructureLines.join(",\n") + "\n} = icons;";

// 生成 export 段
const exportLines = [];
for (const n of names) {
  const sym = `Icon${n}`;
  exportLines.push("  " + sym + ",");
}
const exportBlock = "export {\n" + exportLines.join("\n") + "\n};";

const reConst = /const \{[\s\S]*?\} = icons;/;
const reExport = /export \{[\s\S]*?\};/;
const newSrc = src.replace(reConst, destructure).replace(reExport, exportBlock);

await writeFile(file, newSrc, "utf8");
console.log(`✓ ${names.length} names regenerated`);
