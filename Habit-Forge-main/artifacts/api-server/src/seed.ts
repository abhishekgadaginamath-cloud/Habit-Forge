import bcrypt from "bcryptjs";
import { differenceInCalendarDays, startOfDay, subDays } from "date-fns";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function q(sql: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

function calcStreak(lastDate: Date | null, current: number): number {
  if (!lastDate) return 1;
  const diff = differenceInCalendarDays(startOfDay(new Date()), startOfDay(new Date(lastDate)));
  if (diff === 1) return current + 1;
  if (diff === 0) return current;
  return 1;
}
function calcXP(streak: number) { return 10 + Math.min(streak * 2, 50); }
function calcLevel(xp: number) { return Math.floor(Math.sqrt(xp / 50)) + 1; }

async function seed() {
  const existing = await q("SELECT id FROM users WHERE email = $1", ["demo@habitforge.app"]);
  let userId: number;

  if (existing.rows.length > 0) {
    userId = existing.rows[0].id;
    console.log("Demo user exists, resetting data...");
    await q("DELETE FROM logs WHERE user_id = $1", [userId]);
    await q("DELETE FROM habits WHERE user_id = $1", [userId]);
  } else {
    const hash = await bcrypt.hash("demo123", 10);
    const r = await q(
      `INSERT INTO users (username, email, password_hash, xp, level, badges, is_premium, avatar)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      ["DemoUser", "demo@habitforge.app", hash, 0, 1, "[]", true, "🔥"]
    );
    userId = r.rows[0].id;
    console.log("Created demo user:", userId);
  }

  const habitDefs = [
    { name: "Drink Water", icon: "💧", color: "#3b82f6" },
    { name: "Read 30 Mins", icon: "📚", color: "#8b5cf6" },
    { name: "Exercise", icon: "🏃", color: "#10b981" },
    { name: "Meditate", icon: "🧘", color: "#f59e0b" },
  ];

  const habitIds: number[] = [];
  for (const h of habitDefs) {
    const r = await q(
      `INSERT INTO habits (user_id, name, icon, color, frequency, streak, longest_streak)
       VALUES ($1,$2,$3,$4,'daily',0,0) RETURNING id`,
      [userId, h.name, h.icon, h.color]
    );
    habitIds.push(r.rows[0].id);
  }

  let totalXP = 0;
  const streaks = [0, 0, 0, 0];
  const longestStreaks = [0, 0, 0, 0];
  const lastDates: (Date | null)[] = [null, null, null, null];

  for (let d = 89; d >= 0; d--) {
    const date = subDays(new Date(), d);
    for (let h = 0; h < habitIds.length; h++) {
      if (Math.random() > 0.80) continue;
      const ns = calcStreak(lastDates[h], streaks[h]);
      const xp = calcXP(ns);
      totalXP += xp;
      streaks[h] = ns;
      lastDates[h] = date;
      if (ns > longestStreaks[h]) longestStreaks[h] = ns;
      await q(
        `INSERT INTO logs (habit_id, user_id, completed_at, xp_awarded) VALUES ($1,$2,$3,$4)`,
        [habitIds[h], userId, date.toISOString(), xp]
      );
    }
  }

  for (let h = 0; h < habitIds.length; h++) {
    let finalStreak = streaks[h];
    if (lastDates[h]) {
      const diff = differenceInCalendarDays(startOfDay(new Date()), startOfDay(new Date(lastDates[h]!)));
      if (diff > 1) finalStreak = 0;
    }
    await q(
      `UPDATE habits SET streak=$1, longest_streak=$2, last_completed_date=$3 WHERE id=$4`,
      [finalStreak, longestStreaks[h], lastDates[h]?.toISOString() ?? null, habitIds[h]]
    );
  }

  const totalLogs = (await q("SELECT COUNT(*) FROM logs WHERE user_id=$1", [userId])).rows[0].count;
  const level = calcLevel(totalXP);
  const badges: Array<{name:string;unlockedAt:string}> = [];
  if (Number(totalLogs) >= 1) badges.push({ name: "First Step", unlockedAt: new Date(Date.now() - 89 * 86400000).toISOString() });
  if (Math.max(...longestStreaks) >= 7) badges.push({ name: "Consistency King", unlockedAt: new Date(Date.now() - 30 * 86400000).toISOString() });
  if (Math.max(...longestStreaks) >= 30) badges.push({ name: "Habit Machine", unlockedAt: new Date(Date.now() - 5 * 86400000).toISOString() });
  if (Number(totalLogs) >= 100) badges.push({ name: "Century Club", unlockedAt: new Date(Date.now() - 10 * 86400000).toISOString() });
  if (level >= 5) badges.push({ name: "Level 5 Legend", unlockedAt: new Date(Date.now() - 15 * 86400000).toISOString() });

  await q(`UPDATE users SET xp=$1, level=$2, badges=$3 WHERE id=$4`, [totalXP, level, JSON.stringify(badges), userId]);
  console.log(`Seeded! XP: ${totalXP}, Level: ${level}, Logs: ${totalLogs}, Badges: ${badges.map(b=>b.name).join(", ")}`);
  await pool.end();
}

seed().catch(console.error);
