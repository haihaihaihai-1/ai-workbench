// 第二轮：把"值引用"（icon: Foo, typeof Foo, etc.）替换为 IconFoo
// 这些第一轮没处理：多行 import + 表达式中作为值的引用

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

// 1) 找出每个文件从 @/components/icons 导入的图标名
// 2) 找出文件中所有未被改的"裸"图标名（值引用形式）
// 形式包括：icon: Foo, typeof Foo, as Foo

const importRe = /import\s*\{([^}]+)\}\s*from\s*["']@\/components\/icons["']\s*;?/g;

let totalFixed = 0;

for await (const file of walk(ROOT)) {
  const src = await readFile(file, "utf8");

  // 找出已导入的图标名（去掉 Icon 前缀得到基础名）
  const importMatches = [...src.matchAll(importRe)];
  if (importMatches.length === 0) continue;

  const baseNames = new Set();
  for (const m of importMatches) {
    const names = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const n of names) {
      if (n.startsWith("Icon")) baseNames.add(n.slice(4));
    }
  }

  if (baseNames.size === 0) continue;

  // 替换值引用：
  //   - icon: Foo  →  icon: IconFoo
  //   - typeof Foo  →  typeof IconFoo
  //   - : Foo,  →  : IconFoo,
  //   - , Foo }  →  , IconFoo }
  //   - as Foo  →  as IconFoo
  //   - <Foo />  →  <IconFoo />  （这一轮再扫一遍，应该早就替换了，但防御）
  //   - = Foo    →  = IconFoo
  // 关键：避免把已经以 Icon 开头的名字重复加 Icon

  let newSrc = src;
  for (const name of baseNames) {
    if (!name) continue;
    // 用 word boundary 匹配未带 Icon 前缀的
    const re = new RegExp(`\\b(?<!Icon)${name}\\b`, "g");
    newSrc = newSrc.replace(re, `Icon${name}`);
  }

  if (newSrc !== src) {
    await writeFile(file, newSrc, "utf8");
    const changed = (src.length - newSrc.length); // negative = longer
    console.log(`✓ ${file} (${changed < 0 ? "+" : ""}${Math.abs(changed)} chars)`);
    totalFixed++;
  }
}

console.log(`\n完成: 修复 ${totalFixed} 个文件`);
