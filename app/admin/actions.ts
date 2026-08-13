"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cars as localCars, type Car, type CarCategory } from "@/data/cars";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  carCategories,
  carToRow,
  rentalPriceKeys,
  rowToCar,
  transferPriceKeys,
} from "@/lib/supabase/cars";
import { getAdminAuthConfig, getSupabaseAdminConfig } from "@/lib/supabase/config";

const adminCookieName = "carbon_admin";
const carImageBucket = "carbon-car-images";
const maxUploadBytes = 50 * 1024 * 1024;

function adminErrorRedirect(code: string): never {
  redirect(`/admin?error=${encodeURIComponent(code)}`);
}

function normalizeAdminError(error: unknown) {
  if (error instanceof Error) {
    return error.message || "unknown-error";
  }

  return "unknown-error";
}

function createAdminToken() {
  const config = getAdminAuthConfig();

  if (!config) {
    return null;
  }

  return crypto
    .createHmac("sha256", config.secret)
    .update(config.password)
    .digest("hex");
}

export async function isAdminAuthenticated() {
  const expectedToken = createAdminToken();

  if (!expectedToken) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value ?? "";
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);

  return (
    tokenBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(tokenBuffer, expectedBuffer)
  );
}

function requireAdminConfig() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("missing-supabase-admin-env");
  }

  return supabase;
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length ? value : null;
}

function numberValue(formData: FormData, key: string) {
  const value = text(formData, key);

  if (!value.length) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getUploadedImageUrl(formData: FormData, slug: string) {
  const file = formData.get("imageFile");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (file.size > maxUploadBytes) {
    throw new Error("image-too-large");
  }

  const supabase = requireAdminConfig();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const cleanExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
  const filePath = `cars/${slug}-${Date.now()}.${cleanExtension}`;
  const { error } = await supabase.storage
    .from(carImageBucket)
    .upload(filePath, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) {
    throw new Error("image-upload-failed");
  }

  return supabase.storage.from(carImageBucket).getPublicUrl(filePath).data
    .publicUrl;
}

function readCarFromForm(formData: FormData): Car & { isActive: boolean; sortOrder: number } {
  const title = text(formData, "title");
  const slug = text(formData, "slug") || slugify(title);
  const category = text(formData, "category") as CarCategory;
  const transferPrices = Object.fromEntries(
    transferPriceKeys.map((key) => [key, numberValue(formData, `transfer_${key}`)])
  ) as Car["transferPrices"];
  const rentalPrices = Object.fromEntries(
    rentalPriceKeys.map((key) => [key, numberValue(formData, `rental_${key}`)])
  ) as Car["rentalPrices"];

  return {
    id: text(formData, "id") || slug,
    slug,
    brand: text(formData, "brand"),
    title,
    category: carCategories.includes(category) ? category : "Econom",
    seats: numberValue(formData, "seats"),
    baggage: numberValue(formData, "baggage"),
    smallBaggage: numberValue(formData, "smallBaggage"),
    thumbnail: text(formData, "thumbnail"),
    fuel: text(formData, "fuel") || "Benzin",
    engine: optionalText(formData, "engine"),
    transmission: text(formData, "transmission") || "Avtomat",
    weddingAvailable: boolValue(formData, "weddingAvailable"),
    weddingThumbnail: optionalText(formData, "weddingThumbnail"),
    weddingPrice: numberValue(formData, "weddingPrice"),
    weddingDescription: optionalText(formData, "weddingDescription"),
    rentalVisible: boolValue(formData, "rentalVisible"),
    transferAvailable: boolValue(formData, "transferAvailable"),
    transferPrices,
    rentalPrices,
    isActive: boolValue(formData, "isActive"),
    sortOrder: numberValue(formData, "sortOrder") ?? 0,
  };
}

export async function loginAction(formData: FormData) {
  const config = getAdminAuthConfig();
  const token = createAdminToken();

  if (!config || !token) {
    redirect("/admin?error=missing-admin-env");
  }

  if (text(formData, "password") !== config.password) {
    redirect("/admin?error=wrong-password");
  }

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
  redirect("/admin");
}

export async function listAdminCars() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      configured: Boolean(getSupabaseAdminConfig()),
      cars: localCars,
      source: "local" as const,
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return {
      configured: true,
      cars: localCars,
      source: "local" as const,
      error: error.message,
    };
  }

  return {
    configured: true,
    cars: data?.length
      ? data.map((row) => ({
          ...rowToCar(row),
          isActive: row.is_active,
          sortOrder: row.sort_order,
        }))
      : localCars.map((car, index) => ({
          ...car,
          isActive: true,
          sortOrder: index + 1,
        })),
    source: data?.length ? ("supabase" as const) : ("local" as const),
    error: null,
  };
}

export async function seedCarsAction() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  try {
    const supabase = requireAdminConfig();
    const rows = localCars.map((car, index) => carToRow(car, index + 1));
    const { error } = await supabase.from("cars").upsert(rows, {
      onConflict: "id",
    });

    if (error) {
      throw new Error("database-save-failed");
    }
  } catch (error) {
    adminErrorRedirect(normalizeAdminError(error));
  }

  revalidatePath("/");
  revalidatePath("/avtomobiller");
  redirect("/admin?seeded=1");
}

export async function saveCarAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  let savedSlug = "";

  try {
    const supabase = requireAdminConfig();
    const car = readCarFromForm(formData);
    savedSlug = car.slug;

    if (!car.title || !car.brand || !car.slug) {
      throw new Error("required-fields-missing");
    }

    const uploadedUrl = await getUploadedImageUrl(formData, car.slug);
    const thumbnail = uploadedUrl ?? car.thumbnail;

    if (!thumbnail) {
      throw new Error("image-required");
    }

    const row = {
      ...carToRow(
        {
          ...car,
          thumbnail,
        },
        car.sortOrder
      ),
      is_active: car.isActive,
    };

    const { error } = await supabase.from("cars").upsert(row, {
      onConflict: "id",
    });

    if (error) {
      throw new Error("database-save-failed");
    }
  } catch (error) {
    adminErrorRedirect(normalizeAdminError(error));
  }

  revalidatePath("/");
  revalidatePath("/avtomobiller");
  revalidatePath(`/avtomobiller/${savedSlug}`);
  revalidatePath("/toy-avtomobilleri");
  revalidatePath("/transfer");
  redirect("/admin?saved=1");
}

export async function deleteCarAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  try {
    const id = text(formData, "id");
    const supabase = requireAdminConfig();
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      throw new Error("database-delete-failed");
    }
  } catch (error) {
    adminErrorRedirect(normalizeAdminError(error));
  }

  revalidatePath("/");
  revalidatePath("/avtomobiller");
  redirect("/admin?deleted=1");
}
