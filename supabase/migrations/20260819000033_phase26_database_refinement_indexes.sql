-- ==============================================================================
-- Migration: 20260819000033_phase26_database_refinement_indexes.sql
-- Description: Phase 26 Module J Database Refinement & Performance Indexing
-- ==============================================================================

-- ── 1. Invoices Table Performance Indexes ─────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invoices_user_id 
  ON public.invoices (user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_booking_id 
  ON public.invoices (booking_id);

CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number 
  ON public.invoices (invoice_number);

CREATE INDEX IF NOT EXISTS idx_invoices_status 
  ON public.invoices (status);

CREATE INDEX IF NOT EXISTS idx_invoices_created_at 
  ON public.invoices (created_at DESC);

-- ── 2. Flora Species Performance Indexes ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_flora_species_category 
  ON public.flora_species (category);

CREATE INDEX IF NOT EXISTS idx_flora_species_conservation_status 
  ON public.flora_species (conservation_status);

CREATE INDEX IF NOT EXISTS idx_flora_species_slug 
  ON public.flora_species (slug);

-- ── 3. Bookings & Payments Index Hardening ────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bookings_user_id 
  ON public.bookings (user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_status 
  ON public.bookings (status);

CREATE INDEX IF NOT EXISTS idx_bookings_provider_id 
  ON public.bookings (provider_id);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at 
  ON public.bookings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway_order_id 
  ON public.payment_transactions (gateway_order_id);

-- ── 4. Content & Locations Directory Optimization ─────────────────────────────
CREATE INDEX IF NOT EXISTS idx_locations_type 
  ON public.locations (type);

CREATE INDEX IF NOT EXISTS idx_locations_status 
  ON public.locations (status);

CREATE INDEX IF NOT EXISTS idx_accommodations_location_id 
  ON public.accommodations (location_id);

CREATE INDEX IF NOT EXISTS idx_activities_location_id 
  ON public.activities (location_id);

CREATE INDEX IF NOT EXISTS idx_restaurants_location_id 
  ON public.restaurants (location_id);

CREATE INDEX IF NOT EXISTS idx_hiking_trails_difficulty 
  ON public.hiking_trails (difficulty);

CREATE INDEX IF NOT EXISTS idx_ski_resorts_status 
  ON public.ski_resorts (status);
