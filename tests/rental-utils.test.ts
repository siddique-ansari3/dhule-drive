import { describe, expect, it } from "vitest";

import { calculateRentalDays, formatRupees } from "../shared/rental-utils";

describe("rental pricing utilities", () => {
  it("prices same-day and multi-day rentals predictably", () => {
    expect(calculateRentalDays("2026-09-03", "2026-09-03")).toBe(1);
    expect(calculateRentalDays("2026-09-03", "2026-09-06")).toBe(3);
  });

  it("rejects an end date before the pickup date", () => {
    expect(calculateRentalDays("2026-09-06", "2026-09-03")).toBeNull();
  });

  it("formats Indian rupee values", () => {
    expect(formatRupees(12500)).toBe("₹12,500");
  });
});
