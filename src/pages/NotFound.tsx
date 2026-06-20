import { Button } from "@/components/ui/button";
import { IconFrown } from "@/components/icons"
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <IconFrown className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">404 · 页面未找到</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        你访问的页面不存在或已被移动。可以试试命令面板（⌘K）查找。
      </p>
      <Button asChild>
        <Link to="/">返回首页</Link>
      </Button>
    </div>
  );
}
