import { format, subDays, parseISO } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface HeatmapEntry {
  date: string;
  count: number;
}

interface HeatmapChartProps {
  data: HeatmapEntry[];
}

function getColor(count: number) {
  if (count === 0) return "bg-secondary";
  if (count <= 1) return "bg-primary/25";
  if (count <= 3) return "bg-primary/50";
  if (count <= 6) return "bg-primary/75";
  return "bg-primary";
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  const dataMap = new Map(data.map((d) => [d.date, d.count]));

  // Build 52 weeks (364 days) + today = 365 squares
  const cells: { date: string; count: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, "yyyy-MM-dd");
    cells.push({ date: dateStr, count: dataMap.get(dateStr) ?? 0 });
  }

  // Group into columns of 7 (weeks)
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell) => (
                <Tooltip key={cell.date}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-opacity hover:opacity-80 ${getColor(cell.count)}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {format(parseISO(cell.date), "MMM d, yyyy")} — {cell.count} completion{cell.count !== 1 ? "s" : ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 3, 6, 8].map((v) => (
            <div key={v} className={`w-3 h-3 rounded-sm ${getColor(v)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
