import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import { createPageMetadata } from "@/lib/seo";
import AboutClient from "./AboutClient";
import "./about.css";

export const metadata: Metadata = createPageMetadata({
  title: "Haqqımızda | Carbon Rent A Car",
  description:
    "Carbon Rent A Car haqqında — müasir, etibarlı və premium avtomobil icarəsi xidməti.",
  path: "/haqqimizda",
  keywords: [
    "Carbon Rent A Car haqqında",
    "etibarlı avtomobil icarəsi şirkəti",
    "Bakı rent a car şirkəti",
    "premium avtomobil icarəsi komandası",
  ],
});

export default function AboutPage() {
  return (
    <>
      <CarbonNavbar light active="about" />
      <AboutClient />
    </>
  );
}
