import { Router, type IRouter } from "express";
import { db, logsTable, habitsTable, usersTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { subDays, startOfDay, format } from "date-fns";

const router: IRouter = Router();

router.get("/analytics/heatmap", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const userId = req.userId!;

  // Check premium
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user?.isPremium) {
    res.status(403).json({ error: "Premium required" });
    return;
  }

  const since = subDays(startOfDay(new Date()), 364);

  const rows = await db
    .select({
      date: sql<string>`DATE(${logsTable.completedAt} AT TIME ZONE 'UTC')`.as("date"),
      count: sql<number>`COUNT(*)::int`.as("count"),
    })
    .from(logsTable)
    .where(and(eq(logsTable.userId, userId), gte(logsTable.completedAt, since)))
    .groupBy(sql`DATE(${logsTable.completedAt} AT TIME ZONE 'UTC')`)
    .orderBy(sql`DATE(${logsTable.completedAt} AT TIME ZONE 'UTC')`);

  res.json(rows);
});

router.get("/analytics/consistency", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const userId = req.userId!;

  // Check premium
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user?.isPremium) {
    res.status(403).json({ error: "Premium required" });
    return;
  }

  const totalHabits = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(habitsTable)
    .where(eq(habitsTable.userId, userId));

  const habitCount = Number(totalHabits[0]?.count ?? 0);
  if (habitCount === 0) {
    res.json([]);
    return;
  }

  const since = subDays(startOfDay(new Date()), 29);

  const rows = await db
    .select({
      date: sql<string>`DATE(${logsTable.completedAt} AT TIME ZONE 'UTC')`.as("date"),
      completed: sql<number>`COUNT(*)::int`.as("completed"),
    })
    .from(logsTable)
    .where(and(eq(logsTable.userId, userId), gte(logsTable.completedAt, since)))
    .groupBy(sql`DATE(${logsTable.completedAt} AT TIME ZONE 'UTC')`)
    .orderBy(sql`DATE(${logsTable.completedAt} AT TIME ZONE 'UTC')`);

  // Build 30-day array with 0 for missing days
  const result = [];
  for (let i = 29; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, "yyyy-MM-dd");
    const row = rows.find((r) => r.date === dateStr);
    const completed = row ? Number(row.completed) : 0;
    result.push({
      date: dateStr,
      completed,
      total: habitCount,
      completionRate: habitCount > 0 ? completed / habitCount : 0,
    });
  }

  res.json(result);
});

export default router;
