import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProfile, useGetUserStats } from "@workspace/api-client-react";

interface Message {
  id: number;
  role: "user" | "coach";
  text: string;
  ts: Date;
}

const COACH_INTROS = [
  "Hey, I'm ARIA — your AI Habit Coach. I've analyzed your progress and I'm ready to help you level up. What's on your mind?",
];

const QUICK_PROMPTS = [
  "How's my progress?",
  "Give me motivation",
  "Suggest a new habit",
  "Why am I slipping?",
  "Best morning routine",
];

const COACH_RESPONSES: Record<string, string[]> = {
  "how's my progress": [
    "You're doing well! Your consistency is building real momentum. The key now is protecting your streak — don't let perfect be the enemy of good. Even 80% completion beats 0%.",
    "Your habit data shows consistent effort. The secret to long-term success isn't intensity — it's sustainability. Keep showing up, even on hard days.",
  ],
  "motivation": [
    "Remember: you're not trying to be perfect. You're trying to be better than yesterday. Every habit you complete is a vote for the person you're becoming. Cast that vote today.",
    "\"We are what we repeatedly do. Excellence, therefore, is not an act but a habit.\" — Aristotle. Your streak isn't just a number — it's proof that discipline is building inside you.",
  ],
  "new habit": [
    "Based on your current habits, I'd suggest adding a 5-minute journaling practice at night. It closes your day with intention, processes emotions, and builds self-awareness — all critical for long-term growth.",
    "Consider adding a 10-minute daily walk after meals. It improves digestion, reduces blood sugar spikes, boosts mood, and takes almost zero willpower. The best habits are the ones that feel almost too easy.",
  ],
  "slipping": [
    "Missing habits is information, not failure. Ask yourself: Is this habit too hard? Too unclear? Happening at the wrong time? Often a tiny tweak — doing half the habit, or at a different moment — is all that's needed.",
    "Slipping happens to everyone. The research shows it takes missing a habit twice in a row to break a pattern. One miss is allowed. Two is a warning. Three is a new normal. Get back today.",
  ],
  "morning routine": [
    "The elite morning routine: ① Wake up same time daily ② 5 min no phone ③ Hydrate (500ml water) ④ 10 min movement ⑤ 10 min focus/clarity (journal or meditation). That's it. 25 minutes to own your day.",
    "Your morning sets your body's cortisol rhythm for the whole day. Try: wake early, get natural light in eyes, move your body, eat protein. This combo maximizes energy, focus, and mood for 12+ hours.",
  ],
  "default": [
    "That's a great question. Based on habit science, the most important factor isn't willpower — it's environment design. Make the behavior obvious, attractive, easy, and satisfying. What specific habit are you struggling with?",
    "I love your curiosity. The research shows that asking questions about your habits is itself a predictor of long-term success. Keep reflecting. What area of your life are you most focused on improving right now?",
  ],
};

function getCoachReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, responses] of Object.entries(COACH_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return COACH_RESPONSES.default[Math.floor(Math.random() * COACH_RESPONSES.default.length)];
}

let msgId = 0;

export default function AICoach() {
  const { data: profile } = useGetProfile();
  const { data: stats } = useGetUserStats();
  const [messages, setMessages] = useState<Message[]>([
    { id: msgId++, role: "coach", text: COACH_INTROS[0], ts: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: msgId++, role: "user", text: text.trim(), ts: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    setTyping(false);
    const reply = getCoachReply(text);
    setMessages((m) => [...m, { id: msgId++, role: "coach", text: reply, ts: new Date() }]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", maxWidth: 720, margin: "0 auto" }}>
      {/* Coach header */}
      <div style={{
        background: "var(--bg-surface)",
        border: "0.5px solid var(--border-accent)",
        borderRadius: 12, padding: "16px 20px",
        display: "flex", gap: 14, alignItems: "center",
        marginBottom: 16,
        boxShadow: "0 0 30px rgba(139,92,246,0.08)",
      }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #4c1d95, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, boxShadow: "0 0 20px rgba(139,92,246,0.5)",
          }}>
            🤖
          </div>
          <div style={{
            position: "absolute", bottom: -2, right: -2,
            width: 12, height: 12, borderRadius: "50%",
            background: "#10b981", border: "2px solid var(--bg-surface)",
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#c4b5fd" }}>ARIA</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>AI Habit Coach · Always online</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Your stats</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>
            Lv {profile?.level ?? 1} · {(stats?.xp ?? 0).toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 12,
        marginBottom: 16,
        paddingRight: 4,
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              {msg.role === "coach" && (
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: "linear-gradient(135deg, #4c1d95, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13,
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: "72%",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #5b21b6, #7c3aed)"
                  : "var(--bg-surface)",
                border: msg.role === "user"
                  ? "none"
                  : "0.5px solid var(--border)",
                borderRadius: msg.role === "user"
                  ? "14px 14px 4px 14px"
                  : "14px 14px 14px 4px",
                padding: "12px 16px",
                boxShadow: msg.role === "user"
                  ? "0 0 20px rgba(139,92,246,0.3)"
                  : "none",
              }}>
                <div style={{
                  fontSize: 13, lineHeight: 1.7,
                  color: msg.role === "user" ? "#f0e9ff" : "var(--text-primary)",
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: 10, color: msg.role === "user" ? "rgba(240,233,255,0.5)" : "var(--text-muted)",
                  marginTop: 4,
                }}>
                  {msg.ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: 10, alignItems: "flex-end" }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, #4c1d95, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
            }}>🤖</div>
            <div style={{
              background: "var(--bg-surface)", border: "0.5px solid var(--border)",
              borderRadius: "14px 14px 14px 4px",
              padding: "12px 16px",
              display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6" }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {QUICK_PROMPTS.map((p) => (
          <motion.button
            key={p}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => send(p)}
            disabled={typing}
            style={{
              padding: "6px 12px",
              background: "rgba(139,92,246,0.1)",
              border: "0.5px solid rgba(139,92,246,0.35)",
              borderRadius: 99,
              color: "#c4b5fd", fontSize: 11, cursor: "pointer",
              transition: "all 0.15s",
              opacity: typing ? 0.5 : 1,
            }}
          >
            {p}
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Ask ARIA anything about your habits..."
          disabled={typing}
          style={{
            flex: 1,
            background: "var(--bg-surface)",
            border: "0.5px solid rgba(139,92,246,0.4)",
            borderRadius: 12,
            padding: "13px 16px",
            fontSize: 13,
            color: "var(--text-primary)",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => send(input)}
          disabled={typing || !input.trim()}
          style={{
            width: 46, height: 46, borderRadius: 12,
            background: input.trim() && !typing ? "linear-gradient(135deg, #5b21b6, #7c3aed)" : "var(--bg-surface)",
            border: "none", cursor: input.trim() && !typing ? "pointer" : "default",
            color: input.trim() && !typing ? "#fff" : "var(--text-muted)",
            fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: input.trim() && !typing ? "0 0 20px rgba(139,92,246,0.4)" : "none",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          ↑
        </motion.button>
      </div>
    </div>
  );
}
