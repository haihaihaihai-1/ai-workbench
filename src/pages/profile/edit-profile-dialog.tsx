import { IconCheck, IconPencil } from "@/components/icons";
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export type ProfileData = {
  name: string;
  handle: string;
  bio: string;
  org: string;
  location: string;
  website: string;
};

export function EditProfileDialog({
  open,
  onOpenChange,
  data,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: ProfileData;
  onSave: (data: ProfileData) => void;
}) {
  const [form, setForm] = useState<ProfileData>(data);

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("姓名不能为空");
      return;
    }
    onSave(form);
    toast.success("个人资料已更新");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPencil className="h-4 w-4" />
            编辑个人资料
          </DialogTitle>
          <DialogDescription>
            更新你的个人信息，这些更改将保存到本地。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">姓名 *</Label>
            <Input
              id="profile-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-handle">用户名</Label>
            <Input
              id="profile-handle"
              value={form.handle}
              onChange={(e) => setForm({ ...form, handle: e.target.value })}
              className="font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-bio">简介</Label>
            <Textarea
              id="profile-bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={2}
              placeholder="一句话介绍自己..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-org">组织</Label>
              <Input
                id="profile-org"
                value={form.org}
                onChange={(e) => setForm({ ...form, org: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-location">位置</Label>
              <Input
                id="profile-location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-website">网站</Label>
            <Input
              id="profile-website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <IconCheck className="mr-1.5 h-3.5 w-3.5" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
