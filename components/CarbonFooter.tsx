"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCarbonCopy } from "@/lib/carbon-locale";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Phone,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CarbonFooter() {
  const { copy } = useCarbonCopy();
  const t = useTranslations("nav");
  const localizedNavigation = [
    { label: t("home"), href: "/" },
    { label: t("cars"), href: "/avtomobiller" },
    { label: t("weddingCars"), href: "/toy-avtomobilleri" },
    { label: t("blog"), href: "/blog" },
  ];
  const localizedInformation = [
    { label: t("about"), href: "/haqqimizda" },
    { label: t("contact"), href: "/elaqe" },
    { label: copy.footer.legal[0], href: "/sertler" },
    { label: copy.footer.legal[1], href: "/mexfilik-siyaseti" },
  ];

  return (
    <footer className="carbon-global-footer">
      <div className="carbon-footer-glow carbon-footer-glow-one" />
      <div className="carbon-footer-glow carbon-footer-glow-two" />

      <div className="carbon-footer-shell">
        <motion.section
          className="carbon-footer-cta"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="carbon-footer-cta-copy">
            <div className="carbon-footer-eyebrow">
              <span />
              CARBON RENT A CAR
            </div>

            <h2>
              {copy.footer.heading1}
              <br />
              <em>{copy.footer.heading2}</em>
            </h2>
          </div>

          <div className="carbon-footer-cta-side">
            <p>
              {copy.footer.intro}
            </p>

            <Link href="/avtomobiller" className="carbon-footer-main-action">
              <span>{copy.footer.action}</span>

              <span className="carbon-footer-main-action-icon">
                <ArrowRight size={18} strokeWidth={1.6} />
              </span>
            </Link>
          </div>
        </motion.section>



        <div className="carbon-footer-main">
          <motion.div
            className="carbon-footer-brand"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease }}
          >
            <Link
              href="/"
              className="carbon-footer-wordmark"
              aria-label="Carbon Rent A Car"
            >
              CARBON
            </Link>

            <p>
              {copy.footer.brandText1}
              <br />
              {copy.footer.brandText2}
            </p>

            <div className="carbon-footer-status">
              <span>
                <i />
                {copy.footer.active}
              </span>

              <span>
                <Check size={12} strokeWidth={2} />
                AZ
              </span>
            </div>
          </motion.div>

          <div className="carbon-footer-columns">
            <div className="carbon-footer-column">
              <span className="carbon-footer-column-title">
                {copy.footer.navigation}
              </span>

              {localizedNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span>{item.label}</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </Link>
              ))}
            </div>

            <div className="carbon-footer-column">
              <span className="carbon-footer-column-title">
                {copy.footer.information}
              </span>

              {localizedInformation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span>{item.label}</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </Link>
              ))}
            </div>

            <div className="carbon-footer-column carbon-footer-contact">
              <span className="carbon-footer-column-title">
                {copy.footer.contact}
              </span>

              <a href="tel:+994554840006">
                <Phone size={13} strokeWidth={1.5} />
                <span>+994 55 484 00 06</span>
              </a>

              <a href="tel:+994504840006">
                <Phone size={13} strokeWidth={1.5} />
                <span>+994 50 484 00 06</span>
              </a>

              <a href="tel:+994994840006">
                <Phone size={13} strokeWidth={1.5} />
                <span>+994 99 484 00 06</span>
              </a>

              <a href="mailto:info@crbnrnt.com">
                <ArrowUpRight size={13} strokeWidth={1.5} />
                <span>info@crbnrnt.com</span>
              </a>

              <a
                href="https://maps.google.com/?q=Ələsgər+Qayıbov+12%2F22+Bakı"
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={13} strokeWidth={1.5} />

                <span>
                  Ələsgər Qayıbov 12/22
                  <br />
                  {copy.footer.location}
                </span>
              </a>
            </div>
          </div>
        </div>



        <div className="carbon-footer-bottom">
          <div>
            © {new Date().getFullYear()} Carbon Rent A Car
          </div>

          <div className="carbon-footer-bottom-center">
            <span>crbnrnt.com</span>
            <i />
            <span>{copy.footer.location.replace(", ", " · ")}</span>
          </div>

          <a
            href="https://bakhishov.com"
            target="_blank"
            rel="noreferrer"
            className="carbon-footer-credit"
          >
            Made by Bakhishov Brands
            <ArrowUpRight size={12} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}
