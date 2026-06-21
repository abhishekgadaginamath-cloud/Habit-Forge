import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { useGetProfile, useGetUserStats } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const NAV_MAIN = [
  { path: "/dashboard",  label: "Dashboard",  icon: "🗡️" },
  { path: "/habits",     label: "My Habits",  icon: "📋" },
  { path: "/analytics",  label: "Analytics",  icon: "📊" },
  { path: "/calendar",   label: "Calendar",   icon: "📅" },
];

const NAV_TOOLS = [
  { path: "/focus",      label: "Focus Mode", icon: "⏱" },
  { path: "/challenges", label: "Challenges", icon: "⚔️" },
  { path: "/ai-coach",   label: "AI Coach",   icon: "🤖" },
];

const NAV_ACCOUNT = [
  { path: "/profile",  label: "Profile",  icon: "👤" },
  { path: "/pricing",  label: "Upgrade",  icon: "✨" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard":  { title: "Quest Log",      sub: "Your daily missions"      },
  "/habits":     { title: "My Habits",      sub: "Forge your disciplines"   },
  "/analytics":  { title: "Analytics",      sub: "Your battle statistics"   },
  "/profile":    { title: "Hero Profile",   sub: "Your legend"              },
  "/calendar":   { title: "Calendar",       sub: "Your streak history"      },
  "/focus":      { title: "Focus Mode",     sub: "Deep work sessions"       },
  "/challenges": { title: "Challenges",     sub: "Compete and conquer"      },
  "/ai-coach":   { title: "AI Coach",       sub: "ARIA — your habit guide"  },
  "/settings":   { title: "Settings",       sub: "Manage your account"      },
  "/pricing":    { title: "Upgrade",        sub: "Unlock premium features"  },
};

function xpToNextLevel(level: number) {
  return Math.pow(level, 2) * 50;
}

function NavItem({ path, label, icon }: { path: string; label: string; icon: string }) {
  const [location] = useLocation();
  const active = location.startsWith(path);

  return (
    <Link href={path}>
      <motion.div
        whileHover={{ x: 2 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "8px 12px",
          borderRadius: 8,
          marginBottom: 1,
          cursor: "pointer",
          color: active ? "#c4b5fd" : "var(--text-muted)",
          background: active ? "rgba(139,92,246,0.12)" : "transparent",
          borderLeft: `2px solid ${active ? "#8b5cf6" : "transparent"}`,
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          transition: "all 0.12s",
          boxShadow: active ? "inset 0 0 20px rgba(139,92,246,0.06)" : "none",
        }}
      >
        <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
        {label}
        {active && (
          <motion.div
            layoutId="nav-active-dot"
            style={{
              marginLeft: "auto",
              width: 5, height: 5, borderRadius: "50%",
              background: "#8b5cf6",
              boxShadow: "0 0 6px rgba(139,92,246,0.8)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const [location] = useLocation();
  const { data: stats } = useGetUserStats();
  const { data: profile } = useGetProfile();

  const displayName =
    profile?.username || clerkUser?.firstName || clerkUser?.username || "Adventurer";
  const avatar = profile?.avatar ?? "🔥";

  const pageInfo = PAGE_TITLES[location] ?? { title: "HabitForge", sub: "" };
  const level = stats?.level ?? profile?.level ?? 1;
  const xp = stats?.xp ?? profile?.xp ?? 0;
  const streak = stats?.longestStreak ?? 0;
  const nextLevelXP = xpToNextLevel(level + 1);
  const thisLevelXP = xpToNextLevel(level);
  const progressPct = Math.min(((xp - thisLevelXP) / (nextLevelXP - thisLevelXP)) * 100, 100);
  const isPremium = Boolean(profile?.isPremium);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 224,
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderRight: "0.5px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Logo size={26} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#c4b5fd", letterSpacing: "-0.01em" }}>
                HabitForge
              </div>
              <div style={{ fontSize: 10, color: "var(--purple-mid)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 1 }}>
                {isPremium ? "✨ Premium" : "Free Plan"}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 8px 6px", fontWeight: 600 }}>
            Core
          </div>
          {NAV_MAIN.map((item) => <NavItem key={item.path} {...item} />)}

          <div style={{ height: 1, background: "var(--border)", margin: "10px 4px" }} />

          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 8px 6px", fontWeight: 600 }}>
            Tools
          </div>
          {NAV_TOOLS.map((item) => <NavItem key={item.path} {...item} />)}

          <div style={{ height: 1, background: "var(--border)", margin: "10px 4px" }} />

          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 8px 6px", fontWeight: 600 }}>
            Account
          </div>
          {NAV_ACCOUNT.map((item) => <NavItem key={item.path} {...item} />)}
        </nav>

        {/* Player card */}
        <div style={{ padding: "12px", borderTop: "0.5px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg, rgba(91,33,182,0.8), rgba(109,40,217,0.6))",
              border: "1.5px solid rgba(139,92,246,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
              boxShadow: "0 0 12px rgba(139,92,246,0.3)",
            }}>
              {avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {displayName}
              </div>
              <div style={{ fontSize: 10, color: "#a78bfa" }}>
                Warrior · Lv {level}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              title="Sign out"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 14, padding: 2, flexShrink: 0, opacity: 0.7 }}
            >
              ↩
            </button>
          </div>
          {/* XP bar */}
          <div style={{ fontSize: 10, color: "#a78bfa", marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
            <span>{xp.toLocaleString()} XP</span>
            <span style={{ color: "var(--text-muted)" }}>Lv {level + 1}</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", background: "linear-gradient(to right, #5b21b6, #8b5cf6)", borderRadius: 99 }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 224 }}>
        {/* Topbar */}
        <header style={{
          background: "var(--bg-surface)",
          borderBottom: "0.5px solid var(--border)",
          padding: "13px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{pageInfo.title}</div>
            {pageInfo.sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{pageInfo.sub}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {streak > 0 && (
              <div style={{
                background: "rgba(245,158,11,0.1)",
                border: "0.5px solid rgba(245,158,11,0.35)",
                color: "#fbbf24",
                borderRadius: 20, padding: "4px 12px",
                fontSize: 12, fontWeight: 600,
              }}>
                🔥 {streak}-day streak
              </div>
            )}
            {!isPremium && (
              <Link href="/pricing">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: "linear-gradient(135deg, rgba(91,33,182,0.3), rgba(168,85,247,0.2))",
                    border: "0.5px solid rgba(139,92,246,0.5)",
                    color: "#c4b5fd",
                    borderRadius: 20, padding: "4px 12px",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    boxShadow: "0 0 12px rgba(139,92,246,0.2)",
                  }}
                >
                  ✦ Upgrade
                </motion.div>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
