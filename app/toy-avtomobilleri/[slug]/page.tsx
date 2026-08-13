import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import { getCarsForSite } from "@/lib/supabase/cars";
import WeddingDetailClient from "./WeddingDetailClient";

export function generateStaticParams() {
  return cars
    .filter((car) => car.weddingAvailable)
    .map((car) => ({
      slug: car.slug,
    }));
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
