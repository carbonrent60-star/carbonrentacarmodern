import type { Metadata } from "next";
import { getCarForSite } from "@/lib/supabase/cars";
import { createPageMetadata } from "@/lib/seo";
import ReservationCheckout from "./ReservationCheckout";

export const metadata: Metadata = createPageMetadata({
  title: "Rezervasiya | Carbon Rent A Car",
  description:
    "Carbon avtomobil rezervasiyasını tamamlayın. Tarixləri, təhvil üsulunu və əlaqə məlumatlarınızı yoxlayın.",
  path: "/rezervasiya",
  keywords: [
    "avtomobil rezervasiya Bakı",
    "maşın bron etmək",
    "rent a car booking Baku",
    "online avtomobil rezervasiyası",
  ],
});

type Search = {
  car?: string | string[];
  start?: string | string[];
  end?: string | string[];
  pickup?: string | string[];
  drivers?: string | string[];
  extras?: string | string[];
};

function value(input?: string | string[]) {
  return Array.isArray(input) ? input[0] : input;
}

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const query = await searchParams;

  const slug = value(query.car);
  const car = slug ? await getCarForSite(slug) : null;

  return (
    <ReservationCheckout
      car={car}
      initial={{
        start: value(query.start) ?? "",
        end: value(query.end) ?? "",
        pickup: value(query.pickup) ?? "office",
        drivers: value(query.drivers) ?? "1",
        extras: value(query.extras) ?? "",
      }}
    />
  );
}
