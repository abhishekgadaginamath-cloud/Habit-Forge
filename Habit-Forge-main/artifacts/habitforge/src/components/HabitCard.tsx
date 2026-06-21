import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HabitWithStatus } from "@workspace/api-client-react";

interface HabitCardProps {
  habit: HabitWithStatus;
  onComplete: (id: number) => Promise<void>;
}

const ICON_BG: Record<string, string> = {
  "#3b82f6": "var(--purple-dark)",
  "#8b5cf6": "var(--purple-dark)",
  "#10b981": "var(--teal-dark)",
  "#f59e0b": "var(--amber-dark)",
  "#ef4444": "var(--coral-dark)",
  "#ec4899": "var(--coral-dark)",
};

function getIconBg(color: string) {
  return ICON_BG[color] ?? "var(--purple-dark)";
}

export default function HabitCard({ habit, onComplete }: HabitCardProps) {
  const [completing, setCompleting] = useState(false);
  const [flash, setFlash] = useState(false);

  async function handleComplete() {
    if (habit.completedToday || completing) return;
    setCompleting(true);
    setFlash(true);
    try {
      await onComplete(habit.id);
    } finally {
      setCompleting(false);
      setTimeout(() => setFlash(false), 600);
    }
  }

  const done = habit.completedToday;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ position: "relative" }}
    >
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 10,
              pointerEvents: "none",
              zIndex: 10,
              background: "var(--teal)",
              opacity: 0.15,
            }}
          />
        )}
      </AnimatePresence>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          background: done ? "#0a1a15" : "var(--bg-surface)",
          border: `0.5px solid ${done ? "#0f6e56" : "var(--border)"}`,
          borderRadius: 10,
          transition: "all 0.2s",
        }}
      >
        {/* Icon box */}
        <motion.div
          animate={flash ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: getIconBg(habit.color),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {habit.icon}
        </motion.div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: done ? "var(--text-muted)" : "var(--text-primary)",
              textDecoration: done ? "line-through" : "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {habit.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
            {habit.streak > 0 && (
              <span style={{ fontSize: 11, color: "var(--amber)", fontWeight: 500 }}>
                🔥 {habit.streak} day streak
              </span>
            )}
            <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>
              {habit.frequency}
            </span>
          </div>
        </div>

        {/* XP chip */}
        <div
          style={{
            background: "var(--purple-dark)",
            border: "0.5px solid var(--border-accent)",
            color: "var(--purple-pale)",
            borderRadius: 20,
            padding: "3px 9px",
            fontSize: 11,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          +10 XP
        </div>

        {/* Complete button */}
        <motion.button
          onClick={handleComplete}
          disabled={done || completing}
          whileTap={!done ? { scale: 0.9 } : {}}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: done ? `1.5px solid var(--teal)` : "1.5px solid var(--border)",
            background: done ? "var(--teal-dark)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: done ? "default" : "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          aria-label={done ? "Completed" : "Mark complete"}
        >
          {done && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ width: 13, height: 13 }}
              viewBox="0 0 16 16"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8l3.5 3.5L13 4" />
            </motion.svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
