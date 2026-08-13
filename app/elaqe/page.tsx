import type { Metadata } from "next";
import CarbonNavbar from "@/components/CarbonNavbar";
import { createPageMetadata } from "@/lib/seo";
import ContactClient from "./ContactClient";
import "./contact.css";

export const metadata: Metadata = createPageMetadata({
  title: "Əlaqə və Dəstək | Carbon Rent A Car",
  description:
    "Carbon Rent A Car ilə əlaqə saxlayın, ümumi sorğu göndərin, rəyinizi paylaşın və ya şikayət müraciəti yaradın.",
  path: "/elaqe",
});

export default function ContactPage() {
  return (
    <>
      <CarbonNavbar light active="contact" />
      <ContactClient />
    </>
  );
}
