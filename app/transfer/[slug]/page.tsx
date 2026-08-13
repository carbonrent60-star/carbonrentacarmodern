import { notFound } from "next/navigation";
import { transferCars } from "@/data/cars";
import { getCarsForSite } from "@/lib/supabase/cars";
import TransferDetailClient from "./TransferDetailClient";

export function generateStaticParams() {
  return transferCars.map((car) => ({
    slug: car.slug,
  }));
}

export default async function TransferDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteTransferCars = (await getCarsForSite()).filter(
    (item) => item.transferAvailable
  );

  const car = siteTransferCars.find(
    (item) => item.slug === slug
  );

  if (!car) {
    notFound();
  }

  const relatedCars = siteTransferCars
    .filter((item) => item.slug !== car.slug)
    .slice(0, 4);

  return (
    <TransferDetailClient
      car={car}
      relatedCars={relatedCars}
    />
  );
}
