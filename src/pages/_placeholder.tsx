import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Construction } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  v2ETA?: string;
  related?: { title: string; url: string }[];
};

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  features,
  v2ETA = "v7.1",
  related,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <Badge variant="warning">v7 占位</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Construction className="h-4 w-4 text-warning" />
              本期规划功能
            </CardTitle>
            <CardDescription>以下功能将在 {v2ETA} 完整实现</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {related && related.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">先去体验</CardTitle>
              <CardDescription>已完成的 4 个核心页面</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {related.map((r) => (
                <Button key={r.url} variant="outline" size="sm" className="justify-between" asChild>
                  <Link to={r.url}>
                    {r.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
