-- Migration: optional YouTube video, map coordinates, and DHSUD License to Sell.
-- NOT YET APPLIED. Run once in Supabase → SQL Editor after reviewing.
-- Safe to re-run (idempotent). schema.sql has been updated to match.

begin;

alter table properties add column if not exists youtube_url text;
alter table properties add column if not exists latitude double precision;
alter table properties add column if not exists longitude double precision;
alter table properties add column if not exists license_to_sell text;

-- Coordinates must be valid and come as a pair (both set or both empty).
alter table properties drop constraint if exists properties_coordinates_check;
alter table properties add constraint properties_coordinates_check check (
  (latitude is null and longitude is null)
  or (latitude between -90 and 90 and longitude between -180 and 180)
);

commit;
