import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoSVG from "../components/Logo";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetHabits,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  getGetHabitsQueryKey,
  getGetTodayHabitsQueryKey,
} from "@workspace/api-client-react";
import type { Habit } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const ICONS = ["💧", "📚", "🏃", "🧘", "🍎", "😴", "💪", "📝", "🎯", "🌿", "☀️", "🎸", "🧹", "🚴", "✍️", "🧠"];
const COLORS = [
  "#534ab7", "#7f77dd", "#3b82f6", "#10b981", "#5dcaa5",
  "#f59e0b", "#ef9f27", "#ec4899", "#ef4444", "#84cc16",
];
const FREQUENCIES = ["daily", "weekly"] as const;

interface HabitForm { name: string; icon: string; color: string; frequency: "daily" | "weekly" }
const defaultForm: HabitForm = { name: "", icon: "💧", color: "#534ab7", frequency: "daily" };

const S = {
  card: {
    background: "var(--bg-surface)",
    border: "0.5px solid var(--border)",
    borderRadius: 10,
    padding: "14px 16px",
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontWeight: 500,
    marginBottom: 8,
  },
  btn: (active: boolean) => ({
    background: active ? "var(--purple-dark)" : "transparent",
    border: `1.5px solid ${active ? "var(--purple-mid)" : "var(--border)"}`,
    color: active ? "var(--purple-pale)" : "var(--text-muted)",
    borderRadius: 8,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.12s",
  } as React.CSSProperties),
};

export default function Habits() {
  const queryClient = useQueryClient();
  const { data: habits = [], isLoading } = useGetHabits();
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState<HabitForm>(defaultForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetTodayHabitsQueryKey() });
  };

  const createMutation = useCreateHabit({ mutation: { onSuccess: () => { invalidate(); setShowForm(false); setForm(defaultForm); } } });
  const updateMutation = useUpdateHabit({ mutation: { onSuccess: () => { invalidate(); setEditHabit(null); setForm(defaultForm); } } });
  const deleteMutation = useDeleteHabit({ mutation: { onSuccess: () => { invalidate(); setDeleteId(null); } } });

  function openEdit(habit: Habit) {
    setEditHabit(habit);
    setForm({ name: habit.name, icon: habit.icon, color: habit.color, frequency: habit.frequency as "daily" | "weekly" });
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editHabit) await updateMutation.mutateAsync({ id: editHabit.id, data: form });
    else await createMutation.mutateAsync({ data: form });
  }

  const isFormOpen = showForm || editHabit !== null;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>My Habits</h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
            {habits.length} habit{habits.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditHabit(null); setForm(defaultForm); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "var(--purple-mid)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          New Habit
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <form
              onSubmit={handleSubmit}
              style={{ background: "var(--bg-elevated)", border: "0.5px solid var(--border-accent)", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--purple-pale)" }}>
                  {editHabit ? "Edit Quest" : "New Quest"}
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditHabit(null); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}
                >
                  <X size={14} />
                </button>
              </div>

              <div>
                <div style={S.label}>Quest Name</div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="e.g. Drink water"
                />
              </div>

              <div>
                <div style={S.label}>Icon</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, icon }))}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1.5px solid ${form.icon === icon ? "var(--purple-mid)" : "var(--border)"}`,
                        background: form.icon === icon ? "var(--purple-dark)" : "transparent",
                        cursor: "pointer",
                        transform: form.icon === icon ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.1s",
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={S.label}>Color</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color }))}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: color,
                        border: `2px solid ${form.color === color ? "var(--text-primary)" : "transparent"}`,
                        cursor: "pointer",
                        transform: form.color === color ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.1s",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div style={S.label}>Frequency</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {FREQUENCIES.map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, frequency: freq }))}
                      style={{ ...S.btn(form.frequency === freq), textTransform: "capitalize", padding: "6px 16px" }}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    background: "var(--purple-mid)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 0",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: isSaving ? 0.5 : 1,
                  }}
                >
                  {isSaving ? "Saving..." : editHabit ? "Save Changes" : "Create Habit"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditHabit(null); }}
                  style={{
                    padding: "10px 18px",
                    background: "transparent",
                    border: "0.5px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habit list */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 68, ...S.card, opacity: 0.4 }} />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 24px", ...S.card }}>
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><LogoSVG size={44} /></div>
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No habits forged yet</div>
        </div>
      ) : (
        <motion.div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {habits.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ display: "flex", alignItems: "center", gap: 14, ...S.card }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9,
                  background: habit.color + "20",
                  border: `0.5px solid ${habit.color}60`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {habit.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {habit.name}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>{habit.frequency}</span>
                  {habit.streak > 0 && (
                    <span style={{ fontSize: 11, color: "var(--amber)" }}>🔥 {habit.streak}</span>
                  )}
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Best: {habit.longestStreak}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => openEdit(habit)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 6, borderRadius: 6 }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(habit.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 6, borderRadius: 6 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,14,23,0.85)",
              backdropFilter: "blur(4px)",
              zIndex: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              style={{ background: "var(--bg-elevated)", border: "0.5px solid var(--border)", borderRadius: 12, padding: 24, maxWidth: 340, width: "100%" }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>Delete habit?</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.6 }}>
                This will also delete all logs. This cannot be undone.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => deleteMutation.mutate({ id: deleteId })}
                  disabled={deleteMutation.isPending}
                  style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: deleteMutation.isPending ? 0.6 : 1 }}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  style={{ flex: 1, background: "transparent", border: "0.5px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
