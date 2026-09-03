export function calculateRentalDays(pickupDate: string, returnDate: string): number | null {
  const pickup = new Date(`${pickupDate}T12:00:00`);
  const dropoff = new Date(`${returnDate}T12:00:00`);

  if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime()) || dropoff < pickup) {
    return null;
  }

  const elapsedDays = Math.round((dropoff.getTime() - pickup.getTime()) / 86_400_000);
  return Math.max(1, elapsedDays || 1);
}

export function formatRupees(value: number): string {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}
