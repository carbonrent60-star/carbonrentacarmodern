import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import StructuredData from "@/components/StructuredData";
import { getCarsForSite } from "@/lib/supabase/cars";
import {
  breadcrumbJsonLd,
  carJsonLd,
  carOgImage,
  carSpecsDescription,
  createPageMetadata,
} from "@/lib/seo";
import CarDetailClient from "./CarDetailClient";

export function generateStaticParams() {
  return cars.map((car) => ({
    slug: car.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteCars = await getCarsForSite();
  const car = siteCars.find((item) => item.slug === slug);

  if (!car) {
    return createPageMetadata({
      title: "Avtomobil tapılmadı | Carbon Rent A Car",
      description:
        "Axtardığınız avtomobil tapılmadı. Carbon Rent A Car avtomobil parkına baxaraq uyğun modeli seçin.",
      path: "/avtomobiller",
    });
  }

  return createPageMetadata({
    title: `${car.title} İcarəsi | ${car.brand}`,
    description: carSpecsDescription(car),
    path: `/avtomobiller/${car.slug}`,
    image: carOgImage(car),
    keywords: [
      `${car.brand} ${car.title} icarəsi`,
      `${car.title} rent a car Bakı`,
      `${car.brand} icarəsi Bakı`,
      `${car.category} avtomobil icarəsi`,
      `${car.title} qiyməti`,
    ],
  });
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteCars = await getCarsForSite();

  const car = siteCars.find((item) => item.slug === slug);

  if (!car) {
    notFound();
  }

  const relatedCars = siteCars
    .filter(
      (item) =>
        item.slug !== car.slug &&
        item.rentalVisible !== false &&
        (item.category === car.category || item.brand === car.brand)
    )
    .slice(0, 3);

  const path = `/avtomobiller/${car.slug}`;

  return (
    <>
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Ana səhifə", path: "/" },
            { name: "Avtomobillər", path: "/avtomobiller" },
            { name: car.title, path },
          ]),
          carJsonLd(car, path),
        ]}
      />
      <CarDetailClient car={car} relatedCars={relatedCars} />
    </>
  );
}
