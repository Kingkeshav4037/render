# Project Baseline

## Overview
**Norway SmartLife** is a comprehensive smart-city, tourism, and infrastructure platform designed to showcase sustainable travel, local cuisine, and intelligent transport in Norway.

## Technology Stack
- **Frontend**: React 19 (via Vite), TypeScript, Tailwind CSS
- **Routing**: React Router DOM (v7)
- **State Management**: Zustand (Global Auth/Preferences), React Query (Server State)
- **Maps**: Mapbox GL JS, Leaflet
- **Backend / Database**: Supabase (PostgreSQL), TypeScript Types generated locally
- **Payment**: Stripe, Razorpay
- **Styling**: Tailwind CSS with custom glassmorphism and animated components

## Repository Structure
The repository is a monorepo consisting of the following key directories:
- `frontend/`: The core React application containing all UI components, pages, services, and hooks.
- `supabase/`: Local Supabase configuration, containing the migration files that define the PostgreSQL schema and edge functions.
- `database/`: Contains supplementary SQL scripts (like `security_audit_log.sql`).
- `ml-service/`: A placeholder or active directory for machine-learning/AI integrations.
- `mobile/`: A placeholder or active directory for the React Native/Expo mobile application.
- `scripts/`: Assorted Node.js automation scripts (e.g., `build_schema.js`, `fetch_images.js`).

## Current State
The project is currently transitioning from static/mock data (Phase 1-2) to a robust backend-driven application utilizing Supabase (Phase 3-4). The focus is currently on moving away from `ComingSoon` placeholders to fully functional, personalized pages powered by React Query.
