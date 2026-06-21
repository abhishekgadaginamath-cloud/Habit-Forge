import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetUserStats } from "@workspace/api-client-react";

const CHALLENGES = [
  {
    id: 1,
    title: "7-Day Discipline",
    description: "Complete all your daily habits for 7 consecutive days without missing a single one.",
    icon: "⚔️",
    color: "#8b5cf6",
    duration: "7 days",
    participants: 2841,
    reward: 350,
    difficulty: "Beginner",
    tags: ["Consistency", "Daily"],
    progress: 3,
    total: 7,
    joined: true,
  },
  {
    id: 2,
    title: "30-Day Forge",
    description: "Build unbreakable discipline by completing your core habits for an entire month.",
    icon: "🔥",
    color: "#f59e0b",
    duration: "30 days",
    participants: 1203,
    reward: 1500,
    difficulty: "Advanced",
    tags: ["Mastery", "Streak"],
    progress: 0,
    total: 30,
    joined: false,
  },
  {
    id: 3,
    title: "Dopamine Detox",
    description: "No social media, no junk food, no procrastination. 5 days of pure discipline.",
    icon: "🧠",
    color: "#10b981",
    duration: "5 days",
    participants: 4729,
    reward: 250,
    difficulty: "Medium",
    tags: ["Focus", "Mindset"],
    progress: 0,
    total: 5,
    joined: false,
  },
  {
    id: 4,
    title: "Early Riser",
    description: "Wake up before 6AM every day for 14 days straight. Transform your mornings.",
    icon: "☀️",
    color: "#f97316",
    duration: "14 days",
    participants: 892,
    reward: 700,
    difficulty: "Hard",
    tags: ["Sleep", "Routine"],
    progress: 0,
    total: 14,
    joined: false,
  },
  {
    id: 5,
    title: "Coding Streak",
    description: "Code for at least 30 minutes every day for 21 days. Build the builder habit.",
    icon: "💻",
    color: "#3b82f6",
    duration: "21 days",
    participants: 1560,
    reward: 1050,
    difficulty: "Medium",
    tags: ["Coding", "Skills"],
    progress: 0,
    total: 21,
    joined: false,
  },
  {
    id: 6,
    title: "Glow Up Month",
    description: "Exercise, eat clean, sleep 8h, meditate. All 4 habits every day for 30 days.",
    icon: "💎",
    color: "#ec4899",
    duration: "30 days",
    participants: 3210,
    reward: 2000,
    difficulty: "Elite",
    tags: ["Health", "Fitness"],
    progress: 0,
    total: 30,
    joined: false,
  },
];

const LEADERBOARD = [
  { rank: 1, name: "NightOwl_X", avatar: "🦉", xp: 4200, streak: 28, badge: "💎" },
  { rank: 2, name: "IronMind", avatar: "💪", xp: 3850, streak: 24, badge: "🥈" },
  { rank: 3, name: "ZenCoder", avatar: "🧘", xp: 3600, streak: 21, badge: "🥉" },
  { rank: 4, name: "SolarRise", avatar: "☀️", xp: 3100, streak: 18, badge: null },
  { rank: 5, name: "You", avatar: "🔥", xp: 0, streak: 0, badge: null, isYou: true },
];

const DIFF_COLORS: Record<string, string> = {
  Beginner: "#10b981",
  Medium: "#f59e0b",
  Hard: "#f97316",
  Advanced: "#ef4444",
  Elite: "#ec4899",
};

export default function Challenges() {
  const { data: stats } = useGetUserStats();
  const [joined, setJoined] = useState<Set<number>>(new Set([1]));
  const [tab, setTab] = useState<"active" | "discover" | "leaderboard">("active");

  const activeChallenges = CHALLENGES.filter((c) => joined.has(c.id));
  const discoverChallenges = CHALLENGES.filter((c) => !joined.has(c.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Active Challenges", value: joined.size, color: "#8b5cf6", icon: "⚔️" },
          { label: "Challenge XP", value: (stats?.xp ?? 0).toLocaleString(), color: "#f59e0b", icon: "✦" },
          { label: "Completed", value: "0", color: "#10b981", icon: "🏆" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg-surface)",
              border: "0.5px solid var(--border)",
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        {(["active", "discover", "leaderboard"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "10px 0",
              background: tab === t ? "rgba(139,92,246,0.15)" : "transparent",
              color: tab === t ? "#c4b5fd" : "var(--text-muted)",
              border: "none",
              borderBottom: tab === t ? "2px solid #8b5cf6" : "2px solid transparent",
              cursor: "pointer",
              fontSize: 12, fontWeight: 600,
              textTransform: "capitalize",
              transition: "all 0.15s",
            }}
          >
            {t === "active" ? `Active (${activeChallenges.length})` : t === "discover" ? "Discover" : "Leaderboard"}
          </button>
        ))}
      </div>

      {/* Active tab */}
      <AnimatePresence mode="wait">
        {tab === "active" && (
          <motion.div key="active" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {activeChallenges.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "56px 24px",
                background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 12,
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⚔️</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No active challenges</div>
                <button
                  onClick={() => setTab("discover")}
                  style={{ marginTop: 12, background: "none", border: "none", color: "#c4b5fd", cursor: "pointer", fontSize: 13 }}
                >
                  Browse challenges →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {activeChallenges.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} joined onLeave={() => setJoined((s) => { const n = new Set(s); n.delete(c.id); return n; })} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === "discover" && (
          <motion.div key="discover" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {discoverChallenges.map((c) => (
                <ChallengeCard key={c.id} challenge={c} joined={false} onJoin={() => setJoined((s) => new Set([...s, c.id]))} />
              ))}
            </div>
          </motion.div>
        )}

        {tab === "leaderboard" && (
          <motion.div key="lb" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LEADERBOARD.map((entry) => (
                <div
                  key={entry.rank}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: entry.isYou ? "rgba(139,92,246,0.1)" : "var(--bg-surface)",
                    border: `0.5px solid ${entry.isYou ? "rgba(139,92,246,0.4)" : "var(--border)"}`,
                    borderRadius: 10, padding: "14px 16px",
                    boxShadow: entry.isYou ? "0 0 20px rgba(139,92,246,0.15)" : "none",
                  }}
                >
                  <div style={{
                    width: 28, fontSize: 14, fontWeight: 700,
                    color: entry.rank <= 3 ? "#f59e0b" : "var(--text-muted)",
                    flexShrink: 0, textAlign: "center",
                  }}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "var(--bg-elevated)", border: "0.5px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {entry.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: entry.isYou ? "#c4b5fd" : "var(--text-primary)" }}>
                      {entry.name} {entry.isYou ? "(you)" : ""}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      🔥 {entry.streak}-day streak
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>
                      {entry.xp > 0 ? entry.xp.toLocaleString() : stats?.xp ?? 0} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChallengeCard({
  challenge: c,
  joined,
  onJoin,
  onLeave,
}: {
  challenge: typeof CHALLENGES[0];
  joined: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
}) {
  const DIFF_COLORS: Record<string, string> = {
    Beginner: "#10b981", Medium: "#f59e0b", Hard: "#f97316", Advanced: "#ef4444", Elite: "#ec4899",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--bg-surface)",
        border: `0.5px solid ${joined ? c.color + "50" : "var(--border)"}`,
        borderRadius: 12,
        padding: "18px 20px",
        boxShadow: joined ? `0 0 24px ${c.color}20` : "none",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: c.color + "20", border: `0.5px solid ${c.color}60`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, boxShadow: `0 0 16px ${c.color}30`,
        }}>
          {c.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{c.title}</div>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: DIFF_COLORS[c.difficulty] ?? "#8b5cf6",
              background: (DIFF_COLORS[c.difficulty] ?? "#8b5cf6") + "22",
              padding: "2px 8px", borderRadius: 99,
            }}>
              {c.difficulty}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 10 }}>
            {c.description}
          </div>

          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-muted)", flexWrap: "wrap" }}>
            <span>⏱ {c.duration}</span>
            <span>👥 {c.participants.toLocaleString()}</span>
            <span style={{ color: "#f59e0b" }}>✦ +{c.reward} XP</span>
          </div>

          {joined && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: "var(--text-muted)" }}>
                <span>Progress</span>
                <span style={{ color: c.color }}>{c.progress}/{c.total} days</span>
              </div>
              <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.progress / c.total) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ height: "100%", background: c.color, borderRadius: 99, boxShadow: `0 0 8px ${c.color}` }}
                />
              </div>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={joined ? onLeave : onJoin}
          style={{
            padding: "8px 16px",
            borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontWeight: 600,
            border: joined ? `0.5px solid ${c.color}66` : `0.5px solid ${c.color}66`,
            background: joined ? "transparent" : c.color + "22",
            color: joined ? "var(--text-muted)" : c.color,
            flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          {joined ? "Leave" : "Join"}
        </motion.button>
      </div>
    </motion.div>
  );
}
