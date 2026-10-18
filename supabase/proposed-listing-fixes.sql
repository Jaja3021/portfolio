-- PROPOSED listing data fixes, generated from `node --env-file=.env.local scripts/audit-listings.mjs`
-- on 2026-10-16. NOT YET APPLIED — review every line first.
--
-- How to use (Supabase → SQL Editor):
--   1. Edit any titles marked TODO(Arnold), and delete lines you don't want.
--   2. Run as-is: it ends with ROLLBACK, so it only previews the result (dry run).
--   3. When the preview looks right, change the last line to COMMIT and run again.

begin;

-- ---------------------------------------------------------------------------
-- 1. City / province formatting
-- ---------------------------------------------------------------------------
update properties set city = 'Trece Martires', province = 'Cavite' where id = '6e4ca186-f9b0-40b8-958b-61b70e1a1209'; -- was "TRECE MARTIRES, CAVITE"
update properties set city = 'Tanza',          province = 'Cavite' where id = 'f7bd114d-2d42-434a-8fec-4802ab0ad4d1'; -- was "TANZA CAVITE, CAVITE"
update properties set city = 'Tanza',          province = 'Cavite' where id = '971ab7ac-708c-4eab-8bfa-37073fb7fe9f'; -- was "TANZA CAVITE, CAVITE"
update properties set city = 'Tanza',          province = 'Cavite' where id = '0cf1a4c3-7aba-448a-8776-5edc7d2f94c9'; -- was "TANZA, CAVITE"
update properties set city = 'Tanza',          province = 'Cavite' where id = '398455ba-6914-46ef-b361-b6df54b24502'; -- was "TANZA CAVITE, CAVITE"
update properties set city = 'Tanza',          province = 'Cavite' where id = 'f0d750da-0988-42f8-8054-126bc695539b'; -- was "TANZA, CAVITE"
update properties set city = 'Tanza',          province = 'Cavite' where id = '4ab59fb6-74fe-42fb-a890-d3097bdc9b4e'; -- was "TANZA CAVITE, CAVITE"
update properties set city = 'Naic',           province = 'Cavite' where id = 'f0a724aa-6333-41a1-85da-f9a72ef7fd6a'; -- was "NAIC CAVITE, CAVITE"
update properties set city = 'Imus',           province = 'Cavite' where id = 'bd85e64f-d65e-421c-9307-58ac04237605'; -- was "IMUS, CAVITE"
update properties set city = 'Dasmariñas',     province = 'Cavite' where id = 'ae07d18e-a8ed-4bea-90ad-6a18977f3afa'; -- was "DASMARINAS, CAVITE"
update properties set city = 'Tanauan',        province = 'Batangas' where id = '5e6528f7-86cc-4c1b-b8bb-c39ba25d62cf'; -- was "TANAUAN, BATANGAS"
update properties set city = 'Maragondon',     province = 'Cavite' where id = 'eec43ad3-6991-4a5d-bc3f-1e95cef2241c'; -- was "MARAGONDON, CAVITE"
update properties set city = 'Naic',           province = 'Cavite' where id = 'f8ee9afa-2367-43eb-acb7-f06e6e3e9f29'; -- was "NAIC, NAIC"
update properties set city = 'Tanza',          province = 'Cavite' where id = '7504fd67-15a8-44bc-a96b-67840be7979b'; -- was "TANZ, CAVITE"
update properties set city = 'Tanza',          province = 'Cavite' where id = 'ec2d3ebd-573d-4c20-995d-fdfed914482b'; -- was "Cavite, Tanza" (swapped)
update properties set city = 'Dasmariñas',     province = 'Cavite' where id = '54b10e72-6b38-433d-b98b-a9d5c5d03a8d'; -- was "Dasmarinas, Cavite"
update properties set property_address = 'Brgy. Salitran 3, Dasmariñas, Cavite'
  where id = '54b10e72-6b38-433d-b98b-a9d5c5d03a8d'; -- address also said "Dasmarinas"

-- ---------------------------------------------------------------------------
-- 2. Titles (ALL CAPS / vague). Suggestions only — edit freely.
-- ---------------------------------------------------------------------------
update properties set title = 'Liora Homes – Naic, Cavite'                       where id = 'c1adc3e3-2e23-4b94-bdbc-551a217f8d37';
update properties set title = 'Paragon Village – Trece Martires, Cavite'         where id = '6e4ca186-f9b0-40b8-958b-61b70e1a1209';
-- TODO(Arnold): confirm "Anyana" is the project and "Antel" the developer.
update properties set title = 'Tokyo Model at Anyana by Antel – Tanza, Cavite'   where id = 'f7bd114d-2d42-434a-8fec-4802ab0ad4d1';
update properties set title = 'Nueville Townhomes – Tanza, Cavite'               where id = '971ab7ac-708c-4eab-8bfa-37073fb7fe9f';
update properties set title = 'Portico Hills – Tanza, Cavite'                    where id = '0cf1a4c3-7aba-448a-8776-5edc7d2f94c9';
-- TODO(Arnold): which project are the Paris / New York / Sydney models in? Add it to these three titles.
update properties set title = 'Paris Model – Tanza, Cavite'                      where id = '398455ba-6914-46ef-b361-b6df54b24502';
update properties set title = 'New York Model – Tanza, Cavite'                   where id = 'f0d750da-0988-42f8-8054-126bc695539b';
update properties set title = 'Sydney Model – Tanza, Cavite'                     where id = '4ab59fb6-74fe-42fb-a890-d3097bdc9b4e'; -- was misspelled "SDYNEY"
update properties set title = 'Gretta Homes – Naic, Cavite'                      where id = 'f0a724aa-6333-41a1-85da-f9a72ef7fd6a';
update properties set title = 'Hamilton Executive Residences – Imus, Cavite'     where id = 'bd85e64f-d65e-421c-9307-58ac04237605';
-- TODO(Arnold): add the condo project name.
update properties set title = '1-Bedroom Pre-Selling Condo in Dasmariñas, Cavite' where id = 'ae07d18e-a8ed-4bea-90ad-6a18977f3afa'; -- was "CONDO"
update properties set title = 'Linnea Model at Tanauan Park Place – Tanauan, Batangas' where id = '5e6528f7-86cc-4c1b-b8bb-c39ba25d62cf';
update properties set title = 'Viati Homes Townhouse – Naic, Cavite'             where id = 'f8ee9afa-2367-43eb-acb7-f06e6e3e9f29';
-- TODO(Arnold): add the condo project name.
update properties set title = 'Studio Condo in Tanza, Cavite'                    where id = '7504fd67-15a8-44bc-a96b-67840be7979b'; -- was "CONDO IN TANZA"
-- TODO(Arnold): add the subdivision name.
update properties set title = '3-Bedroom Single Attached House & Lot – Tanza, Cavite' where id = 'ec2d3ebd-573d-4c20-995d-fdfed914482b'; -- was "RFO AND PRE SELLING"

-- ---------------------------------------------------------------------------
-- 3. Other field clean-ups spotted while auditing
-- ---------------------------------------------------------------------------
-- Studio condo: bedrooms = 0 is correct (the site now shows "Studio"); clear the lot area,
-- which condos don't have (the 23 sqm is probably the unit size; floor_area already says 24).
update properties set lot_area = null where id = '7504fd67-15a8-44bc-a96b-67840be7979b';
update properties set house_type = 'Duplex' where id = 'eec43ad3-6991-4a5d-bc3f-1e95cef2241c'; -- was "DUPLEX"
-- TODO(Arnold): subdivision says "TANAUA PARK PLACE" — confirm the spelling below; developer "AXIEA" may be "Axeia".
update properties set subdivision = 'Tanauan Park Place' where id = '5e6528f7-86cc-4c1b-b8bb-c39ba25d62cf';
-- TODO(Arnold): Linnea's old title said "Single Detached" but house_type is "Single Attached". Uncomment the right one:
-- update properties set house_type = 'Single Detached' where id = '5e6528f7-86cc-4c1b-b8bb-c39ba25d62cf';

-- TODO(Arnold): these townhouses have no floor area. Fill in the sqm and uncomment:
-- update properties set floor_area = 0 where id = '795bd18c-3370-4c05-a415-bedb8931d8ee'; -- Re-opened RFO Unit in Paragon Village
-- update properties set floor_area = 0 where id = 'e64f00b2-856a-4893-985f-fbe7c0a94eb2'; -- Kathleen Place 5 in Bacoor
-- update properties set floor_area = 0 where id = 'ad69eea9-d6df-48a2-843d-47df4d4ecba9'; -- Nica Model Lofted Townhouse at Viati Homes

-- ---------------------------------------------------------------------------
-- Preview of every listing touched above
-- ---------------------------------------------------------------------------
select id, title, city, province, bedrooms, lot_area, floor_area, house_type, subdivision
from properties
where id in (
  'c1adc3e3-2e23-4b94-bdbc-551a217f8d37', '6e4ca186-f9b0-40b8-958b-61b70e1a1209', 'f7bd114d-2d42-434a-8fec-4802ab0ad4d1',
  '971ab7ac-708c-4eab-8bfa-37073fb7fe9f', '0cf1a4c3-7aba-448a-8776-5edc7d2f94c9', '398455ba-6914-46ef-b361-b6df54b24502',
  'f0d750da-0988-42f8-8054-126bc695539b', '4ab59fb6-74fe-42fb-a890-d3097bdc9b4e', 'f0a724aa-6333-41a1-85da-f9a72ef7fd6a',
  'bd85e64f-d65e-421c-9307-58ac04237605', 'ae07d18e-a8ed-4bea-90ad-6a18977f3afa', '5e6528f7-86cc-4c1b-b8bb-c39ba25d62cf',
  'eec43ad3-6991-4a5d-bc3f-1e95cef2241c', 'f8ee9afa-2367-43eb-acb7-f06e6e3e9f29', '7504fd67-15a8-44bc-a96b-67840be7979b',
  'ec2d3ebd-573d-4c20-995d-fdfed914482b', '54b10e72-6b38-433d-b98b-a9d5c5d03a8d'
)
order by title;

rollback; -- change to COMMIT once the preview looks right
