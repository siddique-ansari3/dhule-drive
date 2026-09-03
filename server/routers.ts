import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { COOKIE_NAME } from "../shared/const.js";
import { BOOKING_STATUSES } from "../shared/rental";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

const vehicleInput = z.object({
  name: z.string().min(2).max(120),
  brand: z.string().min(2).max(120),
  category: z.string().min(2).max(80),
  imageUrl: z.string().url().max(512),
  seats: z.number().int().min(2).max(12),
  transmission: z.enum(["manual", "automatic"]),
  fuel: z.enum(["petrol", "diesel", "cng", "electric"]),
  dailyRate: z.number().int().min(300).max(50000),
  availability: z.enum(["available", "unavailable"]),
  featured: z.boolean(),
  description: z.string().max(1000).nullable().optional(),
});

const bookingInput = z.object({
  vehicleId: z.number().int().positive(),
  customerName: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,24}$/, "Enter a valid mobile number"),
  pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickupTime: z.string().regex(/^\d{2}:\d{2}$/),
  returnTime: z.string().regex(/^\d{2}:\d{2}$/),
  pickupLocation: z.string().trim().min(3).max(255),
  tripType: z.enum(["self_drive", "with_driver"]),
  notes: z.string().trim().max(1000).optional(),
});

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Owner access is required." });
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.query(() => db.listVehicles()),
    byId: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => db.getVehicle(input.id)),
  }),
  booking: router({
    create: publicProcedure.input(bookingInput).mutation(({ input }) => db.createBookingRequest(input)),
    byReferences: publicProcedure
      .input(z.object({ references: z.array(z.string().min(4).max(24)).max(30) }))
      .query(({ input }) => db.getCustomerBookings(input.references)),
  }),
  admin: router({
    snapshot: adminProcedure.query(() => db.getAdminSnapshot()),
    bookings: adminProcedure.query(() => db.getAdminBookings()),
    updateBookingStatus: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(BOOKING_STATUSES) }))
      .mutation(({ input }) => db.updateBookingStatus(input.id, input.status)),
    createVehicle: adminProcedure.input(vehicleInput).mutation(({ input }) => db.createVehicle(input)),
    updateVehicle: adminProcedure
      .input(z.object({ id: z.number().int().positive(), vehicle: vehicleInput.partial() }))
      .mutation(({ input }) => db.updateVehicle(input.id, input.vehicle)),
  }),
});

export type AppRouter = typeof appRouter;
