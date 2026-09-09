# Project Route Inventory

## Defined Routes (`App.tsx`)

### Public & Authentication Routes

- `/` - Maps to `RootRedirect` (Auth-aware redirect to `/home` or `/login`)
- `/login` - Maps to `Login`
- `/register` - Maps to `Register`
- `/forgot-password` - Maps to `ForgotPassword`
- `/reset-password` - Maps to `ResetPassword`
- `/auth/callback` - Maps to `AuthCallback`
- `/provider/join` - Maps to `ProviderLanding`
- `/provider/register` - Maps to `ProviderRegister`

### Protected Routes (Requires Authentication)

These routes are protected by `ProtectedRoute` and primarily use `MainLayout`.

#### Core Features & Exploration

- `/home` - `Home`
- `/explore` - `Explore` (Destinations)
- `/explore/:slug` - `DestinationDetails`
- `/map` - `SmartMap`
- `/planner` - `TripPlanner`
- `/planner/itinerary/:id` - `ItineraryView`
- `/insights` - `Insights`
- `/recommendations` - `Recommendations`
- `/sitemap` - `Sitemap`

#### Experiences & Content

- `/trails`, `/trails/:id` - `HikingTrails`, `TrailDetails`
- `/winter`, `/winter/:id`, `/resorts` - `WinterSports`, `WinterResortDetails`
- `/wildlife`, `/wildlife/:id` - `Wildlife`, `WildlifeDetail`
- `/flora`, `/nature/flora`, `/nature/plants-trees` - `Flora`
- `/history` - `History`
- `/food`, `/food/:id` - `Food`, `FoodDetails`
- `/stay`, `/stay/:id` - `Stay`, `StayDetails`
- `/activities`, `/activities/:id` - `Activities`, `ActivityDetails`
- `/travel`, `/travel/route/:id` - `Travel`, `TransportDetails`
- `/road-trips` - `RoadTrips`
- `/events` - `Events`
- `/deals` - `Deals`
- `/guides` - `Guides`
- `/shop`, `/products` - `Products`

#### Smart City & Infrastructure

- `/smart-city` - `SmartCity`
- `/infrastructure` - `Infrastructure`
- `/live` - `SmartNorway`
- `/weather` - `LiveWeather`
- `/aurora` - `AuroraTracker`
- `/safety` - `SafetyAlerts`
- `/sustainability` - `Sustainability`
- `/mobility/ev`, `/mobility/ev/:id` - `EVCharging`, `EVStationDetails`
- `/mobility/ferry` - `SmartFerry`
- `/infrastructure/energy` - `EnergyDashboard`
- `/infrastructure/iot`, `/infrastructure/iot/:id` - `IoTDashboard`, `DeviceDetail`

#### E-Commerce & Bookings

- `/checkout` - `Checkout`
- `/checkout/stay/:id` - `StayBooking`
- `/payment-success` - `PaymentSuccess`

#### User Dashboard & Profile

- `/dashboard` - `Dashboard`
- `/profile`, `/profile/preferences`, `/profile/security`, `/profile/privacy` - `ProfileLayout`
- `/wishlist` - `Wishlist`
- `/trips`, `/trips/:id` - `TripsList`, `TripDetails`
- `/wallet` - `TravelWallet`
- `/notifications` - `Notifications`
- `/settings/notifications` - `NotificationSettings`
- `/reviews` - `Reviews`
- `/user/history`, `/user/travel-history` - `TravelHistory`
- `/impact` - `Impact`
- `/expenses` - `Expenses`
- `/user/bookings`, `/user/bookings/:id` - `MyBookings`, `BookingDetails`
- `/invoices`, `/user/invoices` - `Invoices`
- `/assistant` - `Assistant`

### Provider Routes

Protected by `ProviderGuard` and uses `ProviderLayout`.

- `/provider` - Base Provider Route Guard
- `/provider/dashboard` - `ProviderDashboard`
- `/provider/listings`, `/provider/listings/new`, `/provider/listings/:id/edit`, `/provider/listings/:id/preview`
- `/provider/calendar` - `ProviderCalendar`
- `/provider/bookings`, `/provider/bookings/:id` - `ProviderBookings`, `ProviderBookingDetails`
- `/provider/customers` - `ProviderCustomers`
- `/provider/messages` - `ProviderMessages`
- `/provider/reviews` - `ProviderReviews`
- `/provider/finance` - `ProviderFinance`
- `/provider/analytics` - `ProviderAnalytics`
- `/provider/marketing` - `ProviderMarketing`
- `/provider/settings` - `ProviderSettings`

### Admin Routes

Protected by `RoleGuard` (ADMIN/SUPER_ADMIN) and uses `AdminLayout`.

- `/admin/login` - `AdminLogin`
- `/admin` - `AdminDashboard`
- `/admin/analytics` - `AdminAnalytics`
- `/admin/pages` - `AdminPageRegistry`
- `/admin/data-quality` - `AdminDataQuality`
- `/admin/users`, `/admin/users/:id` - `AdminUsers`, `AdminUserDetails`
- `/admin/providers`, `/admin/providers/verification` - `AdminProviders`, `AdminProviderVerification`
- `/admin/moderation` - `AdminModeration`
- `/admin/bookings` - `AdminBookings`
- `/admin/orders` - `AdminOrders`
- `/admin/products` - `AdminProducts`
- `/admin/payments` - `AdminPayments`
- `/admin/destinations` - `AdminDestinations`
- `/admin/operations` - `AdminLiveOperations`
- `/admin/operations/import` - `ImportManager`
- `/admin/iot` - `AdminIoT`
- `/admin/settings` - `AdminSettings`
- `/admin/infrastructure` - `AdminIoT`
- `/admin/health` - `AdminPageHealth`
- `/admin/content` - Content CMS Hub
- `/admin/content/wildlife` - `AdminWildlifeCMS`
- `/admin/content/flora` - `AdminFloraCMS`
- `/admin/content/places` - `PlacesCMS`
- `/admin/content/stays` - `StaysCMS`
- `/admin/content/activities` - `ActivitiesCMS`
- `/admin/content/trails` - `TrailsCMS`
- `/admin/content/skiresorts` - `SkiResortsCMS`
- `/admin/content/roadtrips` - `RoadTripsCMS`
- `/admin/content/aurora` - `AuroraCMS`
- `/admin/content/relationships` - `RelationshipsCMS`
- `/admin/content/translations` - `TranslationsCMS`
- `/admin/content/food` - `FoodCMS`
- `/admin/content/events` - `AdminEvents`
- `/admin/content/deals` - `AdminDeals`
- `/admin/media` - `AdminMedia`

## Redirected Canonical Routes

These legacy or alias paths correctly redirect to their canonical equivalents:

- `/destinations` -> `/explore`
- `/smart-map` -> `/map`
- `/ai-planner`, `/plan-trip` -> `/planner`
- `/restaurants` -> `/food`
- `/hotels` -> `/stay`
- `/transport` -> `/travel`
- `/packages` -> `/deals`
- `/plants-trees` -> `/nature/plants-trees`
- `/places` -> `/explore?type=LANDMARK`
- `/nature` -> `/explore?type=NATIONAL_PARK`
- `/fjords` -> `/explore?type=FJORD`
- `/mountains` -> `/trails`

## Addressed Duplicate Concepts (Resolved)

- **Explore / Destinations**: Resolved via redirects to `/explore`.
- **Trip Planner**: Resolved via redirects to `/planner`.
- **Map**: Resolved via redirects to `/map`.
- **Placeholders**: All `ComingSoon` placeholders have been fully replaced with functional components and pages.
- **Industry**: The `/industry` route has been cleaned up and completely replaced by `/infrastructure`.
