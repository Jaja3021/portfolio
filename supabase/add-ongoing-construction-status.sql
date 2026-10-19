-- Migration: "Ongoing Construction" property status (shown under "New Condition"
-- in the admin form). Run once in Supabase → SQL Editor. Safe to re-run.
-- schema.sql has been updated to match.

begin;

alter table properties drop constraint if exists properties_status_check;
alter table properties add constraint properties_status_check
  check (status in ('RFO', 'Pre-selling', 'Ongoing Construction', 'Accept Reservation', 'Sold'));

commit;
