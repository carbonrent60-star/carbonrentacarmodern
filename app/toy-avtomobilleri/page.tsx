import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import WeddingCollectionClient from "./WeddingCollectionClient";

export const metadata: Metadata = createPageMetadata({
  title: "Toy Avtomobilləri | Carbon Rent A Car",
  description:
    "Toy, nişan, fotosessiya və xüsusi günlər üçün seçilmiş premium avtomobillər. Mercedes, Mustang, G Class və digər xüsusi modelləri Carbon ilə seçin.",
  path: "/toy-avtomobilleri",
  keywords: [
    "toy avtomobili Bakı",
    "toy üçün maşın icarəsi",
    "nişan avtomobili",
    "fotosessiya avtomobili",
    "Mercedes toy avtomobili",
    "Mustang toy avtomobili",
  ],
});

export default function WeddingCarsPage() {
  return <WeddingCollectionClient />;
}
