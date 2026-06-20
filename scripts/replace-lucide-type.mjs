import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOT = "src";
const EXT = new Set([".ts", ".tsx"]);

async function* walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else if (EXT.has(extname(ent.name))) yield p;
  }
}

let count = 0;
for await (const file of walk(ROOT)) {
  const src = await readFile(file, "utf8");
  if (!src.includes("LucideIcon")) continue;
  // 只在 type 上下文里替换
  // 简单做法：所有 "LucideIcon" 替换为 "IconComponent"（前提是业务方不导出 LucideIcon）
  let newSrc = src;

  // 替换 import 行
  newSrc = newSrc.replace(
    /import\s*type\s*\{[^}]*LucideIcon[^}]*\}\s*from\s*["']lucide-react["']\s*;?/g,
    (m) => m.replace(/LucideIcon/g, "IconComponent").replace(
      /from\s*["']lucide-react["']/,
      "from \"@/components/icons\"",
    ),
  );

  // 替换其余位置
  newSrc = newSrc.replace(/\bLucideIcon\b/g, "IconComponent");

  if (newSrc !== src) {
    await writeFile(file, newSrc, "utf8");
    console.log(`✓ ${file}`);
    count++;
  }
}
console.log(`\n完成: ${count} 个文件`);
