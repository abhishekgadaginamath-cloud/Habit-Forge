import { useState } from "react";
import { motion } from "framer-motion";
import { useGetHeatmap, useGetUserStats } from "@workspace/api-client-react";
import { useGetProfile } from "@workspace/api-client-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const { data: heatmap = [] } = useGetHeatmap();
  const { data: stats } = useGetUserStats();
  const { data: profile } = useGetProfile();

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  const heatmapMap = new Map<string, number>(
    heatmap.map((h: { date: string; count: number }) => [h.date, h.count])
  );

  function prevMonth() {
    setViewDate((v) => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: v.month - 1 };
    });
  }

  function nextMonth() {
    setViewDate((v) => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: v.month + 1 };
    });
  }

  const cells: Array<{ day: number | null; date: string; count: number }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, date: "", count: 0 });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, date: dateStr, count: heatmapMap.get(dateStr) ?? 0 });
  }

  function cellColor(count: number) {
    if (count === 0) return "transparent";
    if (count === 1) return "rgba(139,92,246,0.25)";
    if (count === 2) return "rgba(139,92,246,0.45)";
    if (count === 3) return "rgba(139,92,246,0.65)";
    return "rgba(139,92,246,0.85)";
  }

  function cellBorder(count: number) {
    if (count === 0) return "var(--border)";
    return `rgba(139,92,246,${Math.min(0.3 + count * 0.15, 0.8)})`;
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const monthCompletions = cells.filter((c) => c.day !== null && c.count > 0).length;
  const totalDays = daysInMonth;
  const completionRate = Math.round((monthCompletions / totalDays) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Current Streak", value: `${stats?.longestStreak ?? 0}d`, color: "#f59e0b", icon: "🔥" },
          { label: "Month Active", value: `${monthCompletions}d`, color: "#8b5cf6", icon: "📅" },
          { label: "Completion", value: `${completionRate}%`, color: "#10b981", icon: "✓" },
          { label: "Level", value: String(profile?.level ?? 1), color: "#ec4899", icon: "⚡" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg-surface)",
              border: "0.5px solid var(--border)",
              borderRadius: 12, padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar panel */}
      <div style={{
        background: "var(--bg-surface)",
        border: "0.5px solid var(--border)",
        borderRadius: 14, padding: "24px",
      }}>
        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: "var(--bg-elevated)",
              border: "0.5px solid var(--border)",
              color: "var(--text-muted)", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >←</motion.button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              {MONTHS[viewDate.month]}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{viewDate.year}</div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: "var(--bg-elevated)",
              border: "0.5px solid var(--border)",
              color: "var(--text-muted)", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >→</motion.button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", padding: "4px 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((cell, i) => {
            const isToday = cell.date === todayStr;
            const isFuture = cell.date > todayStr;
            return (
              <motion.div
                key={i}
                whileHover={cell.day ? { scale: 1.08 } : undefined}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: isToday ? 700 : 400,
                  cursor: cell.day ? "default" : "default",
                  background: cell.day ? cellColor(cell.count) : "transparent",
                  border: cell.day
                    ? `1px solid ${isToday ? "#8b5cf6" : cellBorder(cell.count)}`
                    : "none",
                  color: isToday
                    ? "#c4b5fd"
                    : isFuture
                    ? "var(--text-muted)"
                    : cell.count > 0
                    ? "#e9d5ff"
                    : "var(--text-muted)",
                  boxShadow: isToday ? "0 0 12px rgba(139,92,246,0.5)" : cell.count >= 3 ? "0 0 8px rgba(139,92,246,0.35)" : "none",
                  opacity: isFuture && !isToday ? 0.4 : 1,
                  position: "relative",
                  transition: "all 0.15s",
                }}
              >
                {cell.day ?? ""}
                {isToday && (
                  <div style={{
                    position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
                    width: 4, height: 4, borderRadius: "50%", background: "#8b5cf6",
                  }} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Intensity:</span>
          {[0, 1, 2, 3, 4].map((v) => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 14, height: 14, borderRadius: 4,
                background: cellColor(v),
                border: `1px solid ${cellBorder(v)}`,
              }} />
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {v === 0 ? "None" : v === 4 ? "All" : `${v}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly insights */}
      <div style={{
        background: "var(--bg-surface)",
        border: "0.5px solid var(--border-accent)",
        borderRadius: 12, padding: "20px 24px",
      }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, fontWeight: 500 }}>
          Monthly Insights
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Active days this month</div>
            <div style={{ height: 6, background: "var(--border)", borderRadius: 99 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ height: "100%", background: "linear-gradient(to right, #7c3aed, #a855f7)", borderRadius: 99 }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#a78bfa", marginTop: 4 }}>{monthCompletions} / {totalDays} days ({completionRate}%)</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Habit completions logged</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#8b5cf6" }}>
              {(heatmap as { date: string; count: number }[]).filter((h) => {
                const d = new Date(h.date);
                return d.getFullYear() === viewDate.year && d.getMonth() === viewDate.month;
              }).reduce((sum, h) => sum + h.count, 0)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>total this month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
