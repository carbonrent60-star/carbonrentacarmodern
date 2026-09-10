import type { Metadata } from "next";
import { getCarForSite } from "@/lib/supabase/cars";
import { createPageMetadata } from "@/lib/seo";
import TransferCheckout from "./TransferCheckout";
import "./transfer-checkout.css";

export const metadata: Metadata = createPageMetadata({
  title: "Transfer rezervasiyasi | Carbon Rent A Car",
  description:
    "Carbon transfer sifarisini tamamlayin. Avtomobili, marsrutu, goturulme noqtelerini, vaxti ve elaqe melumatlarini rahat secin.",
  path: "/transfer-rezervasiya",
  keywords: [
    "Baki transfer rezervasiya",
    "airport transfer booking Baku",
    "Carbon transfer sifarisi",
    "hava limani transfer bron",
  ],
});

type Search = {
  car?: string | string[];
  route?: string | string[];
  date?: string | string[];
  time?: string | string[];
  pickup?: string | string[];
  dropoff?: string | string[];
};

function value(input?: string | string[]) {
  return Array.isArray(input) ? input[0] : input;
}

export default async function TransferReservationPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const query = await searchParams;
  const slug = value(query.car);
  const car = slug ? await getCarForSite(slug) : null;

  return (
    <TransferCheckout
      car={car}
      initial={{
        route: value(query.route) ?? "",
        date: value(query.date) ?? "",
        time: value(query.time) ?? "",
        pickup: value(query.pickup) ?? "",
        dropoff: value(query.dropoff) ?? "",
      }}
    />
  );
}
