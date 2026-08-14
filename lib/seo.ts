import type { Metadata } from "next";
import type { Car } from "@/data/cars";
import { getSeoKeywords } from "./seo-keywords";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crbnrnt.com";
export const siteName = "Carbon Rent A Car";
export const defaultOgImage =
  "https://framerusercontent.com/images/9COLZXFQGbphA5FQIU3hVyFBdos.png";
export const businessPhone = "+994504840006";
export const businessSecondaryPhones = ["+994554840006", "+994994840006"];
export const businessEmail = "info@crbnrnt.com";
export const businessAddress = "Ələsgər Qayıbov 12/22, Bakı, Azərbaycan";

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
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },
    keywords: keywordList,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: "car rental",
    alternates: {
      canonical: path,
      languages: {
        az: path,
        en: path,
        ru: path,
        "x-default": path,
      },
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
      locale: "az_AZ",
      alternateLocale: ["en_US", "ru_RU"],
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
    other: {
      "geo.region": "AZ-BA",
      "geo.placename": "Baku",
      "geo.position": "40.4093;49.8671",
      ICBM: "40.4093, 49.8671",
      "business:contact_data:country_name": "Azerbaijan",
      "business:contact_data:locality": "Baku",
      "business:contact_data:phone_number": businessPhone,
      "business:contact_data:email": businessEmail,
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
    telephone: businessPhone,
    email: businessEmail,
    image: defaultOgImage,
    logo: absoluteUrl("/images/carbon-logo.webp"),
    description:
      "Bakıda premium avtomobil icarəsi, transfer xidməti və toy avtomobilləri təqdim edən Carbon Rent A Car.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ələsgər Qayıbov 12/22",
      addressLocality: "Bakı",
      addressCountry: "AZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.4093,
      longitude: 49.8671,
    },
    hasMap: "https://maps.google.com/?q=Ələsgər+Qayıbov+12%2F22+Bakı",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
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
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Avtomobil icarəsi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hava limanı transferi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Toy avtomobili icarəsi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Uzunmüddətli avtomobil icarəsi" } },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: businessPhone,
        email: businessEmail,
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
    sku: car.slug,
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
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(path),
          seller: {
            "@id": absoluteUrl("/#organization"),
          },
        }
      : undefined,
  };
}

export function carCollectionJsonLd({
  title,
  path,
  cars,
  preferWedding = false,
}: {
  title: string;
  path: string;
  cars: Car[];
  preferWedding?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl(`${path}#itemlist`),
    name: title,
    url: absoluteUrl(path),
    numberOfItems: cars.length,
    itemListElement: cars.slice(0, 24).map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(
        `${preferWedding ? "/toy-avtomobilleri" : "/avtomobiller"}/${car.slug}`
      ),
      item: {
        "@type": "Vehicle",
        name: `${car.brand} ${car.title}`,
        image: carOgImage(car, preferWedding),
        brand: car.brand,
        model: car.title,
      },
    })),
  };
}

export function serviceCatalogJsonLd() {
  const services = [
    {
      name: "Bakıda avtomobil icarəsi",
      description: "Gündəlik, həftəlik və uzunmüddətli avtomobil icarəsi.",
      path: "/avtomobiller",
    },
    {
      name: "Hava limanı transferi",
      description: "Heydər Əliyev Hava Limanı və şəhər/rayon transferləri.",
      path: "/xidmetler",
    },
    {
      name: "Toy avtomobili icarəsi",
      description: "Toy, nişan və fotosessiya üçün premium avtomobillər.",
      path: "/toy-avtomobilleri",
    },
    {
      name: "SUV və biznes avtomobil icarəsi",
      description: "Ailə, biznes görüşləri və region səfərləri üçün rahat avtomobillər.",
      path: "/avtomobiller",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": absoluteUrl("/xidmetler#service-catalog"),
    name: "Carbon Rent A Car xidmətləri",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      url: absoluteUrl(service.path),
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        areaServed: "Bakı və Azərbaycan",
        provider: {
          "@id": absoluteUrl("/#organization"),
        },
      },
    })),
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": absoluteUrl("/elaqe#contact"),
    name: "Carbon Rent A Car əlaqə",
    url: absoluteUrl("/elaqe"),
    mainEntity: {
      "@id": absoluteUrl("/#organization"),
    },
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absoluteUrl("/haqqimizda#about"),
    name: "Carbon Rent A Car haqqında",
    url: absoluteUrl("/haqqimizda"),
    mainEntity: {
      "@id": absoluteUrl("/#organization"),
    },
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
