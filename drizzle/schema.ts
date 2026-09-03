import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  brand: varchar("brand", { length: 120 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  seats: int("seats").notNull(),
  transmission: mysqlEnum("transmission", ["manual", "automatic"]).notNull(),
  fuel: mysqlEnum("fuel", ["petrol", "diesel", "cng", "electric"]).notNull(),
  dailyRate: int("dailyRate").notNull(),
  availability: mysqlEnum("availability", ["available", "unavailable"]).default("available").notNull(),
  featured: boolean("featured").default(false).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const bookingRequests = mysqlTable("bookingRequests", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 24 }).notNull().unique(),
  vehicleId: int("vehicleId").notNull(),
  customerName: varchar("customerName", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 24 }).notNull(),
  pickupDate: varchar("pickupDate", { length: 10 }).notNull(),
  returnDate: varchar("returnDate", { length: 10 }).notNull(),
  pickupTime: varchar("pickupTime", { length: 5 }).notNull(),
  returnTime: varchar("returnTime", { length: 5 }).notNull(),
  pickupLocation: varchar("pickupLocation", { length: 255 }).notNull(),
  tripType: mysqlEnum("tripType", ["self_drive", "with_driver"]).default("self_drive").notNull(),
  notes: text("notes"),
  quotedTotal: int("quotedTotal").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "declined", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;
export type BookingRequest = typeof bookingRequests.$inferSelect;
