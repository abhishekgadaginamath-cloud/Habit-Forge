import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoSVG from "../components/Logo";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetTodayHabits,
  useGetUserStats,
  useCompleteHabit,
  useGetConsistency,
  getGetTodayHabitsQueryKey,
  getGetProfileQueryKey,
  getGetUserStatsQueryKey,
  getGetHabitsQueryKey,
  getGetConsistencyQueryKey,
} from "@workspace/api-client-react";
import type { CompleteHabitResult } from "@workspace/api-client-react";
import HabitCard from "../components/HabitCard";
import XPBar from "../components/XPBar";
import BadgeGrid from "../components/BadgeGrid";
import { useGetProfile } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const BADGE_ICONS: Record<string, string> = {
  "First Step": "👣",
  "Consistency King": "👑",
  "Habit Machine": "⚙️",
  "Century Club": "💯",
  "Level 5 Legend": "🏆",
};

const AI_QUOTES = [
  "Every action is a vote for the person you want to become.",
  "You don't rise to the level of your goals — you fall to the level of your systems.",
  "Discipline is choosing between what you want now and what you want most.",
  "Small habits compound into extraordinary results over time.",
  "The secret to lasting change is making your identity match your goals.",
  "Win the morning, win the day. Show up for today's quests.",
];

const SKILL_BARS = [
  { name: "Discipline", icon: "⚔️", color: "#8b5cf6" },
  { name: "Focus",      icon: "🎯", color: "#3b82f6" },
  { name: "Strength",   icon: "💪", color: "#f59e0b" },
  { name: "Mindset",    icon: "🧠", color: "#10b981" },
];

interface BadgeToast { name: string; icon: string }

export default function Dashboard() {
  const { data: profile } = useGetProfile();
  const queryClient = useQueryClient();
  const [badgeToasts, setBadgeToasts] = useState<BadgeToast[]>([]);
  const [quote] = useState(() => AI_QUOTES[Math.floor(Math.random() * AI_QUOTES.length)]);

  const { data: habits = [], isLoading: habitsLoading } = useGetTodayHabits();
  const { data: stats } = useGetUserStats();
  const isPremium = Boolean(profile?.isPremium);
  const { data: consistency = [] } = useGetConsistency({
    query: { enabled: isPremium, queryKey: getGetConsistencyQueryKey() },
  });

  const completeMutation = useCompleteHabit({
    mutation: {
      onSuccess: (result: CompleteHabitResult) => {
        queryClient.invalidateQueries({ queryKey: getGetTodayHabitsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetConsistencyQueryKey() });
        if (result.newBadges?.length) {
          const toasts = result.newBadges.map((b: { name: string }) => ({ name: b.name, icon: BADGE_ICONS[b.name] ?? "🏅" }));
          setBadgeToasts((prev) => [...prev, ...toasts]);
          setTimeout(() => setBadgeToasts([]), 4000);
        }
      },
    },
  });

  async function handleComplete(id: number) {
    await completeMutation.mutateAsync({ id });
  }

  const completedToday = habits.filter((h: { completedToday: boolean }) => h.completedToday).length;
  const totalToday = habits.length;
  const allDone = totalToday > 0 && completedToday === totalToday;
  const completionPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const weekData = consistency.slice(-7).map((entry: { date: string; completionRate: number }) => ({
    day: new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" }),
    rate: Math.round(entry.completionRate * 100),
    isToday: entry.date === new Date().toISOString().slice(0, 10),
  }));

  const statCards = [
    { label: "Level",       value: stats?.level ?? "–",                        color: "#c4b5fd", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.3)",  icon: "⚡" },
    { label: "Best Streak", value: stats ? `${stats.longestStreak}d` : "–",     color: "#fbbf24", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  icon: "🔥" },
    { label: "Total XP",    value: stats ? stats.xp.toLocaleString() : "–",    color: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  icon: "✦" },
    { label: "Badges",      value: profile?.badges ? String(profile.badges.length) : "–", color: "#f472b6", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.3)", icon: "🏅" },
  ];

  const skillValues = [
    Math.min((stats?.longestStreak ?? 0) * 5, 100),
    Math.min((completedToday / Math.max(totalToday, 1)) * 100, 100),
    Math.min(((stats?.xp ?? 0) / 5000) * 100, 100),
    Math.min(((profile?.badges?.length ?? 0) / 5) * 100, 100),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Badge toasts */}
      <div style={{ position: "fixed", top: 80, right: 20, zIndex: 200, display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence>
          {badgeToasts.map((toast, i) => (
            <motion.div
              key={`${toast.name}-${i}`}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60 }}
              style={{
                background: "rgba(109,40,217,0.2)",
                border: "0.5px solid rgba(139,92,246,0.6)",
                borderRadius: 12,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 0 24px rgba(139,92,246,0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ fontSize: 24 }}>{toast.icon}</span>
              <div>
                <div style={{ fontSize: 10, color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase" }}>Badge Unlocked!</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd" }}>{toast.name}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Greeting + date */}
      <div style={{
        background: "linear-gradient(135deg, rgba(91,33,182,0.2) 0%, rgba(109,40,217,0.1) 100%)",
        border: "0.5px solid rgba(139,92,246,0.3)",
        borderRadius: 14, padding: "20px 24px",
        boxShadow: "0 0 40px rgba(109,40,217,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{today}</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              {allDone
                ? "All quests complete! ⚔️"
                : `Welcome back, ${profile?.username ?? "Adventurer"}`}
            </h1>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(139,92,246,0.08)",
              border: "0.5px solid rgba(139,92,246,0.2)",
              borderRadius: 8, padding: "7px 12px",
            }}>
              <span style={{ fontSize: 12, color: "#a78bfa" }}>🤖 ARIA:</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>"{quote}"</span>
            </div>
          </div>
          {/* Daily progress ring */}
          <div style={{ flexShrink: 0, position: "relative", width: 64, height: 64 }}>
            <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <motion.circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - completionPct / 100)}
                style={{ filter: "drop-shadow(0 0 4px rgba(139,92,246,0.8))" }}
                initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - completionPct / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd" }}>{completionPct}%</span>
              <span style={{ fontSize: 9, color: "var(--text-muted)" }}>today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: card.bg,
              border: `0.5px solid ${card.border}`,
              borderRadius: 12,
              padding: "16px",
              boxShadow: `0 0 20px ${card.bg}`,
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: card.color, lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* XP bar */}
      {stats && (
        <div style={{
          background: "var(--bg-surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 12, padding: "16px 20px",
        }}>
          <XPBar xp={stats.xp} level={stats.level} xpToNextLevel={stats.xpToNextLevel} xpProgress={stats.xpProgress} />
        </div>
      )}

      {/* Main content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Today's quests */}
          <div style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Today's Quests</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{completedToday}/{totalToday} completed</div>
              </div>
              <Link href="/habits">
                <span style={{ fontSize: 12, color: "#a78bfa", cursor: "pointer", transition: "color 0.15s" }}>Manage →</span>
              </Link>
            </div>

            {habitsLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 64, background: "var(--bg-elevated)", border: "0.5px solid var(--border)", borderRadius: 10, opacity: 0.5 }} />
                ))}
              </div>
            ) : habits.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 24px" }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><LogoSVG size={40} /></div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No quests yet</div>
                <Link href="/habits">
                  <span style={{ color: "#a78bfa", fontSize: 13, cursor: "pointer", marginTop: 8, display: "inline-block" }}>
                    Add your first habit →
                  </span>
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} onComplete={handleComplete} />
                ))}
              </div>
            )}
          </div>

          {/* All done banner */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))",
                  border: "0.5px solid rgba(16,185,129,0.4)",
                  borderRadius: 12, padding: "16px 20px",
                  textAlign: "center",
                  boxShadow: "0 0 30px rgba(16,185,129,0.1)",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#34d399" }}>All quests forged for today!</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Return tomorrow to keep your streak alive.</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weekly chart */}
          <div style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, fontWeight: 500 }}>
              Weekly Completion
            </div>
            {weekData.length > 0 ? (
              <ResponsiveContainer width="100%" height={110}>
                <BarChart data={weekData} barSize={18}>
                  <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--bg-elevated)", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "var(--text-primary)" }}
                    formatter={(v: number) => [`${v}%`, "Completion"]}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {weekData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isToday ? "#8b5cf6" : "rgba(139,92,246,0.3)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Complete premium to see analytics</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Skill bars */}
          <div style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, fontWeight: 500 }}>
              Skill Tree
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SKILL_BARS.map((skill, i) => (
                <div key={skill.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                      <span>{skill.icon}</span> {skill.name}
                    </span>
                    <span style={{ fontSize: 11, color: skill.color }}>{Math.round(skillValues[i])}%</span>
                  </div>
                  <div style={{ height: 5, background: "var(--border)", borderRadius: 99 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skillValues[i]}%` }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                      style={{ height: "100%", background: skill.color, borderRadius: 99, boxShadow: `0 0 8px ${skill.color}88` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontWeight: 500 }}>
              Quick Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { href: "/focus", label: "Focus Mode", icon: "⏱", color: "#8b5cf6" },
                { href: "/challenges", label: "Challenges", icon: "⚔️", color: "#f59e0b" },
                { href: "/ai-coach", label: "AI Coach", icon: "🤖", color: "#10b981" },
                { href: "/analytics", label: "Analytics", icon: "📊", color: "#3b82f6" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 10px", borderRadius: 8,
                      background: "var(--bg-elevated)",
                      border: "0.5px solid var(--border)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: item.color, fontWeight: 500 }}>{item.label}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>→</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontWeight: 500 }}>
              Achievements
            </div>
            <BadgeGrid earned={profile?.badges ?? []} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
