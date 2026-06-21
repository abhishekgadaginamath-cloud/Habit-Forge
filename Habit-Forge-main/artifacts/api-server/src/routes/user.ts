import { Router, type IRouter } from "express";
import { db, usersTable, habitsTable, logsTable } from "@workspace/db";
import { eq, max } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { UpdateProfileBody } from "@workspace/api-zod";
import { calculateLevel, xpToNextLevel } from "../lib/gamification";
import { formatUser } from "./auth";

const router: IRouter = Router();

router.get("/user/profile", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(formatUser(user));
});

router.patch("/user/profile", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, req.userId!))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(formatUser(user));
});

router.get("/user/stats", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const userId = req.userId!;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, userId));
  const totalHabits = habits.length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  const allLogs = await db.select().from(logsTable).where(eq(logsTable.userId, userId));
  const totalLogs = allLogs.length;

  const level = calculateLevel(user.xp);
  const { needed, progress } = xpToNextLevel(level, user.xp);

  res.json({
    totalHabits,
    totalLogs,
    longestStreak,
    xp: user.xp,
    level,
    xpToNextLevel: needed,
    xpProgress: progress,
  });
});

export default router;
