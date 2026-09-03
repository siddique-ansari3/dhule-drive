export const BOOKING_STATUSES = ["pending", "confirmed", "declined", "completed"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type VehicleAvailability = "available" | "unavailable";

export type VehicleCardData = {
  id: number;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  seats: number;
  transmission: "manual" | "automatic";
  fuel: "petrol" | "diesel" | "cng" | "electric";
  dailyRate: number;
  availability: VehicleAvailability;
  featured: boolean;
  description: string | null;
};

export const DEFAULT_DHULE_FLEET: Omit<VehicleCardData, "id">[] = [
  {
    name: "Swift",
    brand: "Maruti Suzuki",
    category: "Hatchback",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
    seats: 5,
    transmission: "manual",
    fuel: "petrol",
    dailyRate: 1400,
    availability: "available",
    featured: true,
    description: "Efficient and easy to drive for city errands and short outstation trips.",
  },
  {
    name: "Dzire",
    brand: "Maruti Suzuki",
    category: "Sedan",
    imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    seats: 5,
    transmission: "manual",
    fuel: "petrol",
    dailyRate: 1800,
    availability: "available",
    featured: true,
    description: "A comfortable sedan with generous boot space for family travel.",
  },
  {
    name: "Ertiga",
    brand: "Maruti Suzuki",
    category: "MUV",
    imageUrl: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80",
    seats: 7,
    transmission: "manual",
    fuel: "petrol",
    dailyRate: 2600,
    availability: "available",
    featured: true,
    description: "A spacious seven-seater for group travel, family functions, and airport runs.",
  },
  {
    name: "Thar",
    brand: "Mahindra",
    category: "SUV",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    seats: 4,
    transmission: "manual",
    fuel: "diesel",
    dailyRate: 3800,
    availability: "available",
    featured: false,
    description: "A distinctive SUV for memorable weekend and outstation drives.",
  },
];
