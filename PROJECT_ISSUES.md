# Project Issues & Risks

## 1. Hard-coded Mock Data (Resolved)

- All services (`staysService.ts`, `transportService.ts`, `foodService.ts`) are fully wired to live Supabase database tables with schema validation, with all temporary mock files (`src/data/demo/`) and `is_demo` flags removed. Database errors and empty responses are cleanly handled via UI empty-state components (`AsyncStateWrapper`).

## 2. Duplicate Routes and Components (Resolved)

- **Explore vs Destinations**: Resolved via redirects (e.g., `/destinations` redirects to `/explore`).
- **Trip Planner**: Resolved via redirects.
- **Map**: Resolved via redirects.
- **Infrastructure vs Industry**: The `/industry` route has been removed and `/infrastructure` now correctly loads the `Infrastructure` component.

## 3. Placeholders & Incomplete Features (Resolved)

The features previously mapped to placeholders or `ComingSoon` have been implemented or correctly redirected to the main Explore system:

- `/places`, `/nature`, `/fjords`, `/mountains` (Redirecting to Explore/Trails)
- `/wildlife`, `/activities`, `/events`, `/weather`, `/aurora`, `/safety`, `/deals`, `/packages`, `/guides` (Implemented components or properly redirected)

## 4. Potential RLS / Security Issues

- The database migrations include a file named `20260818000001_fix_rls_recursion.sql`, implying that previous Row Level Security (RLS) policies might have caused infinite recursion or lockups. This needs to be carefully monitored when the application is connected to the real database.

## 5. Build Environment & Clean Release Packaging (Resolved)

- **Release Archive Cleanup**: Automated clean distribution scripts have been added:
  - `scripts/create-clean-zip.ps1` (PowerShell for Windows)
  - `scripts/create-clean-zip.sh` (Bash for Linux/macOS/CI)
- The scripts generate a lightweight and portable (~15 MB) archive strictly excluding:
  - `node_modules/` (prevents cross-platform native binding errors such as `@rolldown/binding-linux-x64-gnu`)
  - `.venv/` and Python virtual environment caches (`__pycache__/`, `*.pyc`)
  - `dist/`, `dist-ssr/` (build outputs)
  - `playwright-report/`, `test-results/`, `coverage/`
  - `.git/` (standalone distribution)
- Target deployment machines should run a clean `npm install` and `npm run build` directly.

## 6. Runtime Module Resolution in `App.tsx` (Resolved)

- **Issue**: The `NotFound` (404) component used `const { Link } = require('react-router-dom');` inside an ESM project (`"type": "module"`). In browser environments, this would result in a `require is not defined` runtime exception.
- **Fix**: Replaced CJS `require` call with standard ESM `Link` import alongside `BrowserRouter, Routes, Route, Navigate` at top of `src/App.tsx`.

## 7. ML Backend API Configuration Hardening (Resolved)

- **Issue**: `src/services/api.ts` previously threw a fatal top-level error on module evaluation in production if `VITE_API_URL` / `VITE_ML_API_URL` was not set, causing the entire React bundle to crash on load.
- **Fix**: Changed the fatal initialization exception to a non-fatal warning (`console.warn`) so that core application browsing, authentication, bookings, and commerce operate seamlessly even before the ML backend URL is configured.

*(Note: The previous TypeScript and architecture errors relating to Supabase schema mismatches and missing tables have been resolved with `npx tsc -b` passing 0 errors.)*
