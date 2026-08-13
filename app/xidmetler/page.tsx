import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import ServicesClient from "./ServicesClient";
import "./services.css";

export const metadata: Metadata = {
  title: "Xidmətlərimiz | Carbon Rent A Car",
  description:
    "Carbon Rent A Car xidmətləri — gündəlik və uzunmüddətli avtomobil icarəsi, hava limanı transferi, toy avtomobilləri, sürücüsüz icarə və SUV xidmətləri.",
};

export default function ServicesPage() {
  return (
    <>
      <CarbonNavbar light />
      <ServicesClient />
    </>
  );
}
