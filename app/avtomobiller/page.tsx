import type { Metadata } from "next";
import CarsClient from "./CarsClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Avtomobillər | Carbon Rent A Car",
  description:
    "Carbon avtomobil parkını kəşf edin: ekonom, biznes, SUV, sport və transfer avtomobilləri. Yanacaq, oturacaq, mühərrik və qiymətə görə uyğun avtomobili seçin.",
  path: "/avtomobiller",
});

export default function CarsPage() {
  return <CarsClient />;
}
