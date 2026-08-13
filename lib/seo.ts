import type { Metadata } from "next";
import type { Car } from "@/data/cars";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crbnrnt.com";
const siteName = "Carbon Rent A Car";
const defaultOgImage =
  "https://framerusercontent.com/images/9COLZXFQGbphA5FQIU3hVyFBdos.png";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  image = defaultOgImage,
  type = "website",
  noIndex = false,
}: SeoInput): Metadata {
  const imageUrl = image || defaultOgImage;
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type,
      siteName,
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

function compactList(values: Array<string | number | null | undefined>) {
  return values.filter(Boolean).join(" · ");
}

export function carStartingPrice(car: Car) {
  const prices = [
    car.rentalPrices.days1to3,
    car.rentalPrices.days4to7,
    car.rentalPrices.days8to15,
    car.rentalPrices.days16to24,
    car.rentalPrices.days25to30,
    car.rentalPrices.days30plus,
    car.weddingPrice,
  ].filter((price): price is number => typeof price === "number");

  return prices.length ? Math.min(...prices) : null;
}

export function carSpecsDescription(car: Car, context = "icarə") {
  const specs = compactList([
    car.category,
    car.manufactureYear ? `${car.manufactureYear} il` : null,
    car.seats ? `${car.seats} yer` : null,
    car.transmission,
    car.fuel,
    car.engine ? `${car.engine} mühərrik` : null,
  ]);
  const price = carStartingPrice(car);
  const priceText = price ? `Qiymət ${price} ₼-dən başlayır.` : "Qiymət üçün Carbon komandası ilə əlaqə saxlayın.";

  return `${car.brand} ${car.title} ${context}: ${specs}. ${priceText} Bakıda premium avtomobil icarəsi və rahat rezervasiya.`;
}

export function carOgImage(car: Car, preferWedding = false) {
  return preferWedding && car.weddingThumbnail
    ? car.weddingThumbnail
    : car.thumbnail;
}
