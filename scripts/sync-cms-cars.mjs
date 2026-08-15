import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

const brandLabels = {
  bmw: "BMW",
  changan: "Changan",
  chevrolet: "Chevrolet",
  ford: "Ford",
  hyundai: "Hyundai",
  kia: "Kia",
  mercedes: "Mercedes-Benz",
  rover: "Land Rover",
  toyota: "Toyota",
};

const categoryLabels = new Set([
  "Econom",
  "Comfort",
  "Business",
  "SUV",
  "Miniven",
  "Sport",
]);

const transferSlugs = new Set([
  "hyundai-elantra-2016",
  "hyundai-santafe-2019-diesel",
  "hyundai-tucson",
  "kia-optima",
  "kia-sorento",
  "kia-sportage-2016",
  "mercedes-e-class-transfer",
  "mercedes-s-class-aze",
  "mercedes-viano",
  "mercedes-vito",
  "toyota-prado",
]);

function loadEnv() {
  const envPath = path.join(root, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...parts] = trimmed.split("=");
    process.env[key.trim()] ??= parts
      .join("=")
      .trim()
      .replace(/^["']|["']$/g, "");
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === "\"" && next === "\"") {
        field += "\"";
        index += 1;
      } else if (char === "\"") {
        quoted = false;
      } else {
        field += char;
      }

      continue;
    }

    if (char === "\"") {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...body] = rows;

  return body
    .filter((item) => item.some(Boolean))
    .map((item) =>
      Object.fromEntries(headers.map((header, index) => [header, item[index] ?? ""]))
    );
}

function numberOrNull(value) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function boolValue(value) {
  return String(value).trim().toLowerCase() === "true";
}

function brandName(row) {
  const explicit = row["Brand Name"]?.trim();

  if (explicit) {
    return explicit;
  }

  const key = row["Car Brands"]?.trim().toLowerCase();
  return brandLabels[key] ?? key ?? "";
}

function carRow(row, sortOrder) {
  const slug = row["Slug *only used for website*"].trim();
  const category = row["Car Category"].trim();

  return {
    id: slug,
    slug,
    brand: brandName(row),
    title: row.Title.trim(),
    category: categoryLabels.has(category) ? category : "Econom",
    seats: numberOrNull(row["Seating Capacity"]),
    baggage: numberOrNull(row.Baggage),
    small_baggage: numberOrNull(row["Small Baggage"]),
    thumbnail: row["Thumbnail PNG"].trim(),
    fuel: row["Fuelage, BENZIN / DIZEL"].trim() || "Benzin",
    engine: row.Engine.trim() || null,
    transmission: row.Transmission.trim() || "Avtomat",
    rental_visible: true,
    transfer_available: transferSlugs.has(slug),
    transfer_prices: {
      baku: numberOrNull(row.Baku),
      seaBreeze: numberOrNull(row["Sea Breeze"]),
      qabala: numberOrNull(row.Qabala),
      ismayilli: numberOrNull(row.Ismayilli),
      quba: numberOrNull(row.Quba),
      shamaxi: numberOrNull(row.Shamaxi),
      shaki: numberOrNull(row.Shaki),
      shusha: numberOrNull(row.Shusha),
      lankaran: numberOrNull(row.Lankaran),
    },
    rental_prices: {
      days1to3: numberOrNull(row["1-3"]),
      days4to7: numberOrNull(row["4-7"]),
      days8to15: numberOrNull(row["8-15"]),
      days16to24: numberOrNull(row["16-24"]),
      days25to30: numberOrNull(row["25-30"]),
      days30plus: numberOrNull(row["30+"]),
    },
    variants: [],
    sort_order: sortOrder,
    is_active: true,
  };
}

loadEnv();

const csvPath = process.argv[2];

if (!csvPath) {
  throw new Error("Usage: node scripts/sync-cms-cars.mjs <cms-csv-path>");
}

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const cars = rows.map((row, index) => carRow(row, index + 1));
const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { error } = await supabase.from("cars").upsert(cars, {
  onConflict: "slug",
});

if (error) {
  throw new Error(error.message);
}

const { data: allCars, error: readError } = await supabase
  .from("cars")
  .select("slug,title,category,transfer_available,wedding_available,sort_order");

if (readError) {
  throw new Error(readError.message);
}

const duplicateGroups = new Map();

for (const car of allCars) {
  if (car.wedding_available) {
    continue;
  }

  const key = `${car.category}|${car.title}`;
  duplicateGroups.set(key, [...(duplicateGroups.get(key) ?? []), car]);
}

for (const group of duplicateGroups.values()) {
  if (group.length < 2) {
    continue;
  }

  const [winner, ...duplicates] = group.sort((a, b) => {
    if (a.transfer_available !== b.transfer_available) {
      return a.transfer_available ? -1 : 1;
    }

    const aHasYear = /\b(19\d{2}|20\d{2})\b/.test(a.slug);
    const bHasYear = /\b(19\d{2}|20\d{2})\b/.test(b.slug);

    if (aHasYear !== bHasYear) {
      return aHasYear ? -1 : 1;
    }

    return a.sort_order - b.sort_order;
  });

  const hideSlugs = duplicates.map((car) => car.slug);

  await supabase
    .from("cars")
    .update({ rental_visible: true })
    .eq("slug", winner.slug);

  if (hideSlugs.length) {
    const { error: hideError } = await supabase
      .from("cars")
      .update({ rental_visible: false })
      .in("slug", hideSlugs);

    if (hideError) {
      throw new Error(hideError.message);
    }
  }
}

const transferCount = cars.filter((car) => car.transfer_available).length;
const inferredYearCount = cars.filter((car) =>
  /\b(19\d{2}|20\d{2})\b/.test(`${car.slug} ${car.title}`)
).length;

console.log(
  JSON.stringify(
    {
      synced: cars.length,
      transferEnabled: transferCount,
      rowsWithInferredYear: inferredYearCount,
    },
    null,
    2
  )
);
