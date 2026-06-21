import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MODES = [
  { label: "Focus", duration: 25 * 60, color: "#8b5cf6", glow: "rgba(139,92,246,0.5)" },
  { label: "Short Break", duration: 5 * 60, color: "#10b981", glow: "rgba(16,185,129,0.5)" },
  { label: "Long Break", duration: 15 * 60, color: "#3b82f6", glow: "rgba(59,130,246,0.5)" },
];

const AMBIENT = [
  { label: "Deep Space", icon: "🌌", active: false },
  { label: "Lo-fi Rain", icon: "🌧️", active: false },
  { label: "Forest", icon: "🌲", active: false },
  { label: "White Noise", icon: "🌊", active: false },
];

const QUOTES = [
  "Focus is the art of knowing what to ignore.",
  "One habit at a time. One moment at a time.",
  "Discipline is choosing between what you want now and what you want most.",
  "The successful warrior is the average person with laser-like focus.",
  "You don't rise to the level of your goals. You fall to the level of your systems.",
];

export default function FocusMode() {
  const [modeIdx, setModeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mode = MODES[modeIdx];
  const pct = ((mode.duration - timeLeft) / mode.duration) * 100;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const circumference = 2 * Math.PI * 110;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setRunning(false);
            if (modeIdx === 0) setSessions((s) => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, modeIdx]);

  function switchMode(idx: number) {
    setRunning(false);
    setModeIdx(idx);
    setTimeLeft(MODES[idx].duration);
  }

  function toggleRun() { setRunning((r) => !r); }

  function reset() {
    setRunning(false);
    setTimeLeft(mode.duration);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 640, margin: "0 auto" }}>
      <style>{`
        @keyframes focus-breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.04); }
        }
        @keyframes focus-pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 ${mode.glow}; }
          50% { box-shadow: 0 0 0 20px transparent; }
        }
      `}</style>

      {/* Mode selector */}
      <div style={{ display: "flex", gap: 8, background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 12, padding: 6 }}>
        {MODES.map((m, i) => (
          <button
            key={m.label}
            onClick={() => switchMode(i)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.2s",
              background: modeIdx === i ? m.color + "22" : "transparent",
              color: modeIdx === i ? m.color : "var(--text-muted)",
              boxShadow: modeIdx === i ? `0 0 12px ${m.color}44` : "none",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 260, height: 260 }}>
          {/* Background glow */}
          {running && (
            <div style={{
              position: "absolute", inset: -20,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${mode.glow} 0%, transparent 70%)`,
              animation: "focus-breathe 3s ease-in-out infinite",
              pointerEvents: "none",
            }} />
          )}

          <svg width="260" height="260" style={{ transform: "rotate(-90deg)" }}>
            {/* Track */}
            <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            {/* Progress */}
            <motion.circle
              cx="130" cy="130" r="110"
              fill="none"
              stroke={mode.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
              style={{ filter: `drop-shadow(0 0 8px ${mode.color})` }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>

          {/* Time display */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 4,
          }}>
            <div style={{
              fontSize: 56, fontWeight: 200, letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {mins}:{secs}
            </div>
            <div style={{ fontSize: 12, color: mode.color, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {mode.label}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={reset}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--bg-surface)",
              border: "0.5px solid var(--border)",
              color: "var(--text-muted)", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >↺</button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleRun}
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: mode.color,
              border: "none",
              color: "#fff", fontSize: 24, cursor: "pointer",
              boxShadow: `0 0 30px ${mode.glow}, 0 0 60px ${mode.glow}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "box-shadow 0.3s",
            }}
          >
            {running ? "⏸" : "▶"}
          </motion.button>

          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--bg-surface)",
            border: "0.5px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
          }}>
            {sessions}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
          {sessions} session{sessions !== 1 ? "s" : ""} completed today
        </div>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "var(--bg-surface)",
          border: "0.5px solid var(--border-accent)",
          borderRadius: 12,
          padding: "18px 22px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 16, marginBottom: 8 }}>✦</div>
        <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7, fontStyle: "italic" }}>
          "{quote}"
        </div>
      </motion.div>

      {/* Ambient sounds */}
      <div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontWeight: 500 }}>
          Ambient Sounds
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {AMBIENT.map((a) => (
            <motion.button
              key={a.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "var(--bg-surface)",
                border: "0.5px solid var(--border)",
                borderRadius: 10,
                padding: "14px 8px",
                cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6,
                color: "var(--text-muted)",
                fontSize: 12,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <span style={{ fontSize: 11 }}>{a.label}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.5 }}>Coming soon</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Session history visual */}
      <div style={{
        background: "var(--bg-surface)",
        border: "0.5px solid var(--border)",
        borderRadius: 12,
        padding: "16px 20px",
      }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontWeight: 500 }}>
          Today's Sessions
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 28, height: 28, borderRadius: 7,
                background: i < sessions
                  ? mode.color + "33"
                  : "var(--bg-elevated)",
                border: `1px solid ${i < sessions ? mode.color + "66" : "var(--border)"}`,
                boxShadow: i < sessions ? `0 0 8px ${mode.glow}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12,
              }}
            >
              {i < sessions ? "✦" : ""}
            </div>
          ))}
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>
            Goal: 4 focus sessions
          </div>
        </div>
      </div>
    </div>
  );
}
