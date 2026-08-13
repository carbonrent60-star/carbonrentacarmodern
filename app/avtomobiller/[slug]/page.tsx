import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import { getCarsForSite } from "@/lib/supabase/cars";
import {
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
        (item.category === car.category || item.brand === car.brand)
    )
    .slice(0, 3);

  return <CarDetailClient car={car} relatedCars={relatedCars} />;
}
