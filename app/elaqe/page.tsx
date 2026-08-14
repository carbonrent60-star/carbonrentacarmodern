import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import StructuredData from "@/components/StructuredData";
import {
  contactPageJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import ContactClient from "./ContactClient";
import "./contact.css";

export const metadata: Metadata = createPageMetadata({
  title: "Əlaqə və Dəstək | Carbon Rent A Car",
  description:
    "Carbon Rent A Car ilə əlaqə saxlayın, ümumi sorğu göndərin, rəyinizi paylaşın və ya şikayət müraciəti yaradın.",
  path: "/elaqe",
  keywords: [
    "Carbon Rent A Car əlaqə",
    "avtomobil icarəsi əlaqə",
    "Bakı rent a car telefon",
    "avtomobil rezervasiya dəstəyi",
  ],
});

export default function ContactPage() {
  return (
    <>
      <StructuredData data={contactPageJsonLd()} />
      <CarbonNavbar light active="contact" />
      <ContactClient />
    </>
  );
}
