# Project Route Inventory

## Defined Routes (`App.tsx`)

### Public Routes
- `/` - Maps to `Login`
- `/login` - Maps to `Login`
- `/register` - Maps to `Register`

### Protected Routes (Requires Authentication)
All routes below are wrapped in `ProtectedRoute` and `MainLayout`.

#### Main Features
- `/home` - `Home`
- `/explore` - `Explore` (Destinations)
- `/explore/:slug` - `DestinationDetails`
- `/smart-city` - `SmartCity`
- `/map` - `SmartMap`
- `/insights` - `Insights`
- `/trails` - `HikingTrails`
- `/trails/:id` - `TrailDetails`
- `/winter` - `WinterSports`
- `/winter/:id` - `WinterResortDetails`
- `/products` - `Products`
- `/checkout` - `Checkout`
- `/payment-success` - `PaymentSuccess`
- `/industry` - `Infrastructure`
- `/planner` - `TripPlanner`

#### Redirected Alias Routes
These paths automatically redirect to their canonical equivalents:
- `/destinations` -> `/explore`
- `/smart-map` -> `/map`
- `/ai-planner` -> `/planner`
- `/plan-trip` -> `/planner`
- `/restaurants` -> `/food`
- `/hotels` -> `/stay`
- `/transport` -> `/travel`

#### Rebuilt Pages (Phase 0)
- `/food` - `Food`
- `/stay` - `Stay`
- `/travel` - `Travel`

#### User & Admin Routes
- `/dashboard` - `Dashboard`
- `/profile` - `Profile`
- `/settings/notifications` - `NotificationSettings`
- `/provider/dashboard` - `ProviderDashboard`
- `/impact` - `Impact`
- `/admin/*` - Maps to `AdminRoutes`

### Placeholder / ComingSoon Routes
The following routes are currently placeholders rendering the `<ComingSoon />` component:
- `/places`
- `/nature`
- `/fjords`
- `/mountains`
- `/wildlife`
- `/activities`
- `/infrastructure` (Listed as `ComingSoon` further down in `App.tsx`, although `/industry` maps to `Infrastructure`)
- `/events`
- `/weather`
- `/aurora`
- `/safety`
- `/deals`
- `/packages`
- `/guides`

## Duplicate & Overlapping Concepts (Resolved)
- **Explore / Destinations**: Canonical path is `/explore`. `/destinations` safely redirects to it.
- **Trip Planner**: Canonical path is `/planner`. `/ai-planner` and `/plan-trip` safely redirect to it.
- **Map**: Canonical path is `/map`. `/smart-map` safely redirects to it.
- **Food / Stay / Travel**: Canonical paths are `/food`, `/stay`, `/travel`. `/restaurants`, `/hotels`, and `/transport` redirect to their respective canonical URLs.
- **Infrastructure vs Industry**: `/industry` maps to `<Infrastructure />`, but `/infrastructure` maps to `<ComingSoon />`.
