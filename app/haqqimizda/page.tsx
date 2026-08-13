import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import AboutClient from "./AboutClient";
import "./about.css";

export const metadata: Metadata = {
  title: "Haqqımızda | Carbon Rent A Car",
  description:
    "Carbon Rent A Car haqqında — müasir, etibarlı və premium avtomobil icarəsi xidməti.",
};

export default function AboutPage() {
  return (
    <>
      <CarbonNavbar light active="about" />
      <AboutClient />
    </>
  );
}
