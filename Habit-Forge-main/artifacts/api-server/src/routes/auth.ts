import type { User } from "@workspace/db";
import { usersTable } from "@workspace/db";

export function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    xp: user.xp,
    level: user.level,
    isPremium: user.isPremium,
    avatar: user.avatar,
    badges: user.badges ?? [],
    createdAt: user.createdAt,
  };
}

export type { User };
