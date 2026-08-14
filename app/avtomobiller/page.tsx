import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import { getCarsForSite } from "@/lib/supabase/cars";
import CarsClient from "./CarsClient";
import {
  carCollectionJsonLd,
  faqJsonLd,
  createPageMetadata,
} from "@/lib/seo";

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

export default async function CarsPage() {
  const cars = (await getCarsForSite()).filter(
    (car) => car.rentalVisible !== false
  );

  return (
    <>
      <StructuredData
        data={[
          carCollectionJsonLd({
            title: "Bakıda kirayə avtomobillər",
            path: "/avtomobiller",
            cars,
          }),
          faqJsonLd([
            {
              question: "Bakıda avtomobil icarəsi qiymətləri necə hesablanır?",
              answer:
                "Qiymət avtomobil modelinə, icarə müddətinə, mövsümə və əlavə xidmətlərə görə dəyişir. Hər avtomobil səhifəsində başlanğıc qiymətlər göstərilir.",
            },
            {
              question: "Avtomobillər sığortalıdır?",
              answer:
                "Carbon Rent A Car parkındakı avtomobillər saz, təmiz və sığortalı şəkildə təqdim olunur. Şərtlər rezervasiya zamanı dəqiqləşdirilir.",
            },
            {
              question: "Uzunmüddətli avtomobil icarəsi mümkündür?",
              answer:
                "Bəli, həftəlik və aylıq icarə üçün uyğun modellər və xüsusi qiymət aralıqları mövcuddur.",
            },
          ]),
        ]}
      />
      <CarsClient />
    </>
  );
}
