// Button 演示 - 7 变体 × 5 尺寸

import { Button, type ButtonProps } from "@/components/ui/button";
import { ArrowRight, Download, Heart, Loader2, Mail, Plus, Trash2 } from "lucide-react";
import { DemoCard, SectionFrame } from "./section-frame";

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
  "success",
  "warning",
];

const SIZES: NonNullable<ButtonProps["size"]>[] = ["xs", "sm", "default", "lg", "icon"];

export function SectionButton() {
  return (
    <SectionFrame
      id="button"
      title="Button"
      description="8 个变体 × 5 个尺寸，支持 loading / disabled / asChild / 图标"
    >
      {/* 变体 × 尺寸 网格 */}
      <DemoCard title="变体 × 尺寸" description="default / sm / lg / xs / icon">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Variant</th>
                {SIZES.map((s) => (
                  <th key={s} className="pb-2 pr-4 font-medium">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {VARIANTS.map((v) => (
                <tr key={v}>
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{v}</td>
                  {SIZES.map((s) => (
                    <td key={s} className="py-3 pr-4">
                      <Button variant={v} size={s}>
                        {s === "icon" ? <Plus className="h-4 w-4" /> : "Button"}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoCard>

      {/* 含图标 */}
      <DemoCard title="含图标" description="lucide-react 图标 + 文字组合">
        <div className="flex flex-wrap gap-2">
          <Button>
            <Mail className="h-4 w-4" />
            发送邮件
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4" />
            下载报告
          </Button>
          <Button variant="outline">
            <Heart className="h-4 w-4" />
            收藏
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            删除
          </Button>
          <Button variant="success">
            <ArrowRight className="h-4 w-4" />
            继续
          </Button>
        </div>
      </DemoCard>

      {/* 状态 */}
      <DemoCard title="状态" description="loading / disabled / icon only">
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            加载中
          </Button>
          <Button disabled variant="outline">
            已禁用
          </Button>
          <Button size="icon" variant="ghost" aria-label="add">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="link">链接样式 →</Button>
        </div>
      </DemoCard>
    </SectionFrame>
  );
}
