import { motion } from "framer-motion";

interface Badge {
  name: string;
  unlockedAt: string;
}

const ALL_BADGES = [
  { name: "First Step", description: "Complete first habit", icon: "👣" },
  { name: "Consistency King", description: "7-day streak", icon: "👑" },
  { name: "Habit Machine", description: "30-day streak", icon: "⚙️" },
  { name: "Century Club", description: "100 completions", icon: "💯" },
  { name: "Level 5 Legend", description: "Reach level 5", icon: "🏆" },
];

interface BadgeGridProps {
  earned: Badge[];
  compact?: boolean;
}

export default function BadgeGrid({ earned, compact = false }: BadgeGridProps) {
  const earnedNames = new Set(earned.map((b) => b.name));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
        gap: compact ? 8 : 10,
      }}
    >
      {ALL_BADGES.map((badge, i) => {
        const isEarned = earnedNames.has(badge.name);
        const earnedData = earned.find((b) => b.name === badge.name);
        return (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isEarned ? 1 : 0.25, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: isEarned ? "var(--bg-elevated)" : "var(--bg-surface)",
              border: `0.5px solid ${isEarned ? "var(--border-accent)" : "var(--border)"}`,
              borderRadius: 10,
              padding: compact ? "10px 8px" : "14px 10px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ fontSize: compact ? 22 : 28, marginBottom: 6, filter: isEarned ? "none" : "grayscale(1)" }}>
              {badge.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: isEarned ? "var(--text-primary)" : "var(--text-muted)", marginBottom: 2 }}>
              {badge.name}
            </div>
            {!compact && (
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{badge.description}</div>
            )}
            {isEarned && earnedData && !compact && (
              <div style={{ fontSize: 10, color: "var(--purple-pale)", marginTop: 4 }}>
                {new Date(earnedData.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
