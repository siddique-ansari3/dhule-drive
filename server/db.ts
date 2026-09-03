import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

import { DEFAULT_DHULE_FLEET } from "../shared/rental";
import { calculateRentalDays } from "../shared/rental-utils";
import { bookingRequests, type InsertUser, type InsertVehicle, users, vehicles } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach((field) => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.role = user.openId === ENV.ownerOpenId ? "admin" : user.role ?? "user";
  updateSet.role = values.role;

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

async function ensureFleetSeeded() {
  const db = await getDb();
  if (!db) return false;
  const existing = await db.select({ id: vehicles.id }).from(vehicles).limit(1);
  if (existing.length === 0) await db.insert(vehicles).values(DEFAULT_DHULE_FLEET);
  return true;
}

export async function listVehicles() {
  const seeded = await ensureFleetSeeded();
  const db = await getDb();
  if (!seeded || !db) return [];
  return db.select().from(vehicles).orderBy(desc(vehicles.featured), vehicles.dailyRate);
}

export async function getVehicle(vehicleId: number) {
  await ensureFleetSeeded();
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);
  return result[0];
}

type CreateBookingInput = {
  vehicleId: number;
  customerName: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  tripType: "self_drive" | "with_driver";
  notes?: string;
};

export async function createBookingRequest(input: CreateBookingInput) {
  const db = await getDb();
  if (!db) throw new Error("Booking service is not available yet. Please try again shortly.");
  const vehicle = await getVehicle(input.vehicleId);
  if (!vehicle || vehicle.availability !== "available") throw new Error("This vehicle is not currently available.");

  const rentalDays = calculateRentalDays(input.pickupDate, input.returnDate);
  if (!rentalDays) throw new Error("Return date must be on or after the pickup date.");

  const reference = `DD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const quotedTotal = rentalDays * vehicle.dailyRate;
  await db.insert(bookingRequests).values({ ...input, reference, quotedTotal, status: "pending" });
  return { reference, quotedTotal, rentalDays, vehicleName: `${vehicle.brand} ${vehicle.name}` };
}

export async function getAdminBookings() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: bookingRequests.id,
      reference: bookingRequests.reference,
      customerName: bookingRequests.customerName,
      phone: bookingRequests.phone,
      pickupDate: bookingRequests.pickupDate,
      returnDate: bookingRequests.returnDate,
      pickupTime: bookingRequests.pickupTime,
      returnTime: bookingRequests.returnTime,
      pickupLocation: bookingRequests.pickupLocation,
      tripType: bookingRequests.tripType,
      notes: bookingRequests.notes,
      quotedTotal: bookingRequests.quotedTotal,
      status: bookingRequests.status,
      createdAt: bookingRequests.createdAt,
      vehicleName: vehicles.name,
      vehicleBrand: vehicles.brand,
    })
    .from(bookingRequests)
    .leftJoin(vehicles, eq(bookingRequests.vehicleId, vehicles.id))
    .orderBy(desc(bookingRequests.createdAt));
}

export async function getCustomerBookings(references: string[]) {
  const db = await getDb();
  if (!db || references.length === 0) return [];
  return db
    .select({
      reference: bookingRequests.reference,
      pickupDate: bookingRequests.pickupDate,
      returnDate: bookingRequests.returnDate,
      pickupTime: bookingRequests.pickupTime,
      returnTime: bookingRequests.returnTime,
      pickupLocation: bookingRequests.pickupLocation,
      quotedTotal: bookingRequests.quotedTotal,
      status: bookingRequests.status,
      vehicleName: vehicles.name,
      vehicleBrand: vehicles.brand,
      vehicleImageUrl: vehicles.imageUrl,
    })
    .from(bookingRequests)
    .leftJoin(vehicles, eq(bookingRequests.vehicleId, vehicles.id))
    .where(inArray(bookingRequests.reference, references))
    .orderBy(desc(bookingRequests.createdAt));
}

export async function updateBookingStatus(id: number, status: "pending" | "confirmed" | "declined" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available.");
  await db.update(bookingRequests).set({ status }).where(eq(bookingRequests.id, id));
}

export async function createVehicle(input: Omit<InsertVehicle, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available.");
  await db.insert(vehicles).values(input);
}

export async function updateVehicle(id: number, input: Partial<Omit<InsertVehicle, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available.");
  await db.update(vehicles).set(input).where(eq(vehicles.id, id));
}

export async function getAdminSnapshot() {
  const [fleet, bookings] = await Promise.all([listVehicles(), getAdminBookings()]);
  return {
    fleet,
    bookings,
    metrics: {
      availableVehicles: fleet.filter((vehicle) => vehicle.availability === "available").length,
      totalVehicles: fleet.length,
      pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
      confirmedBookings: bookings.filter((booking) => booking.status === "confirmed").length,
    },
  };
}
