import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import { getCarsForSite } from "@/lib/supabase/cars";
import {
  carOgImage,
  carSpecsDescription,
  createPageMetadata,
} from "@/lib/seo";
import WeddingDetailClient from "./WeddingDetailClient";

export function generateStaticParams() {
  return cars
    .filter((car) => car.weddingAvailable)
    .map((car) => ({
      slug: car.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const weddingCars = (await getCarsForSite()).filter(
    (item) => item.weddingAvailable
  );
  const car = weddingCars.find((item) => item.slug === slug);

  if (!car) {
    return createPageMetadata({
      title: "Toy avtomobili tapılmadı | Carbon Rent A Car",
      description:
        "Toy, nişan və xüsusi günlər üçün Carbon premium avtomobil kolleksiyasına baxın.",
      path: "/toy-avtomobilleri",
    });
  }

  return createPageMetadata({
    title: `${car.title} Toy Avtomobili | ${car.brand}`,
    description: carSpecsDescription(car, "toy və xüsusi günlər üçün"),
    path: `/toy-avtomobilleri/${car.slug}`,
    image: carOgImage(car, true),
  });
}

export default async function WeddingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const weddingCars = (await getCarsForSite()).filter(
    (item) => item.weddingAvailable
  );

  const car = weddingCars.find(
    (item) => item.slug === slug
  );

  if (!car) {
    notFound();
  }

  const relatedCars = weddingCars
    .filter((item) => item.slug !== car.slug)
    .slice(0, 3);

  return (
    <WeddingDetailClient
      car={car}
      relatedCars={relatedCars}
    />
  );
}
