import { notFound } from "next/navigation";
import { transferCars } from "@/data/cars";
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

  const car = transferCars.find(
    (item) => item.slug === slug
  );

  if (!car) {
    notFound();
  }

  const relatedCars = transferCars
    .filter((item) => item.slug !== car.slug)
    .slice(0, 4);

  return (
    <TransferDetailClient
      car={car}
      relatedCars={relatedCars}
    />
  );
}
