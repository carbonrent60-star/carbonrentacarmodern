import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import { createPageMetadata } from "@/lib/seo";
import ServicesClient from "./ServicesClient";
import "./services.css";

export const metadata: Metadata = createPageMetadata({
  title: "Xidmətlərimiz | Carbon Rent A Car",
  description:
    "Carbon Rent A Car xidmətləri — gündəlik və uzunmüddətli avtomobil icarəsi, hava limanı transferi, toy avtomobilləri, sürücüsüz icarə və SUV xidmətləri.",
  path: "/xidmetler",
});

export default function ServicesPage() {
  return (
    <>
      <CarbonNavbar light />
      <ServicesClient />
    </>
  );
}
