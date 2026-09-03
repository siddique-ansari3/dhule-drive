# Dhule Drive

Dhule Drive is a **cross-platform car-rental MVP** for customers booking vehicles in Dhule and rental owners managing their fleet and booking requests. It is built as an Expo application that runs on iOS, Android, and the web from a shared TypeScript codebase.

The customer experience supports vehicle discovery, rental-request submission, pricing estimates, and locally saved booking history. The protected web owner console provides an operational view of the fleet and incoming requests.

> **MVP note:** A booking submitted through this application is a request, not an automatically confirmed rental. The rental owner reviews and confirms availability through the owner console.

## Product Capabilities

| Area | Included in this project |
|---|---|
| Customer app | Browse Dhule-based rental vehicles, filter by category, compare rates and basic specifications, and open vehicle details. |
| Rental requests | Submit pickup and return dates/times, address, contact details, trip preference, and optional notes. Server-side input validation is applied before a request is stored. |
| Estimates | Show daily rates and a calculated rental estimate based on the requested number of rental days. |
| Booking history | Save the customer’s request references locally on the device and retrieve their latest status from the shared service. |
| Owner console | Review booking requests, confirm or decline pending requests, mark confirmed rentals complete, and view summary metrics. |
| Fleet management | View the seeded fleet, change vehicle availability, and add a new vehicle with its core rental details. |
| Brand assets | Includes a Dhule Drive launcher icon, splash icon, favicon, adaptive Android icon, and a shared travel-oriented visual theme. |

## Screens and Routes

| Route | Audience | Purpose |
|---|---|---|
| `/` | Customer | Explore the available fleet, select rental dates, and filter by vehicle category. |
| `/vehicle/[id]` | Customer | Review the selected vehicle’s imagery, specifications, rental inclusions, and daily rate. |
| `/booking/[id]` | Customer | Submit a rental request with contact, schedule, pickup, and trip-preference details. |
| `/confirmation` | Customer | Present the submitted request reference, itinerary summary, and quoted estimate. |
| `/bookings` | Customer | Display booking requests saved on the current device and their latest operating status. |
| `/profile` | Customer | Provide rental-support guidance and, on web, an entry point to the owner console. |
| `/admin` | Owner | Protected dashboard for booking decisions, fleet availability, and new vehicle entry. |

## Technology Stack

| Layer | Technology |
|---|---|
| Mobile and web client | Expo SDK 54, React Native, Expo Router, React Native Web, TypeScript |
| Styling | NativeWind/Tailwind-compatible tokens plus React Native `StyleSheet` components |
| Server API | Express and tRPC with Zod validation |
| Data persistence | MySQL/TiDB-compatible database using Drizzle ORM |
| Customer device storage | AsyncStorage for booking-reference history |
| Authentication | Project-provided OAuth, restricted to owner dashboard routes |
| Testing | Vitest |

## Local Setup

### Prerequisites

Use a current Node.js environment and `pnpm`. For mobile-device testing, install Expo Go on the target iOS or Android device.

### Install and run

```bash
git clone https://github.com/siddique-ansari3/dhule-drive.git
cd dhule-drive
pnpm install
pnpm dev
```

The development process starts the API server and Expo web bundler together. Use the generated Expo QR code to open the mobile project in Expo Go, or open the local Expo web address in a browser.

### Common commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the API server and Expo web development server. |
| `pnpm qr` | Generate a QR code for mobile-device testing. |
| `pnpm android` | Launch the project for Android development. |
| `pnpm ios` | Launch the project for iOS development. |
| `pnpm check` | Run the TypeScript type check. |
| `pnpm test` | Run the Vitest suite. |
| `pnpm drizzle-kit generate` | Generate a migration after editing `drizzle/schema.ts`. |

## Data Model

The app maintains three main data entities. The existing `users` table supports project authentication. The `vehicles` table holds the fleet inventory, core specifications, daily rental rate, availability, and image address. The `bookingRequests` table stores a customer’s submitted itinerary, contact details, selected vehicle, quote, and operational status.

| Entity | Key fields | Purpose |
|---|---|---|
| `vehicles` | Brand, model, category, seats, transmission, fuel, daily rate, availability, featured flag | Supplies the customer catalogue and owner fleet view. |
| `bookingRequests` | Reference, vehicle ID, customer name, phone, dates/times, pickup address, trip type, quote, status | Captures and tracks a rental request through its operational lifecycle. |
| `users` | OAuth identity, name, email, role | Identifies the project owner for protected console access. |

Booking request statuses follow the sequence **pending → confirmed → completed**, with **declined** as an alternate outcome. Public customers may create a request; only the authenticated project owner can use the dashboard management operations.

## Project Structure

```text
app/                    Expo Router screens and tabs
components/             Shared screen containers and rental UI components
assets/images/          Launcher, splash, Android, and favicon images
shared/                 Rental constants, domain types, and calculation utilities
server/                 Database helpers and tRPC router definitions
drizzle/                Database schema, snapshots, and SQL migrations
tests/                  Unit tests
design.md               Product and interface design brief
IMPLEMENTATION.md       Completion summary, current state, and next steps
todo.md                 Feature tracker
```

## Database Initialization

The repository includes the fleet and booking migration at `drizzle/0001_misty_jimmy_woo.sql`. After configuring a compatible database connection, apply the migration using the project’s normal database workflow. The public catalogue seeds four demonstration vehicles—Swift, Dzire, Ertiga, and Thar—when the fleet is initially empty.

## Configuration and Security

Server configuration relies on environment variables provisioned by the runtime, including the database connection and OAuth settings. Do not commit `.env` files, authentication tokens, payment keys, or production contact details to this repository.

The owner console is authenticated through the project OAuth flow. Access is granted only when the authenticated user’s role is `admin`; the owner identity receives that role during user upsert.

## Current MVP Limitations

Dhule Drive deliberately focuses on the request-to-confirm workflow. It does **not** currently process online payments, verify driving licences, assign drivers, calculate extra-kilometre charges, sync customer history across devices, support multi-vendor fleets, or send customer SMS/WhatsApp notifications. These functions should be introduced after defining rental policy, payment provider, consent language, and operating procedures.

For a detailed project-completion record and recommended next build steps, see [IMPLEMENTATION.md](./IMPLEMENTATION.md).

## Quality Checks Completed

The project has passed the TypeScript check and the current automated rental-calculation test suite. The public customer catalogue and unauthenticated owner-console entry state were also manually checked in the browser. Full owner-management testing requires an authenticated owner session.

## License

This repository does not currently define an open-source license. Treat the code and brand assets as private unless the repository owner adds an explicit license.
