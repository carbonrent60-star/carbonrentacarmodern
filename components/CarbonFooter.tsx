"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Headphones,
  LockKeyhole,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const navigation = [
  { label: "Ana səhifə", href: "/" },
  { label: "Avtomobillər", href: "/avtomobiller" },
  { label: "Toy avtomobilləri", href: "/toy-avtomobilleri" },
  { label: "Blog", href: "/blog" },
];

const information = [
  { label: "Haqqımızda", href: "/haqqimizda" },
  { label: "Əlaqə", href: "/elaqe" },
  { label: "Şərtlər və Qaydalar", href: "/sertler" },
  { label: "Məxfilik Siyasəti", href: "/mexfilik-siyaseti" },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "100% Təhlükəsizlik",
    text: "Kasko sığortalı və etibarlı",
  },
  {
    icon: LockKeyhole,
    title: "Təhlükəsiz ödəniş",
    text: "Qorunan rezervasiya prosesi",
  },
  {
    icon: Headphones,
    title: "24/7 Dəstək",
    text: "Hər zaman əlaqə",
  },
];

export default function CarbonFooter() {
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
              Yolunuzu seçin.
              <br />
              <em>Qalanını biz həll edək.</em>
            </h2>
          </div>

          <div className="carbon-footer-cta-side">
            <p>
              Bakı daxilində avtomobil icarəsi, xüsusi gün avtomobilləri
              və transfer xidmətləri üçün premium təcrübə.
            </p>

            <Link href="/avtomobiller" className="carbon-footer-main-action">
              <span>Avtomobil seç</span>

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
              Premium avtomobil icarəsi.
              <br />
              Bakı, Azərbaycan.
            </p>

            <div className="carbon-footer-status">
              <span>
                <i />
                Xidmət aktivdir
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
                NAVİQASİYA
              </span>

              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span>{item.label}</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </Link>
              ))}
            </div>

            <div className="carbon-footer-column">
              <span className="carbon-footer-column-title">
                MƏLUMAT
              </span>

              {information.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span>{item.label}</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </Link>
              ))}
            </div>

            <div className="carbon-footer-column carbon-footer-contact">
              <span className="carbon-footer-column-title">
                ƏLAQƏ
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
                  Bakı, Azərbaycan
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
            <span>Bakı · Azərbaycan</span>
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
