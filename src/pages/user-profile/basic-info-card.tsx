import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { IconCalendar, IconGraduationCap, IconHash, IconMail, IconMapPin, IconPhone, IconUser } from "@/components/icons"
import { MOCK_USER } from "./mock-data";

type Row = {
  icon: typeof IconMail;
  label: string;
  value: string;
};

export function BasicInfoCard() {
  const user = MOCK_USER;
  const rows: Row[] = [
    { icon: IconGraduationCap, label: "专业", value: user.major },
    { icon: IconUser, label: "年级", value: user.grade },
    { icon: IconHash, label: "学号", value: user.studentId },
    { icon: IconMail, label: "邮箱", value: user.email },
    { icon: IconPhone, label: "电话", value: user.phone },
    { icon: IconMapPin, label: "地区", value: user.region },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconUser className="h-4 w-4 text-primary" />
          基础信息
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 text-xs">
            <r.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="w-12 shrink-0 text-muted-foreground">{r.label}</span>
            <span className="flex-1 truncate font-mono text-foreground">{r.value}</span>
          </div>
        ))}
        <Separator className="my-1" />
        <div className="flex items-center gap-3 text-xs">
          <IconCalendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="w-12 shrink-0 text-muted-foreground">加入</span>
          <span className="font-mono text-foreground">
            {formatDate(user.joinedAt, "yyyy-MM-dd")}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <IconCalendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="w-12 shrink-0 text-muted-foreground">活跃</span>
          <span className="font-mono text-foreground">
            {formatDate(user.lastActiveAt, "MM-dd HH:mm")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
