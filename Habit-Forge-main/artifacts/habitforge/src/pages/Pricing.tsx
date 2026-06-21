import { motion } from "framer-motion";
import { useGetProfile } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Check } from "lucide-react";

const FREE_FEATURES = [
  "Up to 5 habits",
  "Daily habit tracking",
  "Basic XP & levels",
  "3 badge achievements",
  "7-day streak tracking",
];

const PRO_FEATURES = [
  "Unlimited habits",
  "Advanced analytics & heatmaps",
  "AI Habit Coach (ARIA)",
  "All challenges + leaderboards",
  "Unlimited badge achievements",
  "Focus Mode + ambient sounds",
  "Custom themes",
  "Cloud backup & export",
  "Priority support",
];

const ELITE_FEATURES = [
  "Everything in Pro",
  "Personalized AI routines",
  "AI behavior analysis",
  "Custom challenge creation",
  "Social habit sharing",
  "Early access features",
  "1-on-1 onboarding call",
];

export default function Pricing() {
  const { data: profile } = useGetProfile();
  const isPremium = Boolean(profile?.isPremium);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 99,
          background: "rgba(139,92,246,0.12)",
          border: "0.5px solid rgba(139,92,246,0.35)",
          fontSize: 11, color: "#c4b5fd", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 16,
        }}>
          ✦ Upgrade Your Arsenal
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Choose Your{" "}
          <span style={{
            backgroundImage: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Power Level
          </span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>
          Start free. Upgrade when you're ready to go elite.
        </p>
      </div>

      {/* Plans */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>

        {/* Free */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "var(--bg-surface)",
            border: "0.5px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            display: "flex", flexDirection: "column", gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Free
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)" }}>$0</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>/ month</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Get started, no credit card needed</div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {FREE_FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Check size={13} color="#8b5cf6" />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{f}</span>
              </div>
            ))}
          </div>

          <Link href="/dashboard">
            <button style={{
              width: "100%", padding: "12px",
              background: "transparent",
              border: "0.5px solid var(--border)",
              borderRadius: 10, cursor: "pointer",
              color: "var(--text-muted)", fontSize: 13, fontWeight: 600,
            }}>
              Current Plan
            </button>
          </Link>
        </motion.div>

        {/* Pro — highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "linear-gradient(160deg, rgba(91,33,182,0.25) 0%, rgba(109,40,217,0.15) 100%)",
            border: "1.5px solid rgba(139,92,246,0.6)",
            borderRadius: 16,
            padding: 24,
            display: "flex", flexDirection: "column", gap: 20,
            position: "relative",
            boxShadow: "0 0 60px rgba(139,92,246,0.2), 0 0 0 1px rgba(139,92,246,0.1)",
          }}
        >
          <div style={{
            position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(90deg, #7c3aed, #a855f7)",
            padding: "4px 16px", borderRadius: 99,
            fontSize: 11, fontWeight: 700, color: "#fff",
            whiteSpace: "nowrap",
            boxShadow: "0 0 20px rgba(139,92,246,0.5)",
          }}>
            ✦ Most Popular
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Pro
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)" }}>$9</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>/ month</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Everything you need to forge elite habits</div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {PRO_FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Check size={13} color="#a855f7" />
                <span style={{ fontSize: 12, color: "var(--text-primary)" }}>{f}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(139,92,246,0.6)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", padding: "13px",
              background: isPremium ? "transparent" : "linear-gradient(135deg, #5b21b6, #7c3aed, #a855f7)",
              border: isPremium ? "0.5px solid var(--border)" : "none",
              borderRadius: 10, cursor: "pointer",
              color: isPremium ? "var(--text-muted)" : "#fff",
              fontSize: 13, fontWeight: 700,
              boxShadow: isPremium ? "none" : "0 0 24px rgba(139,92,246,0.4)",
              transition: "all 0.25s",
              letterSpacing: "0.05em",
            }}
          >
            {isPremium ? "Current Plan ✓" : "Upgrade to Pro →"}
          </motion.button>
        </motion.div>

        {/* Elite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "linear-gradient(160deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.08) 100%)",
            border: "0.5px solid rgba(236,72,153,0.4)",
            borderRadius: 16,
            padding: 24,
            display: "flex", flexDirection: "column", gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f9a8d4", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Elite
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)" }}>$19</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>/ month</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>For those who demand the absolute best</div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {ELITE_FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Check size={13} color="#ec4899" />
                <span style={{ fontSize: 12, color: "var(--text-primary)" }}>{f}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", padding: "12px",
              background: "rgba(236,72,153,0.15)",
              border: "0.5px solid rgba(236,72,153,0.5)",
              borderRadius: 10, cursor: "pointer",
              color: "#f9a8d4", fontSize: 13, fontWeight: 700,
              transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(236,72,153,0.15)",
            }}
          >
            Get Elite →
          </motion.button>
        </motion.div>
      </div>

      {/* FAQ / Trust */}
      <div style={{
        background: "var(--bg-surface)",
        border: "0.5px solid var(--border)",
        borderRadius: 14, padding: "24px 28px",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
      }}>
        {[
          { icon: "🔒", title: "No contracts", desc: "Cancel anytime. No questions asked." },
          { icon: "⚡", title: "Instant access", desc: "Upgrade and unlock everything immediately." },
          { icon: "🛡️", title: "Secure payments", desc: "Payments protected by industry-standard encryption." },
        ].map((item) => (
          <div key={item.title} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
