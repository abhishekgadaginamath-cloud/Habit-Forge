import { differenceInCalendarDays, startOfDay } from "date-fns";
import type { Badge } from "@workspace/db";

export function calculateStreak(lastCompletedDate: Date | null, currentStreak: number): number {
  const today = startOfDay(new Date());
  const last = lastCompletedDate ? startOfDay(new Date(lastCompletedDate)) : null;

  if (!last) return 1;
  const diffDays = differenceInCalendarDays(today, last);

  if (diffDays === 1) return currentStreak + 1;
  if (diffDays === 0) return currentStreak;
  return 1;
}

export function calculateXP(streak: number): number {
  return 10 + Math.min(streak * 2, 50);
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 50;
}

export function xpToNextLevel(level: number, currentXP: number): { needed: number; progress: number } {
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const rangeXP = nextLevelXP - currentLevelXP;
  const earnedInLevel = currentXP - currentLevelXP;
  return {
    needed: rangeXP,
    progress: Math.min(earnedInLevel / rangeXP, 1),
  };
}

export function checkBadges(
  existingBadges: Badge[],
  streak: number,
  totalHabitsCompleted: number,
  totalXP: number
): Badge[] {
  const newBadges: Badge[] = [];
  const existing = existingBadges.map((b) => b.name);

  const rules: Array<{ name: string; condition: boolean }> = [
    { name: "First Step", condition: totalHabitsCompleted >= 1 },
    { name: "Consistency King", condition: streak >= 7 },
    { name: "Habit Machine", condition: streak >= 30 },
    { name: "Century Club", condition: totalHabitsCompleted >= 100 },
    { name: "Level 5 Legend", condition: calculateLevel(totalXP) >= 5 },
  ];

  for (const rule of rules) {
    if (rule.condition && !existing.includes(rule.name)) {
      newBadges.push({ name: rule.name, unlockedAt: new Date().toISOString() });
    }
  }

  return newBadges;
}
