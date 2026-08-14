import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import StructuredData from "@/components/StructuredData";
import {
  faqJsonLd,
  serviceCatalogJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import ServicesClient from "./ServicesClient";
import "./services.css";

export const metadata: Metadata = createPageMetadata({
  title: "Xidmətlərimiz | Carbon Rent A Car",
  description:
    "Carbon Rent A Car xidmətləri — gündəlik və uzunmüddətli avtomobil icarəsi, hava limanı transferi, toy avtomobilləri, sürücüsüz icarə və SUV xidmətləri.",
  path: "/xidmetler",
  keywords: [
    "avtomobil icarəsi xidmətləri",
    "uzunmüddətli avtomobil icarəsi",
    "gündəlik avtomobil icarəsi",
    "hava limanı transfer xidməti",
    "toy avtomobili xidməti",
    "sürücüsüz avtomobil icarəsi",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <StructuredData
        data={[
          serviceCatalogJsonLd(),
          faqJsonLd([
            {
              question: "Carbon Rent A Car hansı transfer marşrutlarını təqdim edir?",
              answer:
                "Bakı hava limanı, Sea Breeze, Qəbələ, Quba, Şamaxı, Şəki, Şuşa, Lənkəran və digər istiqamətlər üçün transfer seçimləri mövcuddur.",
            },
            {
              question: "Sürücüsüz avtomobil icarəsi mümkündür?",
              answer:
                "Bəli, uyğun şərtlər və sənədlər təsdiqləndikdən sonra sürücüsüz avtomobil icarəsi mümkündür.",
            },
            {
              question: "Korporativ avtomobil icarəsi təklif olunur?",
              answer:
                "Biznes görüşləri, komanda səfərləri və uzunmüddətli istifadə üçün korporativ avtomobil icarəsi razılaşdırıla bilər.",
            },
          ]),
        ]}
      />
      <CarbonNavbar light />
      <ServicesClient />
    </>
  );
}
