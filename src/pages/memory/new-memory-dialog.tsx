import { IconPlus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Memory, MemoryType } from "@/lib/types";
import { randomId } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const TYPE_OPTIONS: { value: MemoryType; label: string; icon: string }[] = [
  { value: "fact", label: "事实", icon: "📌" },
  { value: "preference", label: "偏好", icon: "❤️" },
  { value: "event", label: "事件", icon: "📅" },
  { value: "skill", label: "技能", icon: "🎯" },
];

const SOURCE_OPTIONS = [
  "对话提取",
  "手动创建",
  "系统观察",
  "用户反馈",
  "外部导入",
];

export function NewMemoryDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (memory: Memory) => void;
}) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<MemoryType>("fact");
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("手动创建");
  const [confidence, setConfidence] = useState("80");

  const reset = () => {
    setContent("");
    setType("fact");
    setTags("");
    setSource("手动创建");
    setConfidence("80");
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("请输入记忆内容");
      return;
    }

    const memory: Memory = {
      id: randomId(),
      type,
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      confidence: Number.parseInt(confidence, 10) / 100,
      source,
      createdAt: Date.now(),
    };

    onCreate(memory);
    toast.success("记忆已创建");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPlus className="h-4 w-4" />
            新建记忆
          </DialogTitle>
          <DialogDescription>
            手动添加长期记忆，系统将在对话中自动召回相关内容。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="memory-content">内容 *</Label>
            <Textarea
              id="memory-content"
              placeholder="如: 用户偏好简洁的回答风格，不喜欢过多的解释..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>类型</Label>
              <Select value={type} onValueChange={(v) => setType(v as MemoryType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="mr-1.5">{opt.icon}</span>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>来源</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="memory-tags">标签（逗号分隔）</Label>
            <Input
              id="memory-tags"
              placeholder="如: 偏好, 回答风格"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="memory-confidence">
              置信度: {Number.parseInt(confidence, 10)}%
            </Label>
            <input
              id="memory-confidence"
              type="range"
              min="0"
              max="100"
              step="5"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>创建记忆</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
