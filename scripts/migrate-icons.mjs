// 一次性脚本：把 lucide-react 引用替换为新的 Icon 系统
// 用法：node scripts/migrate-icons.mjs

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

// 匹配 import { ... } from "lucide-react"
// 匹配 JSX 中的 <Foo /> 或 <Foo ... />
const importRe = /import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']\s*;?/g;
const jsxRe = /<([A-Z][A-Za-z0-9]*)\b/g;

let totalFiles = 0;
let totalImports = 0;
let totalJsx = 0;
let skippedFiles = 0;

for await (const file of walk(ROOT)) {
  const src = await readFile(file, "utf8");
  // 找出所有 import 出来的图标名
  const importMatches = [...src.matchAll(importRe)];
  if (importMatches.length === 0) {
    skippedFiles++;
    continue;
  }
  const iconNames = new Set();
  for (const m of importMatches) {
    const names = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const n of names) iconNames.add(n);
  }

  // 检查每个 iconName 在 IconXxx 中是否已存在（保守起见只替换有对应的）
  // 由于我们写的图标覆盖了主流名，先全部尝试替换，运行时 fallback

  let newSrc = src;

  // 1) 替换 import 语句
  newSrc = newSrc.replace(importRe, (match, body) => {
    const names = body
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((n) => `Icon${n}`);
    return `import { ${names.join(", ")} } from "@/components/icons"`;
  });

  // 2) 替换 JSX 中的 <Foo
  //    注意：不能替换已经在 Icon* 中的
  newSrc = newSrc.replace(jsxRe, (match, name) => {
    if (name.startsWith("Icon")) return match; // 已经是 IconXxx
    if (!iconNames.has(name)) return match; // 不是从 lucide 导入的
    return `<Icon${name}`;
  });

  if (newSrc !== src) {
    await writeFile(file, newSrc, "utf8");
    totalFiles++;
    totalImports += importMatches.length;
    totalJsx += (newSrc.match(/<Icon[A-Z]/g) ?? []).length;
    console.log(`✓ ${file}`);
  }
}

console.log(`\n完成: ${totalFiles} 个文件，${totalImports} 处 import，~${totalJsx} 处 JSX`);
