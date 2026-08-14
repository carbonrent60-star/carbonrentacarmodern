import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import HomeClient from "./HomeClient";
import {
  faqJsonLd,
  serviceCatalogJsonLd,
  createPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Carbon Rent A Car | Bakıda Premium Avtomobil İcarəsi",
  description:
    "Bakıda premium avtomobil icarəsi, transfer xidməti və toy avtomobilləri. Carbon Rent A Car ilə avtomobil seçimi, rezervasiya və təhvil prosesi rahat və şəffafdır.",
  path: "/",
  keywords: [
    "Bakıda premium avtomobil icarəsi",
    "rent a car Bakı",
    "Bakı maşın icarəsi",
    "Carbon Rent A Car",
    "hava limanı transferi",
    "toy avtomobilləri Bakı",
  ],
});

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          serviceCatalogJsonLd(),
          faqJsonLd([
            {
              question: "Bakıda avtomobil icarəsi üçün necə rezervasiya edə bilərəm?",
              answer:
                "Saytda avtomobil seçib rezervasiya formasını doldura, WhatsApp və ya telefonla Carbon Rent A Car komandası ilə əlaqə saxlaya bilərsiniz.",
            },
            {
              question: "Carbon Rent A Car hansı xidmətləri göstərir?",
              answer:
                "Gündəlik və uzunmüddətli avtomobil icarəsi, hava limanı transferi, toy avtomobilləri və region səfərləri üçün avtomobil seçimləri təqdim olunur.",
            },
            {
              question: "Avtomobil Bakıda ünvana çatdırıla bilər?",
              answer:
                "Mümkün vaxt və ünvanlar üzrə çatdırılma əvvəlcədən dəqiqləşdirilir və rezervasiya zamanı təsdiqlənir.",
            },
          ]),
        ]}
      />
      <HomeClient />
    </>
  );
}
