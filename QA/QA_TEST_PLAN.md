# Master QA Test Plan - Phase 23

## Test Categories
1. **Static Tests**: Typescript Typechecking (`tsc --noEmit`), Linting (`oxlint`)
2. **Unit Tests**: React Components rendering (`vitest`)
3. **Integration Tests**: Hooks, Services, Supabase Client queries
4. **E2E Critical Journeys**: Testing user interactions across multiple pages.
5. **Security**: Row-Level Security (RLS) enforcement verification on DB.
6. **Edge Cases**: Offline simulation, malformed inputs.

## Execution Matrix
- **Auth**: Test local Inbucket for verification emails.
- **Database**: Run migrations and ensure alignment.
- **Performance**: Monitor bundle sizes.
