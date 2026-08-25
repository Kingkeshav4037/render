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

## 5. Build Environment & Clean Release Packaging

- **Release Archive Cleanup**: To ensure the release archive is lightweight and portable (~10-20 MB instead of ~585 MB), exclude all generated development and environment artifacts before compressing:
  - `node_modules/` (prevents cross-platform native binding errors such as `@rolldown/binding-linux-x64-gnu`)
  - `.venv/` and Python virtual environment caches (`__pycache__/`)
  - `dist/`, `dist-ssr/` (build outputs)
  - `playwright-report/`, `test-results/`, `coverage/`
  - Generated audit & linter logs (`audit_results.json`, `audit-report.txt`, `linter_report.txt`)
  - `.git/` (if producing a standalone distribution zip)
- Target deployment machines should run a clean `npm install` and `npm run build` directly.

*(Note: The previous TypeScript and architecture errors relating to Supabase schema mismatches and missing tables have been resolved with `npx tsc -b` passing 0 errors, and primary linter warnings including `AuroraCMS` initialization and unused imports have been cleaned up.)*
