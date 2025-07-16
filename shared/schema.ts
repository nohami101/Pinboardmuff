import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const photos = pgTable("photos", {
  id: text("id").primaryKey(),
  unsplashId: text("unsplash_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  smallUrl: text("small_url").notNull(),
  photographer: text("photographer").notNull(),
  photographerUrl: text("photographer_url"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  downloadUrl: text("download_url"),
});

export const collections = pgTable("collections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  photoIds: text("photo_ids").array().notNull().default([]),
});

export const insertPhotoSchema = createInsertSchema(photos);
export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  createdAt: true,
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

// Frontend-only types for local storage
export type LocalCollection = {
  id: string;
  name: string;
  description?: string;
  photos: Photo[];
  createdAt: string;
};
