# Dhule Drive — Interface Design Brief

## Product Intent

Dhule Drive is a car-rental service for local and outstation travel originating in Dhule. The customer experience is a mobile-first, one-handed booking flow that helps a traveller select a vehicle, propose rental dates, understand the quote, and submit a booking request. The web experience is an owner-only operating dashboard for accepting bookings and keeping the fleet, prices, and availability current.

## Screen List

| Surface | Screen | Primary content and functionality |
|---|---|---|
| Customer mobile | Explore | Dhule pickup context, date selector, featured available cars, vehicle category chips, and a clear “Find cars” action. |
| Customer mobile | Vehicle list | Filtered rental inventory with category, seating, transmission, fuel type, daily rate, and availability context. |
| Customer mobile | Vehicle detail | Vehicle imagery, specifications, inclusions, daily price, rental notes, and an anchored booking action. |
| Customer mobile | Booking request | Pickup and return date/time, trip type, contact details, pickup address, and a live request summary before submission. |
| Customer mobile | Request confirmation | Submitted request reference, selected vehicle summary, next-step message, and owner-contact option. |
| Customer mobile | My requests | Device-local history of submitted request references and their latest statuses. |
| Responsive web | Owner dashboard | Today’s booking activity, fleet availability, requests requiring a decision, and quick operational actions. |
| Responsive web | Bookings | Searchable request list with status controls, customer contacts, date range, quoted amount, and booking detail panel. |
| Responsive web | Fleet | Vehicle inventory list with availability toggle, daily rate, key specifications, and add/edit vehicle form. |
| Responsive web | Pricing and settings | Base rental guidance, service contact details, pickup-note settings, and dashboard access state. |

## Mobile Layout and Interaction Model

The mobile experience uses portrait-first 9:16 screens and a bottom tab bar for **Explore**, **Bookings**, and **Profile**. The primary booking call-to-action remains in the lower thumb zone on vehicle-detail and form screens. Content uses high-contrast cards, 16–20 px internal spacing, 44 px minimum tap targets, and concise labels. The journey uses a progressive disclosure model: dates and destination first, vehicle selection second, contact and request confirmation last.

Vehicle cards show one vehicle per card with an image, daily rate, seating count, transmission, and a distinct availability status. The booking form splits information into short visual groups, using native date/time controls where available and clear error messages before submission. A confirmation screen reduces uncertainty by explaining that the booking is a request until approved by the rental owner.

## Responsive Dashboard Layout

On desktop web, the dashboard uses a fixed left navigation rail, a compact header, and a two-column content area. Summary metrics lead the home view; an action queue and next rental windows sit below. Tables collapse into card rows on narrower browser widths so the same interface remains usable on tablets. Destructive actions require a confirmation dialog, while changes to price, availability, and booking status display an immediate saved-state confirmation.

## Key User Flows

| User | Flow | Completion state |
|---|---|---|
| Customer | Explore → choose dates → open vehicle → enter rental details → submit request | A request reference is shown and a new booking starts as “Pending”. |
| Customer | Bookings tab → choose prior request | The customer sees vehicle, dates, quote, and latest request status. |
| Owner | Sign in on web → dashboard → open pending request → accept or decline | The request status updates for the customer and the dashboard queue. |
| Owner | Fleet → add or edit vehicle → set daily rate and availability | The edited vehicle appears in the customer inventory without app redeployment. |

## Color Choices

The visual system combines a confident travel-oriented **Midnight Navy `#102A43`** for headers and navigation, a warm **Dhule Saffron `#F59E0B`** for primary booking actions, and a calm **Road Teal `#0F766E`** for availability and confirmed states. Backgrounds use **Mist `#F7F9FC`**, cards are **White `#FFFFFF`**, body text is **Slate `#1F2937`**, and borders are **Cloud `#DCE3EC`**. Declined or unavailable states use **Signal Red `#C2410C`**. This gives booking actions strong visual priority while preserving an operational, trustworthy dashboard.

## Data and Access Assumptions

The MVP stores fleet and booking requests centrally so the customer app and the owner dashboard remain in sync. Customers can submit a booking request without an account by providing name and phone number; owner dashboard routes are protected by project-owner sign-in. Payments, live GPS tracking, driver's licence verification, and driver assignment are intentionally deferred until the operating workflow is validated.
