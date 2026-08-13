import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Carbon Rent A Car | Bakıda Premium Avtomobil İcarəsi",
  description:
    "Bakıda premium avtomobil icarəsi, transfer xidməti və toy avtomobilləri. Carbon Rent A Car ilə avtomobil seçimi, rezervasiya və təhvil prosesi rahat və şəffafdır.",
  path: "/",
});

export default function HomePage() {
  return <HomeClient />;
}
