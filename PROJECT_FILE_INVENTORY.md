# Project File Inventory

## Directory Overview
- `frontend/`: React application containing `src`, `public`, `package.json`, `vite.config.ts`, etc.
  - `src/components/`: Reusable React components grouped by feature (e.g., `home`, `layout`, `shared`, `stay`, `travel`, `food`).
  - `src/pages/`: Top-level route components.
  - `src/hooks/`: Custom React hooks, heavily utilizing `@tanstack/react-query`.
  - `src/services/`: API layer interacting with Supabase (e.g., `tripService.ts`, `reviewService.ts`).
  - `src/store/`: Zustand state management (e.g., `useAuthStore.ts`).
  - `src/data/demo/`: Hardcoded JSON/TypeScript objects used for UI mocking (`stays.ts`, `transport.ts`, `food.ts`).
  - `src/lib/`: Core libraries like `supabase.ts` and generated `database.types.ts`.
- `supabase/`: Contains the local Supabase configuration and PostgreSQL migrations.
  - `supabase/migrations/`: 29 migration files setting up the schema.
  - `supabase/seed.sql`: Data to populate the local DB on reset.
- `database/`: Supplementary SQL files like `security_audit_log.sql`.
- `ml-service/`: Currently an empty or minimal placeholder directory for ML integration.
- `mobile/`: Currently an empty or minimal placeholder directory for Mobile app integration.
- `scripts/`: Custom Node scripts (`build_schema.js`, `fetch_images.js`).

## Key Missing or Duplicate Files
- **Missing**: There are no comprehensive automated test suites (e.g., Jest or Cypress tests) currently populated in `frontend/src/tests/` or equivalent.
- **Orphan Components**: The `App.tsx` routes indicate that some functionality is duplicated or aliased, meaning some components may be serving multiple roles while others are unused.
- **Unused Files**: The transition from mock data to real database interactions means that files inside `src/data/demo/` will eventually become obsolete and should be considered technical debt to be removed in future phases.
