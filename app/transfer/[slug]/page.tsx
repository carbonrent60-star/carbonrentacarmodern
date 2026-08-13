import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { transferCars } from "@/data/cars";
import { getCarsForSite } from "@/lib/supabase/cars";
import {
  carOgImage,
  carSpecsDescription,
  createPageMetadata,
} from "@/lib/seo";
import TransferDetailClient from "./TransferDetailClient";

export function generateStaticParams() {
  return transferCars.map((car) => ({
    slug: car.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteTransferCars = (await getCarsForSite()).filter(
    (item) => item.transferAvailable
  );
  const car = siteTransferCars.find((item) => item.slug === slug);

  if (!car) {
    return createPageMetadata({
      title: "Transfer avtomobili tapılmadı | Carbon Rent A Car",
      description:
        "Hava limanı, şəhər və fərdi marşrutlar üçün Carbon transfer avtomobillərinə baxın.",
      path: "/avtomobiller",
    });
  }

  return createPageMetadata({
    title: `${car.title} Transfer | ${car.brand}`,
    description: carSpecsDescription(car, "transfer xidməti üçün"),
    path: `/transfer/${car.slug}`,
    image: carOgImage(car),
  });
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
