import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { IconDatabase, IconTag } from "@/components/icons"
import { TEST_SETS, type TestSet } from "./mock-data";

type Props = {
  current: TestSet;
  onChange: (id: string) => void;
};

export function TestsetSelector({ current, onChange }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
              <IconDatabase className="h-4 w-4 text-primary" />
              测试集
            </CardTitle>
            <Select value={current.id} onValueChange={onChange}>
              <SelectTrigger className="h-8 w-64 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEST_SETS.map((ts) => (
                  <SelectItem key={ts.id} value={ts.id}>
                    {ts.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              用例数 <span className="font-mono text-foreground">{current.caseCount}</span>
            </span>
            <span className="text-muted-foreground">
              更新于{" "}
              <span className="font-mono text-foreground">
                {formatDate(current.updatedAt, "yyyy-MM-dd")}
              </span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs text-muted-foreground">{current.description}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <IconTag className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">标签分布:</span>
          {Object.entries(current.labels).map(([label, count]) => (
            <Badge key={label} variant="secondary" className="text-[10px]">
              {label}
              <span className="ml-1 font-mono opacity-70">{count}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
