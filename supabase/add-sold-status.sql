-- Migration: "Sold" status + sold_at date, for the homepage "Recently Sold" section.
-- NOT YET APPLIED. Run once in Supabase → SQL Editor after reviewing.
-- Safe to re-run (idempotent). schema.sql has been updated to match.

begin;

-- 1. Allow 'Sold' as a property status.
alter table properties drop constraint if exists properties_status_check;
alter table properties add constraint properties_status_check
  check (status in ('RFO', 'Pre-selling', 'Ongoing Construction', 'Accept Reservation', 'Sold'));

-- 2. When the listing was sold (orders the "Recently Sold" section).
alter table properties add column if not exists sold_at timestamptz;

-- 3. Stamp sold_at automatically when a listing is marked Sold, and clear it
--    if the listing is put back on the market.
create or replace function set_property_sold_at() returns trigger
language plpgsql as $$
begin
  if new.status = 'Sold' and (tg_op = 'INSERT' or old.status is distinct from 'Sold') then
    new.sold_at := coalesce(new.sold_at, now());
  elsif new.status <> 'Sold' then
    new.sold_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists properties_set_sold_at on properties;
create trigger properties_set_sold_at
  before insert or update of status on properties
  for each row execute function set_property_sold_at();

commit;
