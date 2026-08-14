import type { Metadata } from "next";
import CarsClient from "./CarsClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Avtomobillər | Carbon Rent A Car",
  description:
    "Carbon avtomobil parkını kəşf edin: ekonom, biznes, SUV, sport və transfer avtomobilləri. Yanacaq, oturacaq, mühərrik və qiymətə görə uyğun avtomobili seçin.",
  path: "/avtomobiller",
  keywords: [
    "avtomobil parkı Bakı",
    "kirayə maşın siyahısı",
    "ekonom avtomobil icarəsi Bakı",
    "biznes avtomobil icarəsi Bakı",
    "SUV icarəsi Bakı",
    "sport avtomobil icarəsi",
  ],
});

export default function CarsPage() {
  return <CarsClient />;
}
