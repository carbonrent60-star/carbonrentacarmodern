import type { Metadata } from "next";
import type { Car } from "@/data/cars";
import { getSeoKeywords } from "./seo-keywords";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crbnrnt.com";
export const siteName = "Carbon Rent A Car";
export const defaultOgImage =
  "https://framerusercontent.com/images/9COLZXFQGbphA5FQIU3hVyFBdos.png";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  image = defaultOgImage,
  type = "website",
  noIndex = false,
  keywords = [],
}: SeoInput): Metadata {
  const imageUrl = image || defaultOgImage;
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const keywordList = getSeoKeywords(keywords);

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description,
    applicationName: siteName,
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    keywords: keywordList,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: "car rental",
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
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
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
    appleWebApp: {
      capable: true,
      title: siteName,
      statusBarStyle: "black-translucent",
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoRental"],
    "@id": absoluteUrl("/#organization"),
    name: siteName,
    url: siteUrl,
    image: defaultOgImage,
    logo: absoluteUrl("/images/carbon-logo.webp"),
    description:
      "Bakıda premium avtomobil icarəsi, transfer xidməti və toy avtomobilləri təqdim edən Carbon Rent A Car.",
    areaServed: [
      "Bakı",
      "Azərbaycan",
      "Heydər Əliyev Hava Limanı",
      "Qəbələ",
      "Quba",
      "Şamaxı",
      "Şəki",
      "Şuşa",
      "Lənkəran",
    ],
    priceRange: "$$",
    sameAs: [siteUrl],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        areaServed: "AZ",
        availableLanguage: ["az", "en", "ru"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteName,
    url: siteUrl,
    inLanguage: "az",
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/avtomobiller")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function carJsonLd(car: Car, path: string, context = "Avtomobil icarəsi") {
  const price = carStartingPrice(car);

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Vehicle"],
    "@id": absoluteUrl(`${path}#vehicle`),
    name: `${car.brand} ${car.title}`,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    model: car.title,
    vehicleModelDate: car.manufactureYear ?? undefined,
    bodyType: car.category,
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    seatingCapacity: car.seats ?? undefined,
    image: carOgImage(car),
    description: carSpecsDescription(car, context),
    url: absoluteUrl(path),
    offers: price
      ? {
          "@type": "Offer",
          price,
          priceCurrency: "AZN",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(path),
        }
      : undefined,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  image,
  path,
  date,
}: {
  title: string;
  description: string;
  image: string;
  path: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: absoluteUrl(path),
    author: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
  };
}
