import { motion } from "framer-motion";

const quests = [
  { icon: "⚡", label: "Read 30 mins", xp: "+20 XP", done: true },
  { icon: "💧", label: "Drink Water", xp: "+10 XP", done: true },
  { icon: "🏋️", label: "Workout", xp: "+30 XP", done: false },
  { icon: "🧘", label: "Meditate", xp: "+15 XP", done: false },
];

export default function HeroPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        maxWidth: 320,
        background: "rgba(19, 18, 31, 0.9)",
        border: "0.5px solid rgba(127, 119, 221, 0.35)",
        borderRadius: 16,
        padding: "20px 20px 16px",
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 0 0 0.5px rgba(127,119,221,0.15), 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(127,119,221,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(127,119,221,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "#8884a8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
            Today's Quests
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e6f0", letterSpacing: "-0.02em" }}>
            Daily Mission Board
          </div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #7f77dd 0%, #5d56b8 100%)",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.04em",
            boxShadow: "0 0 12px rgba(127,119,221,0.5)",
          }}
        >
          LVL 7
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {quests.map((q, i) => (
          <motion.div
            key={q.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: q.done ? "rgba(127,119,221,0.08)" : "rgba(26,24,48,0.5)",
              border: `0.5px solid ${q.done ? "rgba(127,119,221,0.2)" : "rgba(42,40,64,0.6)"}`,
              borderRadius: 8,
              padding: "9px 12px",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: `1.5px solid ${q.done ? "#7f77dd" : "#2a2840"}`,
                background: q.done ? "#7f77dd" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {q.done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 14 }}>{q.icon}</span>
            <span
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                color: q.done ? "#8884a8" : "#e8e6f0",
                textDecoration: q.done ? "line-through" : "none",
              }}
            >
              {q.label}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: q.done ? "#7f77dd" : "#5a5875",
                background: q.done ? "rgba(127,119,221,0.12)" : "transparent",
                padding: "2px 7px",
                borderRadius: 5,
              }}
            >
              {q.xp}
            </span>
          </motion.div>
        ))}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#8884a8" }}>XP Progress</span>
          <span style={{ fontSize: 11, color: "#7f77dd", fontWeight: 600 }}>1 240 / 2 000 XP</span>
        </div>
        <div
          style={{
            height: 6,
            background: "rgba(42,40,64,0.8)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "62%" }}
            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #5d56b8 0%, #7f77dd 60%, #afa9ec 100%)",
              borderRadius: 3,
              boxShadow: "0 0 8px rgba(127,119,221,0.6)",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {["🔥 4 day streak", "🏆 3 badges"].map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 11,
                color: "#8884a8",
                background: "rgba(42,40,64,0.5)",
                border: "0.5px solid rgba(42,40,64,0.8)",
                borderRadius: 5,
                padding: "3px 8px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
