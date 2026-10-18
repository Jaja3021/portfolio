// Read-only audit of the `properties` table. Reports data problems; changes nothing.
//
//   node --env-file=.env.local scripts/audit-listings.mjs            # readable report
//   node --env-file=.env.local scripts/audit-listings.mjs --json     # machine-readable
//
// Uses the public anon key (read-only by RLS), so it cannot modify data.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Run with --env-file=.env.local");
  process.exit(1);
}

// Canonical spellings for the provinces/cities Arnold lists in. Keys are a
// loose lowercase/no-accent form used for matching.
const CITIES_BY_PROVINCE = {
  Cavite: [
    "Alfonso", "Amadeo", "Bacoor", "Carmona", "Cavite City", "Dasmariñas", "General Emilio Aguinaldo",
    "General Mariano Alvarez", "General Trias", "Imus", "Indang", "Kawit", "Magallanes", "Maragondon",
    "Mendez", "Naic", "Noveleta", "Rosario", "Silang", "Tagaytay", "Tanza", "Ternate", "Trece Martires",
  ],
  Pampanga: [
    "Angeles", "Apalit", "Arayat", "Bacolor", "Candaba", "Floridablanca", "Guagua", "Lubao", "Mabalacat",
    "Macabebe", "Magalang", "Masantol", "Mexico", "Minalin", "Porac", "San Fernando", "San Luis",
    "San Simon", "Santa Ana", "Santa Rita", "Santo Tomas", "Sasmuan",
  ],
  Tarlac: [
    "Anao", "Bamban", "Camiling", "Capas", "Concepcion", "Gerona", "La Paz", "Mayantoc", "Moncada",
    "Paniqui", "Pura", "Ramos", "San Clemente", "San Jose", "San Manuel", "Santa Ignacia", "Tarlac City",
    "Victoria",
  ],
  Batangas: [
    "Agoncillo", "Alitagtag", "Balayan", "Balete", "Batangas City", "Bauan", "Calaca", "Calatagan",
    "Cuenca", "Ibaan", "Laurel", "Lemery", "Lian", "Lipa", "Lobo", "Mabini", "Malvar", "Mataasnakahoy",
    "Nasugbu", "Padre Garcia", "Rosario", "San Jose", "San Juan", "San Luis", "San Nicolas", "San Pascual",
    "Santa Teresita", "Santo Tomas", "Taal", "Talisay", "Tanauan", "Taysan", "Tingloy", "Tuy",
  ],
  "Metro Manila": [
    "Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa",
    "Navotas", "Parañaque", "Pasay", "Pasig", "Pateros", "Quezon City", "San Juan", "Taguig", "Valenzuela",
  ],
  Laguna: ["Biñan", "Cabuyao", "Calamba", "San Pedro", "Santa Rosa", "Los Baños", "San Pablo", "Sta. Cruz"],
  Bulacan: ["Malolos", "Meycauayan", "San Jose del Monte", "Marilao", "Bocaue", "Santa Maria", "Baliuag"],
  Rizal: ["Antipolo", "Cainta", "Taytay", "Binangonan", "Rodriguez", "San Mateo", "Angono"],
};

const loose = (s) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(city of|city)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const PROVINCE_INDEX = new Map(Object.keys(CITIES_BY_PROVINCE).map((p) => [loose(p), p]));
PROVINCE_INDEX.set("ncr", "Metro Manila");
const CITY_INDEX = new Map(); // loose city -> [{city, province}]
for (const [province, cities] of Object.entries(CITIES_BY_PROVINCE)) {
  for (const city of cities) {
    const k = loose(city);
    CITY_INDEX.set(k, [...(CITY_INDEX.get(k) ?? []), { city, province }]);
  }
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

// Exact (accent/case-insensitive) match, then prefix ("tanz" → Tanza), then typo distance ≤ 2.
function closest(value, index) {
  const k = loose(value);
  if (!k) return null;
  if (index.has(k)) return { key: k, how: "exact" };
  const keys = [...index.keys()];
  const prefix = keys.filter((c) => k.length >= 3 && c.startsWith(k));
  if (prefix.length === 1) return { key: prefix[0], how: "prefix" };
  let best = null;
  for (const c of keys) {
    const d = levenshtein(k, c);
    if (d <= 2 && (!best || d < best.d)) best = { key: c, d };
  }
  return best ? { key: best.key, how: "typo" } : null;
}

const isAllCaps = (s) => {
  const letters = (s ?? "").replace(/[^A-Za-zÑñ]/g, "");
  return letters.length >= 4 && letters === letters.toUpperCase();
};

const VAGUE_WORDS = new Set([
  "house", "and", "lot", "condo", "condominium", "unit", "for", "sale", "townhouse", "property", "home",
  "rfo", "preselling", "pre", "selling", "ready", "occupancy", "affordable", "bungalow", "single",
  "attached", "available", "brand", "new", "rush", "cheap", "sell", "only", "sqm", "the", "a", "in", "at",
  "detached", "model", "duplex", "rent", "lease", "pasalo",
]);
const PLACE_WORDS = new Set(
  [...Object.keys(CITIES_BY_PROVINCE), ...Object.values(CITIES_BY_PROVINCE).flat()].flatMap((x) => loose(x).split(" ")),
);

function titleProblems(p) {
  const out = [];
  const t = (p.title ?? "").trim();
  if (isAllCaps(t)) out.push("ALL CAPS title");
  const words = loose(t).split(" ").filter(Boolean);
  // A good title names the project/subdivision; generic words and place names alone don't count.
  const projectWords = words.filter((w) => !VAGUE_WORDS.has(w) && !PLACE_WORDS.has(w) && !/^\d+$/.test(w));
  if (projectWords.length === 0) out.push("vague title (no project or subdivision name)");
  if (t.length > 80) out.push(`very long title (${t.length} chars)`);
  return out;
}

function locationProblems(p) {
  const out = [];
  const city = (p.city ?? "").trim();
  const province = (p.province ?? "").trim();

  if (!city) out.push("missing city");
  if (!province) out.push("missing province");
  if (isAllCaps(city)) out.push(`city is ALL CAPS ("${city}")`);
  if (isAllCaps(province)) out.push(`province is ALL CAPS ("${province}")`);
  if (/,/.test(city)) out.push(`city contains a comma ("${city}")`);
  if (/,/.test(province)) out.push(`province contains a comma ("${province}")`);
  if (city && loose(city) === loose(province)) out.push(`city equals province ("${city}, ${province}")`);
  if (city !== city.replace(/\s+/g, " ") || province !== province.replace(/\s+/g, " "))
    out.push("extra spaces in city/province");

  // Swapped fields: city looks like a province and province looks like a city.
  const cityAsProvince = PROVINCE_INDEX.has(loose(city));
  const provinceAsCity = CITY_INDEX.has(loose(province));
  if (cityAsProvince && provinceAsCity) out.push(`city/province look swapped ("${city}, ${province}")`);

  let suggestion = null;
  // The city field sometimes holds "Tanza, Cavite" or "TANZA CAVITE"; strip the province part.
  let cityCore = city.split(",")[0];
  for (const prov of PROVINCE_INDEX.keys()) {
    const lc = loose(cityCore);
    if (lc !== prov && lc.endsWith(` ${prov}`)) {
      out.push(`city includes the province ("${city}")`);
      cityCore = lc.slice(0, -prov.length - 1);
    }
  }
  const pm = closest(province, PROVINCE_INDEX);
  const cm = closest(cityAsProvince && provinceAsCity ? province : cityCore, CITY_INDEX);

  if (!pm && province && !cityAsProvince) out.push(`unknown province "${province}" (not in audit list — check spelling)`);
  if (cm) {
    const options = CITY_INDEX.get(cm.key);
    const wantedProvince = pm ? PROVINCE_INDEX.get(pm.key) : cityAsProvince ? PROVINCE_INDEX.get(loose(city)) : null;
    const match = options.find((o) => o.province === wantedProvince) ?? (options.length === 1 ? options[0] : null);
    if (match) suggestion = { city: match.city, province: match.province };
  } else if (city && !cityAsProvince) {
    out.push(`unknown city "${city}" (not in audit list — check spelling)`);
  }
  if (!suggestion && pm && PROVINCE_INDEX.get(pm.key) !== province) {
    suggestion = { city, province: PROVINCE_INDEX.get(pm.key) };
  }

  if (suggestion && (suggestion.city !== city || suggestion.province !== province)) {
    if (!out.length) out.push("inconsistent spelling/format");
    return { problems: out, suggestion };
  }
  return { problems: out, suggestion: out.length && suggestion ? suggestion : null };
}

function attributeProblems(p) {
  const out = [];
  const isCondo = p.property_type === "Condominium";
  const isLot = p.property_type === "Lot & Land";
  if (isCondo && p.bedrooms === 0) out.push("condo with 0 bedrooms (show as Studio, or data error?)");
  if (isCondo && p.bedrooms === null) out.push("condo with no bedroom count");
  if (!isCondo && !isLot && p.bedrooms === 0) out.push(`${p.property_type} with 0 bedrooms`);
  if (isCondo && p.floor_area == null) out.push("condo missing floor_area");
  if (isCondo && p.lot_area != null && p.floor_area == null) out.push("condo has lot_area but no floor_area (probably entered in the wrong field)");
  if (!isCondo && !isLot && p.floor_area == null) out.push("house missing floor_area");
  if (isLot && p.lot_area == null) out.push("lot missing lot_area");
  if (!p.price || p.price <= 0) out.push("price is 0 or missing");
  if (!p.property_images?.length) out.push("no photos");
  if (!p.description?.trim()) out.push("no description");
  return out;
}

function findDuplicates(rows) {
  const groups = new Map();
  const add = (reason, k, p) => {
    if (!k) return;
    const id = `${reason}|${k}`;
    groups.set(id, { reason, items: [...(groups.get(id)?.items ?? []), p] });
  };
  for (const p of rows) {
    add("same title", loose(p.title), p);
    add(
      "same type + city + price + bedrooms",
      [p.property_type, loose(p.city), p.price, p.bedrooms ?? "-", p.lot_area ?? "-"].join("|"),
      p,
    );
    const img = p.property_images?.[0]?.image_url;
    if (img) add("same first photo", img, p);
  }
  // Collapse groups that list the exact same set of listings.
  const seen = new Set();
  const out = [];
  for (const g of groups.values()) {
    if (g.items.length < 2) continue;
    const sig = g.items.map((p) => p.id).sort().join(",");
    const prev = out.find((o) => o.sig === sig);
    if (prev) {
      prev.reasons.push(g.reason);
      continue;
    }
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push({ sig, reasons: [g.reason], items: g.items });
  }
  return out;
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { data: rows, error } = await supabase
  .from("properties")
  .select("*, property_images(image_url)")
  .order("created_at", { ascending: true });
if (error) {
  console.error("Supabase error:", error.message);
  process.exit(1);
}

const report = rows.map((p) => {
  const loc = locationProblems(p);
  return {
    id: p.id,
    title: p.title,
    type: p.property_type,
    city: p.city,
    province: p.province,
    title_problems: titleProblems(p),
    location_problems: loc.problems,
    location_suggestion: loc.suggestion,
    attribute_problems: attributeProblems(p),
  };
});
const duplicates = findDuplicates(rows);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ total: rows.length, report, duplicates }, null, 2));
} else {
  printReport();
}

function printReport() {

const short = (id) => id.slice(0, 8);
const line = (p) => `  [${short(p.id)}] ${p.title}  —  ${p.city}, ${p.province}`;

console.log(`\nAUDITED ${rows.length} LISTINGS (read-only, nothing changed)\n`);

const titled = report.filter((r) => r.title_problems.length);
console.log(`== TITLES (${titled.length}) ==`);
for (const r of titled) console.log(`${line(r)}\n      → ${r.title_problems.join("; ")}`);

const located = report.filter((r) => r.location_problems.length || r.location_suggestion);
console.log(`\n== CITY / PROVINCE (${located.length}) ==`);
for (const r of located) {
  const fix = r.location_suggestion ? `  ⇒ suggest "${r.location_suggestion.city}, ${r.location_suggestion.province}"` : "";
  console.log(`${line(r)}\n      → ${r.location_problems.join("; ")}${fix}`);
}

console.log(`\n== POSSIBLE DUPLICATES (${duplicates.length} groups) ==`);
for (const d of duplicates) {
  console.log(`  (${d.reasons.join(", ")})`);
  for (const p of d.items) console.log(`  ${line(p)}  ₱${Number(p.price).toLocaleString("en-PH")}  created ${p.created_at.slice(0, 10)}`);
}

const attrs = report.filter((r) => r.attribute_problems.length);
console.log(`\n== BEDROOMS / AREA / PRICE / PHOTOS (${attrs.length}) ==`);
for (const r of attrs) console.log(`${line(r)}  [${r.type}]\n      → ${r.attribute_problems.join("; ")}`);
console.log("");
}
