# Project Database Inventory

## Supabase Local Instance
The project uses a local Supabase instance to emulate the production environment, including the database, auth, and storage services.

## Migrations Overview
The `supabase/migrations/` folder contains 29 SQL migration files. The schema has evolved over multiple phases:
- **Phase A-H (Initial)**: Core schema, seed data, mobility, commerce, smart map, intelligence, trip planner, and initial seeding (`20260817000000` - `20260817000007`).
- **v4 Schema (RBAC, Bookings, CO2)**: RBAC, booking engine, CO2 tracking, notifications, auditing, and RLS policies (`20260817000008` - `20260817000013`).
- **Phase 2-8 (Unified)**: Unified schema, dashboard, profile, admin, auth, commerce, and map schemas (`20260817000014` - `20260817000020`).
- **Phase 10 (AI Planner & Fixes)**: AI Planner schema, RLS recursion fixes, role normalization, grants, schema expansion, and RBAC reconciliation (`20260818000000` - `20260818000005`).

## Additional SQL Scripts
- `database/security_audit_log.sql`: Likely used to set up or verify triggers for auditing security events.
- `supabase/seed.sql`: Contains the seed data to populate the local database on reset.

## Identified Database Issues
- **Missing Tables / Type Mismatches**: When generating the TypeScript types via `npx supabase gen types typescript --local`, several tables used by the frontend (such as `trips`, `trip_segments`, `trip_stays`, `trip_activities`, `reviews`, and `travel_preferences`) are either missing from the generated types or not present in the local database schema. This causes extensive TypeScript errors in the `src/services/` layer.
- **Multiple "Phases"**: The migration names suggest that multiple developers or automated agents have created overlapping schemas (e.g. `Phase A-H` vs `Phase 2-8`). This could lead to duplicate tables or conflicting relationships.
