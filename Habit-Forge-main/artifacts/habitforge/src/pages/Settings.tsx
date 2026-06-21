import { useState } from "react";
import { motion } from "framer-motion";
import { useGetProfile, useUpdateProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/react";

const THEMES = [
  { id: "neon-purple", label: "Neon Purple", color: "#8b5cf6", active: true },
  { id: "cyber-blue", label: "Cyber Blue", color: "#3b82f6", active: false },
  { id: "dark-gold", label: "Dark Gold", color: "#f59e0b", active: false },
  { id: "matrix-green", label: "Matrix Green", color: "#10b981", active: false },
];

const NOTIFICATION_ITEMS = [
  { id: "daily-reminder", label: "Daily Habit Reminder", desc: "Get reminded at your set time each day", default: true },
  { id: "streak-warning", label: "Streak Warning", desc: "Alert when your streak is at risk", default: true },
  { id: "badge-unlocked", label: "Badge Unlocked", desc: "Celebrate when you earn a new achievement", default: true },
  { id: "weekly-summary", label: "Weekly Summary", desc: "Your performance report every Sunday", default: false },
  { id: "ai-tips", label: "AI Coaching Tips", desc: "Smart insights from your habit data", default: false },
];

export default function Settings() {
  const qc = useQueryClient();
  const { data: profile } = useGetProfile();
  const { signOut } = useClerk();
  const updateMutation = useUpdateProfile({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetProfileQueryKey() }),
    },
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_ITEMS.map((n) => [n.id, n.default]))
  );
  const [reminderTime, setReminderTime] = useState("07:00");
  const [saved, setSaved] = useState(false);

  async function saveNotifications() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const S = {
    section: {
      background: "var(--bg-surface)",
      border: "0.5px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
    } as React.CSSProperties,
    header: {
      padding: "16px 20px",
      borderBottom: "0.5px solid var(--border)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--text-primary)",
    } as React.CSSProperties,
    row: {
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      padding: "14px 20px",
      borderBottom: "0.5px solid var(--border)",
    } as React.CSSProperties,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 620 }}>

      {/* Profile settings */}
      <div style={S.section}>
        <div style={S.header}>👤 Profile</div>
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "var(--purple-dark)", border: "1.5px solid var(--border-accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}>
              {profile?.avatar ?? "🔥"}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                {profile?.username ?? "Adventurer"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{profile?.email}</div>
              <div style={{ fontSize: 11, color: "#a78bfa", marginTop: 2 }}>
                Level {profile?.level ?? 1} · {profile?.isPremium ? "✨ Premium" : "Free Plan"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={S.section}>
        <div style={S.header}>🔔 Notifications</div>
        {NOTIFICATION_ITEMS.map((item, i) => (
          <div key={item.id} style={{ ...S.row, borderBottom: i < NOTIFICATION_ITEMS.length - 1 ? "0.5px solid var(--border)" : "none" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle
              value={notifications[item.id]}
              onChange={(v) => setNotifications((n) => ({ ...n, [item.id]: v }))}
            />
          </div>
        ))}
        <div style={{ padding: "14px 20px", borderTop: "0.5px solid var(--border)", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>Daily Reminder Time</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>When to nudge you about your habits</div>
          </div>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            style={{
              background: "var(--bg-elevated)",
              border: "0.5px solid var(--border)",
              borderRadius: 8, padding: "7px 12px",
              color: "var(--text-primary)", fontSize: 13,
            }}
          />
        </div>
        <div style={{ padding: "12px 20px" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveNotifications}
            style={{
              width: "100%", padding: "10px",
              background: saved ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.2)",
              border: `0.5px solid ${saved ? "rgba(16,185,129,0.5)" : "rgba(139,92,246,0.5)"}`,
              borderRadius: 9, cursor: "pointer",
              color: saved ? "#34d399" : "#c4b5fd",
              fontSize: 13, fontWeight: 600,
              transition: "all 0.3s",
            }}
          >
            {saved ? "✓ Saved!" : "Save Notification Settings"}
          </motion.button>
        </div>
      </div>

      {/* Theme */}
      <div style={S.section}>
        <div style={S.header}>🎨 Theme</div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {THEMES.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ scale: 1.02 }}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: `1.5px solid ${t.active ? t.color : "var(--border)"}`,
                background: t.active ? t.color + "15" : "transparent",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                boxShadow: t.active ? `0 0 16px ${t.color}30` : "none",
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.active ? t.color : "var(--text-muted)" }}>{t.label}</div>
                {t.active && <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Active</div>}
              </div>
              {!t.active && (
                <div style={{
                  marginLeft: "auto", fontSize: 10, color: "#f59e0b",
                  background: "rgba(245,158,11,0.15)", padding: "2px 6px", borderRadius: 99,
                }}>
                  Soon
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Privacy & Data */}
      <div style={S.section}>
        <div style={S.header}>🔒 Privacy & Data</div>
        {[
          { label: "Export my data", desc: "Download all your habit data as JSON", action: "Export", color: "#8b5cf6" },
          { label: "Delete all data", desc: "Permanently delete all habits and logs", action: "Delete", color: "#ef4444" },
        ].map((item, i) => (
          <div key={item.label} style={{ ...S.row, borderBottom: i === 0 ? "0.5px solid var(--border)" : "none" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</div>
            </div>
            <button style={{
              padding: "7px 14px", borderRadius: 8, cursor: "pointer",
              background: "transparent",
              border: `0.5px solid ${item.color}55`,
              color: item.color, fontSize: 12, fontWeight: 600,
            }}>
              {item.action}
            </button>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => signOut()}
        style={{
          padding: "13px",
          background: "transparent",
          border: "0.5px solid rgba(239,68,68,0.4)",
          borderRadius: 12,
          color: "#f87171", fontSize: 13, fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Sign Out
      </motion.button>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: value ? "rgba(139,92,246,0.8)" : "var(--bg-elevated)",
        border: `1px solid ${value ? "rgba(139,92,246,0.9)" : "var(--border)"}`,
        cursor: "pointer", position: "relative",
        padding: 0, flexShrink: 0,
        boxShadow: value ? "0 0 12px rgba(139,92,246,0.4)" : "none",
        transition: "all 0.2s",
      }}
    >
      <motion.div
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff",
          position: "absolute", top: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </motion.button>
  );
}
