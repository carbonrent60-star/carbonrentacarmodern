import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import { getCarsForSite } from "@/lib/supabase/cars";
import CarDetailClient from "./CarDetailClient";

export function generateStaticParams() {
  return cars.map((car) => ({
    slug: car.slug,
  }));
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
