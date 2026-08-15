import { createClient } from "@supabase/supabase-js";
import {
  cars as fallbackCars,
  type Car,
  type CarCategory,
  type CarVariant,
} from "@/data/cars";
import { getSupabasePublicConfig } from "./config";
import type { CarRow, Json } from "./database.types";

let publicSupabaseClient: ReturnType<typeof createClient> | null = null;

const transferPriceKeys = [
  "baku",
  "seaBreeze",
  "qabala",
  "ismayilli",
  "quba",
  "shamaxi",
  "shaki",
  "shusha",
  "lankaran",
] as const;

const rentalPriceKeys = [
  "days1to3",
  "days4to7",
  "days8to15",
  "days16to24",
  "days25to30",
  "days30plus",
] as const;

const carCategories: CarCategory[] = [
  "Econom",
  "Comfort",
  "Business",
  "SUV",
  "Miniven",
  "Sport",
];

function numberOrNull(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readObject(value: Json | undefined) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function readVariants(value: Json | undefined): CarVariant[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      const variant = readObject(item);
      const rentalPrices = readObject(variant.rentalPrices);
      const label =
        typeof variant.label === "string" && variant.label.trim()
          ? variant.label.trim()
          : `Variant ${index + 1}`;
      const id =
        typeof variant.id === "string" && variant.id.trim()
          ? variant.id.trim()
          : label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        id,
        label,
        manufactureYear: numberOrNull(variant.manufactureYear),
        bodyStyle:
          typeof variant.bodyStyle === "string" && variant.bodyStyle.trim()
            ? variant.bodyStyle.trim()
            : null,
        engine:
          typeof variant.engine === "string" && variant.engine.trim()
            ? variant.engine.trim()
            : null,
        thumbnail:
          typeof variant.thumbnail === "string" && variant.thumbnail.trim()
            ? variant.thumbnail.trim()
            : null,
        rentalPrices: Object.fromEntries(
          rentalPriceKeys.map((key) => [key, numberOrNull(rentalPrices[key])])
        ) as Car["rentalPrices"],
      };
    })
    .filter((variant) =>
      Object.values(variant.rentalPrices).some(
        (price) => typeof price === "number"
      )
    );
}

function normalizeCategory(category: string): CarCategory {
  return carCategories.includes(category as CarCategory)
    ? (category as CarCategory)
    : "Econom";
}

function inferManufactureYear(slug: string, title: string) {
  const match = `${slug} ${title}`.match(/\b(19\d{2}|20\d{2})\b/);
  const year = match ? Number(match[1]) : null;

  return year && year >= 1990 && year <= 2035 ? year : null;
}

export function rowToCar(row: CarRow): Car {
  const transferPrices = readObject(row.transfer_prices);
  const rentalPrices = readObject(row.rental_prices);

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    title: row.title,
    category: normalizeCategory(row.category),
    manufactureYear: row.manufacture_year ?? inferManufactureYear(row.slug, row.title),
    seats: row.seats,
    baggage: row.baggage,
    smallBaggage: row.small_baggage,
    thumbnail: row.thumbnail,
    fuel: row.fuel,
    engine: row.engine,
    transmission: row.transmission,
    weddingAvailable: row.wedding_available,
    weddingThumbnail: row.wedding_thumbnail,
    rentalVisible: row.rental_visible,
    weddingPrice: row.wedding_price,
    weddingDescription: row.wedding_description,
    transferAvailable: row.transfer_available,
    transferPrices: Object.fromEntries(
      transferPriceKeys.map((key) => [key, numberOrNull(transferPrices[key])])
    ) as Car["transferPrices"],
    rentalPrices: Object.fromEntries(
      rentalPriceKeys.map((key) => [key, numberOrNull(rentalPrices[key])])
    ) as Car["rentalPrices"],
    variants: readVariants(row.variants),
  };
}

export function carToRow(car: Car, sortOrder = 0): CarRow {
  return {
    id: car.id,
    slug: car.slug,
    brand: car.brand,
    title: car.title,
    category: car.category,
    manufacture_year: car.manufactureYear ?? inferManufactureYear(car.slug, car.title),
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
    variants: car.variants ?? [],
    sort_order: sortOrder,
    is_active: true,
  };
}

export async function fetchPublicCars() {
  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  publicSupabaseClient ??= createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const supabase = publicSupabaseClient;
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data?.length) {
    return null;
  }

  return data.map((row) => rowToCar(row as CarRow));
}

export async function getCarsForSite() {
  return (await fetchPublicCars()) ?? fallbackCars;
}

export async function getCarForSite(slug: string) {
  const cars = await getCarsForSite();
  return cars.find((car) => car.slug === slug) ?? null;
}

export { fallbackCars, rentalPriceKeys, transferPriceKeys, carCategories };
