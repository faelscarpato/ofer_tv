import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  priceFrom: numeric("price_from"),
  priceTo: numeric("price_to").notNull().default("0"),
  imageUrl: text("image_url").notNull().default(""),
  radioTrack: text("radio_track").notNull().default(""),
  status: text("status").notNull().default("draft"),
  position: integer("position").notNull().default(0),
  duration: integer("duration").notNull().default(8),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Offer = typeof offers.$inferSelect
export type NewOffer = typeof offers.$inferInsert
