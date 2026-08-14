import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import { getCarsForSite } from "@/lib/supabase/cars";
import {
  carCollectionJsonLd,
  faqJsonLd,
  createPageMetadata,
} from "@/lib/seo";
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

export default async function WeddingCarsPage() {
  const weddingCars = (await getCarsForSite()).filter(
    (car) => car.weddingAvailable
  );

  return (
    <>
      <StructuredData
        data={[
          carCollectionJsonLd({
            title: "Bakıda toy avtomobilləri",
            path: "/toy-avtomobilleri",
            cars: weddingCars,
            preferWedding: true,
          }),
          faqJsonLd([
            {
              question: "Toy avtomobili neçə saatlıq icarəyə verilir?",
              answer:
                "Toy avtomobili üçün müddət, marşrut və qiymət seçilən modelə və tədbir planına görə əvvəlcədən razılaşdırılır.",
            },
            {
              question: "Toy maşını fotosessiya üçün də sifariş edilə bilər?",
              answer:
                "Bəli, toy, nişan və fotosessiya üçün uyğun premium avtomobillər seçilə bilər.",
            },
            {
              question: "Ağ toy avtomobilləri mövcuddur?",
              answer:
                "Toy kolleksiyasında ağ və premium görünüşlü avtomobillər mövcuddur. Aktual seçim admin paneldə aktiv edilən modellərə görə dəyişir.",
            },
          ]),
        ]}
      />
      <WeddingCollectionClient />
    </>
  );
}
