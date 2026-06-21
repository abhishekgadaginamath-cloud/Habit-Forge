import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface ConsistencyEntry {
  date: string;
  completionRate: number;
  completed: number;
  total: number;
}

interface Props {
  data: ConsistencyEntry[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ConsistencyEntry;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground mb-1">
        {format(parseISO(d.date), "MMM d")}
      </p>
      <p className="text-primary">{Math.round(d.completionRate * 100)}% complete</p>
      <p className="text-muted-foreground">{d.completed} / {d.total} habits</p>
    </div>
  );
}

export default function ConsistencyChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    rate: Math.round(d.completionRate * 100),
    label: format(parseISO(d.date), "MMM d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 15%)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "hsl(240 5% 65%)" }}
          tickLine={false}
          axisLine={false}
          interval={6}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "hsl(240 5% 65%)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="hsl(20 100% 55%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "hsl(20 100% 55%)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
