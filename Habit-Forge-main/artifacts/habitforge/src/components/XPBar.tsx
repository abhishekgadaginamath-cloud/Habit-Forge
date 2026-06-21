import { motion } from "framer-motion";

interface XPBarProps {
  xp: number;
  level: number;
  xpToNextLevel: number;
  xpProgress: number;
}

export default function XPBar({ xp, level, xpToNextLevel, xpProgress }: XPBarProps) {
  const percent = Math.min(xpProgress * 100, 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: "var(--purple-dark)",
              border: "1px solid var(--border-accent)",
              color: "var(--purple-pale)",
              borderRadius: 6,
              padding: "2px 10px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            Lv {level}
          </div>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
            {xp.toLocaleString()} XP
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {xpToNextLevel.toLocaleString()} to level {level + 1}
        </span>
      </div>
      <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "var(--purple-light)", borderRadius: 99 }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
