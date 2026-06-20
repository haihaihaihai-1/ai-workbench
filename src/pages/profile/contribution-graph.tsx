/**
 * ContributionGraph · GitHub 招牌贡献热力图
 *
 * 53 周 × 7 天 = 1 年贡献
 * 用 tokens.css 中的 .contrib-0..4 utility class
 * 周日开头（GitHub 默认）
 */

import { cn } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  /** 周数（默认 53） */
  weeks?: number;
  /** 单元格大小 px（默认 12） */
  cellSize?: number;
  /** 间距 px（默认 2） */
  gap?: number;
  /** 标题 */
  title?: string;
  /** 总贡献数（可选，用于显示） */
  totalContributions?: number;
};

/** 生成 53 周 × 7 天的伪随机贡献数据 */
function generateData(weeks: number): number[][] {
  // 用确定性的伪随机（让 SSR/CSR 一致）
  const seed = 42;
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const data: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      // 历史趋势：最近几周贡献更高
      const trend = w / weeks;
      const noise = rand();
      const base = 0.15 + trend * 0.4;
      const v = base + noise * 0.5;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (v > 0.9) level = 4;
      else if (v > 0.7) level = 3;
      else if (v > 0.5) level = 2;
      else if (v > 0.3) level = 1;
      week.push(level);
    }
    data.push(week);
  }
  return data;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export function ContributionGraph({
  weeks = 53,
  cellSize = 11,
  gap = 2,
  title = "248 contributions in the last year",
}: Props) {
  const data = useMemo(() => generateData(weeks), [weeks]);

  // 计算每月在哪一周开始
  const monthLabels = useMemo(() => {
    const labels: { week: number; name: string }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      // 假设第 w 周对应月份 = w * 12 / weeks
      const month = Math.floor((w * 12) / weeks);
      if (month !== lastMonth) {
        labels.push({ week: w, name: MONTHS[month] ?? "" });
        lastMonth = month;
      }
    }
    return labels;
  }, [weeks]);

  const total = useMemo(() => {
    return data.reduce((sum, week) => sum + week.filter((v) => v > 0).length, 0);
  }, [data]);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {total} contributions in the last year
        </h3>
        <span className="text-[10px] text-muted-foreground">
          {title !== `248 contributions in the last year` ? title : ""}
        </span>
      </div>

      <div className="flex gap-1.5">
        {/* 星期标签列（左侧） */}
        <div
          className="flex shrink-0 flex-col justify-between text-[10px] text-muted-foreground"
          style={{ height: cellSize * 7 + gap * 6 }}
        >
          {WEEKDAYS.map((d, i) => (
            <span key={i} className="leading-none" style={{ height: cellSize }}>
              {d}
            </span>
          ))}
        </div>

        {/* 主网格 */}
        <div className="flex-1 overflow-x-auto">
          <div className="relative">
            {/* 月份标签（顶部） */}
            <div className="mb-1 flex text-[10px] text-muted-foreground" style={{ height: 14 }}>
              {monthLabels.map((m) => (
                <span
                  key={`m-${m.week}`}
                  className="absolute"
                  style={{ left: m.week * (cellSize + gap) }}
                >
                  {m.name}
                </span>
              ))}
            </div>

            {/* 53 周 × 7 天网格 */}
            <div className="flex" style={{ gap }}>
              {data.map((week, wi) => (
                <div key={`w-${wi}`} className="flex flex-col" style={{ gap }}>
                  {week.map((level, di) => (
                    <div
                      key={`c-${wi}-${di}`}
                      className={cn(
                        "contrib-cell transition-colors",
                        `contrib-${level}`,
                        "hover:ring-1 hover:ring-foreground/40",
                      )}
                      style={{ width: cellSize, height: cellSize }}
                      title={`${level === 0 ? "No" : level === 1 ? "1-3" : level === 2 ? "4-6" : level === 3 ? "7-9" : "10+"} contributions on week ${wi + 1}, day ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][di]}`}
                      aria-label={`${level} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 图例（GitHub 招牌：Less ... More） */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((l) => (
            <div
              key={l}
              className={cn("contrib-cell", `contrib-${l}`)}
              style={{ width: cellSize, height: cellSize }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
