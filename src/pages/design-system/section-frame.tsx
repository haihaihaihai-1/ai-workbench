// Section 公共标题组件

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function SectionFrame({ id, title, description, children }: Props) {
  return (
    <section id={id} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Separator />
      {children}
    </section>
  );
}

type DemoCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DemoCard({ title, description, children }: DemoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
