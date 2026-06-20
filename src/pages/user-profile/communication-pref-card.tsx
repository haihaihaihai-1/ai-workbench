import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconMessageSquare, IconStar } from "@/components/icons"
import { COMMUNICATION_PREF } from "./mock-data";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar
          key={i}
          className={`h-3.5 w-3.5 ${
            i < value ? "fill-warning text-warning" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function CommunicationPrefCard() {
  const prefs = Object.values(COMMUNICATION_PREF);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <IconMessageSquare className="h-4 w-4 text-info" />
          沟通偏好
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {prefs.map((p) => (
          <div
            key={p.label}
            className="flex items-center justify-between rounded-md border border-border/50 bg-muted/20 px-3 py-2"
          >
            <div>
              <div className="text-xs font-medium">{p.label}</div>
              <div className="text-[10px] text-muted-foreground">{p.hint}</div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating value={p.value} />
              <span className="w-6 text-right font-mono text-xs tabular-nums">{p.value}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
