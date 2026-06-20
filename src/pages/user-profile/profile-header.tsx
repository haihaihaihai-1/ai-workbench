import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconChevronLeft, IconClock, IconMail, IconShieldCheck } from "@/components/icons"
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { MOCK_USER } from "./mock-data";

const STATUS_MAP = {
  active: { label: "活跃", color: "text-success", dot: "bg-success" },
  inactive: { label: "沉默", color: "text-muted-foreground", dot: "bg-muted-foreground" },
  dormant: { label: "沉睡", color: "text-warning", dot: "bg-warning" },
} as const;

export function ProfileHeader() {
  const user = MOCK_USER;
  const st = STATUS_MAP[user.status];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="-ml-2 h-7 gap-1 text-muted-foreground"
            >
              <Link to="/memory">
                <IconChevronLeft className="h-3.5 w-3.5" />
                返回记忆中心
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 font-mono text-[10px]">
              <IconShieldCheck className="h-3 w-3" />
              ID {user.id}
            </Badge>
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              <span className={st.color}>{st.label}</span>
            </Badge>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <Avatar className="h-20 w-20 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[#8B5CF6] text-2xl text-primary-foreground">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
              <span className="text-sm text-muted-foreground">{user.role}</span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                {user.major} · {user.grade}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconMail className="h-3 w-3" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <IconClock className="h-3 w-3" />
                最近活跃 2 小时前
              </span>
              <span className="font-mono">GPA {user.gpa}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {user.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="cursor-pointer text-[10px] transition-colors hover:bg-primary/15 hover:text-primary"
                  onClick={() => toast.info(`已筛选标签：${t}`)}
                >
                  #{t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
