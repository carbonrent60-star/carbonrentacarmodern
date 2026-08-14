import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import StructuredData from "@/components/StructuredData";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
} from "@/lib/seo";
import CarbonAiClient from "./CarbonAiClient";
import "./carbon-ai.css";

export const metadata: Metadata = createPageMetadata({
  title: "Carbon AI | Sizə uyğun avtomobili tapaq",
  description:
    "Planınızı yazın, Carbon AI real avtomobil parkından sizə uyğun icarə, transfer və ya toy avtomobili seçsin.",
  path: "/avtomobil-sec",
  keywords: [
    "avtomobil seç",
    "Carbon AI",
    "mənə uyğun avtomobil",
    "rent a car seçim köməkçisi",
    "Bakıda avtomobil tövsiyəsi",
  ],
});

export default function CarbonAiPage() {
  return (
    <>
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Ana səhifə", path: "/" },
            { name: "Avtomobil seç", path: "/avtomobil-sec" },
          ]),
          faqJsonLd([
            {
              question: "Carbon AI nə edir?",
              answer:
                "Carbon AI yazdığınız planı analiz edir və real Carbon avtomobil bazasından uyğun icarə, transfer və ya toy avtomobili variantlarını göstərir.",
            },
            {
              question: "Carbon AI real avtomobilləri göstərir?",
              answer:
                "Bəli, nəticələr Carbon Rent A Car saytındakı aktiv avtomobil, qiymət, transfer və toy məlumatları əsasında hesablanır.",
            },
          ]),
        ]}
      />
      <CarbonNavbar light active="ai" />
      <CarbonAiClient />
    </>
  );
}
