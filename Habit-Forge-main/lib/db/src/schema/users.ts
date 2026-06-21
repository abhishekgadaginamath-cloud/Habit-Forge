import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const badgeSchema = z.object({
  name: z.string(),
  unlockedAt: z.string(),
});

export type Badge = z.infer<typeof badgeSchema>;

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").unique(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  badges: jsonb("badges").$type<Badge[]>().notNull().default([]),
  isPremium: boolean("is_premium").notNull().default(false),
  avatar: text("avatar").notNull().default("🔥"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
