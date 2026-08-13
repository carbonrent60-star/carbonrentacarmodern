import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

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
    const value = parts.join("=").trim().replace(/^["']|["']$/g, "");
    process.env[key.trim()] ||= value;
  }
}

function extractCars() {
  const source = fs.readFileSync(path.join(root, "data/cars.ts"), "utf8");
  const startMarker = "export const cars: Car[] = ";
  const endMarker = "\n\nexport const featuredCars";
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);

  if (start === -1 || end === -1) {
    throw new Error("Could not locate cars array in data/cars.ts");
  }

  const arraySource = source
    .slice(start + startMarker.length, end)
    .trim()
    .replace(/;$/, "");
  return Function(`"use strict"; return (${arraySource});`)();
}

function carToRow(car, sortOrder) {
  return {
    id: car.id,
    slug: car.slug,
    brand: car.brand,
    title: car.title,
    category: car.category,
    seats: car.seats,
    baggage: car.baggage,
    small_baggage: car.smallBaggage,
    thumbnail: car.thumbnail,
    fuel: car.fuel,
    engine: car.engine,
    transmission: car.transmission,
    wedding_available: car.weddingAvailable ?? false,
    wedding_thumbnail: car.weddingThumbnail ?? null,
    wedding_price: car.weddingPrice ?? null,
    wedding_description: car.weddingDescription ?? null,
    rental_visible: car.rentalVisible ?? true,
    transfer_available: car.transferAvailable,
    transfer_prices: car.transferPrices,
    rental_prices: car.rentalPrices,
    sort_order: sortOrder,
    is_active: true,
  };
}

loadEnv();

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const cars = extractCars();
const rows = cars.map((car, index) => carToRow(car, index + 1));
const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { error } = await supabase.from("cars").upsert(rows, {
  onConflict: "id",
});

if (error) {
  throw new Error(error.message);
}

console.log(`Seeded ${rows.length} cars to Supabase.`);
