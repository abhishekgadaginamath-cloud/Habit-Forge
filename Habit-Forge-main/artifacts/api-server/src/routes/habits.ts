import { Router, type IRouter } from "express";
import { db, habitsTable, logsTable, usersTable } from "@workspace/db";
import { eq, and, gte, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { CreateHabitBody, UpdateHabitBody, UpdateHabitParams, DeleteHabitParams, CompleteHabitParams } from "@workspace/api-zod";
import { calculateStreak, calculateXP, calculateLevel, checkBadges, xpToNextLevel } from "../lib/gamification";
import { startOfDay, endOfDay } from "date-fns";
import { formatUser } from "./auth";

const router: IRouter = Router();

function parseId(raw: string | string[]): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  return parseInt(s, 10);
}

router.get("/habits", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const habits = await db
    .select()
    .from(habitsTable)
    .where(eq(habitsTable.userId, req.userId!))
    .orderBy(habitsTable.createdAt);
  res.json(habits);
});

router.get("/habits/today", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const userId = req.userId!;
  const habits = await db
    .select()
    .from(habitsTable)
    .where(eq(habitsTable.userId, userId))
    .orderBy(habitsTable.createdAt);

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todayLogs = await db
    .select()
    .from(logsTable)
    .where(
      and(
        eq(logsTable.userId, userId),
        gte(logsTable.completedAt, todayStart)
      )
    );

  const completedHabitIds = new Set(todayLogs.map((l) => l.habitId));

  const result = habits.map((h) => ({
    ...h,
    completedToday: completedHabitIds.has(h.id),
  }));

  res.json(result);
});

router.post("/habits", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateHabitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [habit] = await db
    .insert(habitsTable)
    .values({
      userId: req.userId!,
      ...parsed.data,
      streak: 0,
      longestStreak: 0,
    })
    .returning();

  res.status(201).json(habit);
});

router.patch("/habits/:id", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateHabitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [habit] = await db
    .update(habitsTable)
    .set(parsed.data)
    .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!)))
    .returning();

  if (!habit) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

  res.json(habit);
});

router.delete("/habits/:id", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const id = parseId(req.params.id);

  const [habit] = await db
    .delete(habitsTable)
    .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!)))
    .returning();

  if (!habit) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/habits/:id/complete", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const userId = req.userId!;
  const id = parseId(req.params.id);

  const [habit] = await db
    .select()
    .from(habitsTable)
    .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, userId)));

  if (!habit) {
    res.status(404).json({ error: "Habit not found" });
    return;
  }

  // Check if already completed today
  const todayStart = startOfDay(new Date());
  const todayLogs = await db
    .select()
    .from(logsTable)
    .where(
      and(
        eq(logsTable.habitId, id),
        eq(logsTable.userId, userId),
        gte(logsTable.completedAt, todayStart)
      )
    );

  if (todayLogs.length > 0) {
    res.status(400).json({ error: "Habit already completed today" });
    return;
  }

  // Calculate new streak
  const newStreak = calculateStreak(habit.lastCompletedDate, habit.streak);
  const xpAwarded = calculateXP(newStreak);
  const newLongestStreak = Math.max(habit.longestStreak, newStreak);

  // Insert log
  await db.insert(logsTable).values({
    habitId: id,
    userId,
    completedAt: new Date(),
    xpAwarded,
  });

  // Update habit
  const [updatedHabit] = await db
    .update(habitsTable)
    .set({
      streak: newStreak,
      longestStreak: newLongestStreak,
      lastCompletedDate: new Date(),
    })
    .where(eq(habitsTable.id, id))
    .returning();

  // Update user XP and level
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const newXP = user.xp + xpAwarded;
  const newLevel = calculateLevel(newXP);

  // Get total log count for badge checks
  const [{ count: totalLogs }] = await db
    .select({ count: count() })
    .from(logsTable)
    .where(eq(logsTable.userId, userId));

  const newBadges = checkBadges(user.badges ?? [], newStreak, Number(totalLogs), newXP);
  const updatedBadges = [...(user.badges ?? []), ...newBadges];

  const [updatedUser] = await db
    .update(usersTable)
    .set({ xp: newXP, level: newLevel, badges: updatedBadges })
    .where(eq(usersTable.id, userId))
    .returning();

  res.json({
    habit: updatedHabit,
    xpAwarded,
    newBadges,
    user: formatUser(updatedUser),
  });
});

export default router;
