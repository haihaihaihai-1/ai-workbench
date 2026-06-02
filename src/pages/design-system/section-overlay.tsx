import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Dialog / DropdownMenu / Popover / Tabs / Command 展示
import {
  Bell,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { SectionFrame } from "./section-frame";

export function SectionOverlay() {
  return (
    <SectionFrame
      id="overlay"
      title="Overlay"
      description="浮层类组件 - 全部基于 Radix UI，支持 ARIA / 焦点管理 / 键盘导航"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dialog */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">Dialog</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>打开 Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建项目</DialogTitle>
                  <DialogDescription>创建一个新的 AI 协作项目</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>项目名</Label>
                    <Input placeholder="我的项目" />
                  </div>
                  <div>
                    <Label>描述</Label>
                    <Input placeholder="可选" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button>创建</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground">
              基于 Radix Dialog - 焦点陷阱 + ESC 关闭 + 点击遮罩
            </p>
          </CardContent>
        </Card>

        {/* DropdownMenu */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">DropdownMenu / Popover</div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    账户
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>个人资料</DropdownMenuItem>
                  <DropdownMenuItem>账单</DropdownMenuItem>
                  <DropdownMenuItem>设置</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">退出登录</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-1.5">
                    <Filter className="h-3.5 w-3.5" />
                    筛选
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">筛选条件</div>
                    <div className="space-y-1.5 text-xs">
                      {["进行中", "已完成", "待处理", "已取消"].map((s) => (
                        <label key={s} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>编辑</DropdownMenuItem>
                  <DropdownMenuItem>复制</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">Tabs</div>
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">概览</TabsTrigger>
                <TabsTrigger value="b">详情</TabsTrigger>
                <TabsTrigger value="c">历史</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="rounded-md border border-dashed p-3 text-xs">
                这是概览内容。Tabs 支持 ⌥ ← → 键盘导航。
              </TabsContent>
              <TabsContent value="b" className="rounded-md border border-dashed p-3 text-xs">
                这是详情内容。
              </TabsContent>
              <TabsContent value="c" className="rounded-md border border-dashed p-3 text-xs">
                这是历史内容。
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Command */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-medium">Command (⌘K 风格)</div>
            <Command className="rounded-md border">
              <CommandInput placeholder="输入命令..." />
              <CommandList>
                <CommandEmpty>未找到结果</CommandEmpty>
                <CommandGroup heading="建议">
                  <CommandItem>
                    <Search className="h-4 w-4" />
                    <span>搜索</span>
                  </CommandItem>
                  <CommandItem>
                    <Plus className="h-4 w-4" />
                    <span>新建对话</span>
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Bell className="h-4 w-4" />
                    <span>通知中心</span>
                    <CommandShortcut>⌘⇧N</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Settings className="h-4 w-4" />
                    <span>系统设置</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
            <p className="text-xs text-muted-foreground">
              基于 cmdk - 模糊匹配 / 键盘 ↑↓ 选择 / Enter 确认
            </p>
          </CardContent>
        </Card>
      </div>
    </SectionFrame>
  );
}

// 触发一些内部 hooks（防止 strict mode 报告）
export const _overlayMarker = () => null;
