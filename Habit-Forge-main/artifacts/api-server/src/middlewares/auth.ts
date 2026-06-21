import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: number;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;

  if (!clerkUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUserId));

  if (!user) {
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? `${clerkUserId}@clerk`;
      const username = clerkUser.firstName ?? clerkUser.username ?? "Adventurer";

      [user] = await db
        .insert(usersTable)
        .values({
          clerkId: clerkUserId,
          username,
          email,
          xp: 0,
          level: 1,
          isPremium: false,
          avatar: "🔥",
          badges: [],
        })
        .returning();
    } catch {
      res.status(500).json({ error: "Failed to provision user" });
      return;
    }
  }

  req.userId = user.id;
  next();
}
