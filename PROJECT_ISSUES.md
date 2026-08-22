# Project Issues & Risks

## 1. TypeScript & Architecture Errors
The repository fails to build (`npm run build`) and typecheck (`npx tsc -b`) due to massive type inconsistencies between the generated Supabase types (`src/lib/database.types.ts`) and the frontend's service layer.
- **Missing Tables**: The local Supabase schema is completely missing critical tables like `trips`, `trip_segments`, `reviews`, and `travel_preferences`. A repository-wide scan (`grep_search`) confirmed that `CREATE TABLE trips` does not exist in *any* of the 29 migration files. This means the frontend code in `src/services/tripService.ts` is attempting to query a database model that was never committed or was removed. This results in TS errors like `Argument of type '"trips"' is not assignable to parameter of type 'never'`. *Attempted fix via `npm run db:types` confirmed the schema mismatch is structural.*
- **Property Mismatches**: Several component interfaces do not match the expected types (e.g., `preferred_trip_style` vs `preferredTripStyle` in `TravelPreferencesForm.tsx`, `total_users` in `AdminDashboard.tsx`, and `full_name` vs `fullName` in `Profile.tsx`).
- **Missing Imports**: Files in `src/pages/admin/` have broken imports referring to missing modules (e.g., `Cannot find module '../../../../lib/supabase'`).

## 2. Hard-coded Mock Data
- The newly built `Stay`, `Travel`, and `Food` pages (Phase 0) use temporary mock data files (`stays.ts`, `transport.ts`, `food.ts`) structured to mimic the eventual Supabase queries. These files use the `is_demo: true` flag. These must be replaced with real Supabase queries once the database is populated.

## 3. Duplicate Routes and Components
- **Explore vs Destinations**: Both `/explore` and `/destinations` map to the same `Explore.tsx` component.
- **Trip Planner**: `/planner`, `/ai-planner`, and `/plan-trip` all map to `TripPlanner.tsx`.
- **Map**: `/map` and `/smart-map` both map to `SmartMap.tsx`.
- **Infrastructure vs Industry**: The `/industry` route loads the actual `<Infrastructure />` component, while the `/infrastructure` route is assigned a placeholder `<ComingSoon />`.

## 4. Placeholders & Incomplete Features
A significant portion of the platform is still mapped to the `ComingSoon` component, representing unbuilt features:
- `/places`, `/nature`, `/fjords`, `/mountains`, `/wildlife`
- `/activities`, `/events`
- `/weather`, `/aurora`, `/safety`
- `/deals`, `/packages`, `/guides`

## 5. Potential RLS / Security Issues
- The database migrations include a file named `20260818000001_fix_rls_recursion.sql`, implying that previous Row Level Security (RLS) policies might have caused infinite recursion or lockups. This needs to be carefully monitored when the application is connected to the real database.
