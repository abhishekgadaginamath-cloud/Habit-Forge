import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetProfile,
  useGetUserStats,
  useUpdateProfile,
  getGetProfileQueryKey,
  getGetUserStatsQueryKey,
} from "@workspace/api-client-react";
import XPBar from "../components/XPBar";
import BadgeGrid from "../components/BadgeGrid";
import { Pencil, Check, X } from "lucide-react";

const AVATARS = ["🔥", "⚡", "🌟", "💎", "🏆", "🦅", "🐉", "🌊", "🌙", "🎯"];

const S = {
  panel: {
    background: "var(--bg-surface)",
    border: "0.5px solid var(--border)",
    borderRadius: 10,
    padding: 20,
  } as React.CSSProperties,
  sectionLabel: {
    fontSize: 11,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontWeight: 500,
    marginBottom: 14,
  },
};

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetProfile();
  const { data: stats } = useGetUserStats();
  const updateMutation = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
        setEditing(false);
      },
    },
  });

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  function startEdit() {
    setUsername(profile?.username ?? "");
    setAvatar(profile?.avatar ?? "🔥");
    setEditing(true);
  }

  async function saveEdit() {
    await updateMutation.mutateAsync({ data: { username, avatar } });
  }

  if (isLoading || !profile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: 80, ...S.panel, opacity: 0.4 }} />
        ))}
      </div>
    );
  }

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  const statPills = [
    { label: "Habits", value: stats?.totalHabits ?? 0, color: "var(--purple-pale)" },
    { label: "Completions", value: stats?.totalLogs ?? 0, color: "var(--teal)" },
    { label: "Best Streak", value: `${stats?.longestStreak ?? 0}d`, color: "var(--amber)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Hero card */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "0.5px solid var(--border-accent)",
          borderRadius: 10,
          padding: 24,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: "var(--purple-dark)",
              border: "1.5px solid var(--border-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              flexShrink: 0,
            }}
          >
            {editing ? avatar : profile.avatar}
          </motion.div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ maxWidth: 220 }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1.5px solid ${avatar === a ? "var(--purple-mid)" : "var(--border)"}`,
                        background: avatar === a ? "var(--purple-dark)" : "transparent",
                        cursor: "pointer",
                        transform: avatar === a ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{profile.username}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{profile.email}</div>
                {memberSince && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Member since {memberSince}</div>
                )}
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {editing ? (
              <>
                <button
                  onClick={saveEdit}
                  disabled={updateMutation.isPending}
                  style={{ background: "var(--teal-dark)", border: "0.5px solid var(--teal)", borderRadius: 7, padding: 6, cursor: "pointer", color: "var(--teal)" }}
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{ background: "transparent", border: "0.5px solid var(--border)", borderRadius: 7, padding: 6, cursor: "pointer", color: "var(--text-muted)" }}
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <button
                onClick={startEdit}
                style={{ background: "transparent", border: "0.5px solid var(--border)", borderRadius: 7, padding: 6, cursor: "pointer", color: "var(--text-muted)" }}
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Tags row */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <div
            style={{
              background: "var(--purple-dark)",
              border: "0.5px solid var(--border-accent)",
              color: "var(--purple-pale)",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            ⚔️ Warrior · Lv {profile.level}
          </div>
          {profile.isPremium && (
            <div
              style={{
                background: "var(--amber-dark)",
                border: "0.5px solid #854f0b",
                color: "var(--amber)",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              ✨ Premium
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {statPills.map((s) => (
          <div key={s.label} style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* XP progress */}
      {stats && (
        <div style={S.panel}>
          <div style={S.sectionLabel}>Progress</div>
          <XPBar xp={stats.xp} level={stats.level} xpToNextLevel={stats.xpToNextLevel} xpProgress={stats.xpProgress} />
        </div>
      )}

      {/* Badges */}
      <div style={S.panel}>
        <div style={S.sectionLabel}>Achievements</div>
        <BadgeGrid earned={profile.badges ?? []} />
      </div>
    </div>
  );
}
