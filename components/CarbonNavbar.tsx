"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import CarbonLanguageSwitcher from "./CarbonLanguageSwitcher";

const ease = [0.22, 1, 0.36, 1] as const;

type CarbonNavbarProps = {
  home?: boolean;
  ready?: boolean;
  light?: boolean;
  active?: "cars" | "wedding" | "transfer" | "blog" | "contact" | "about" | "ai";
};

export default function CarbonNavbar({
  home = false,
  ready = true,
  light = false,
  active,
}: CarbonNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");
  const chooseCarLabel =
    locale === "en"
      ? "Choose a car"
      : locale === "ru"
        ? "Подобрать авто"
        : "Avtomobil seç";

  const links = home
    ? [
        [t("cars"), "#cars", "cars"],
        [chooseCarLabel, "/avtomobil-sec", "ai"],
        [t("weddingCars"), "/toy-avtomobilleri", "wedding"],
        [t("blog"), "/blog", "blog"],
        [t("about"), "/haqqimizda", "about"],
        [t("services"), "#services", ""],
        [t("contact"), "/elaqe", "contact"],
      ]
    : [
        [t("home"), "/", ""],
        [t("cars"), "/avtomobiller", "cars"],
        [chooseCarLabel, "/avtomobil-sec", "ai"],
        [t("weddingCars"), "/toy-avtomobilleri", "wedding"],
        [t("blog"), "/blog", "blog"],
        [t("about"), "/haqqimizda", "about"],
        [t("contact"), "/elaqe", "contact"],
      ];

  const contactHref = "/elaqe";

  useEffect(() => {
    if (!menuOpen) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className={`navbar carbon-shared-navbar ${
          light ? "carbon-shared-navbar-light" : ""
        } ${menuOpen ? "carbon-mobile-nav-open" : ""}`}
        initial={{ opacity: 0, y: -18 }}
        animate={
          ready
            ? {
                opacity: 1,
                y: 0,
              }
            : {}
        }
        transition={{
          duration: 0.8,
          delay: 0.25,
          ease,
        }}
      >
        <motion.a
          className="brand"
          href="/"
          aria-label="Carbon Rent A Car"
          whileHover={{ opacity: 0.78 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src="/images/carbon-logo.webp"
            alt="Carbon Rent A Car"
            width={180}
            height={65}
            priority
            className="brand-logo"
          />
        </motion.a>

        <nav className="desktop-nav">
          {links.map(([label, href, key], index) => (
            <motion.a
              key={`${label}-${href}`}
              href={href}
              className={active && active === key ? "active" : undefined}
              initial={{ opacity: 0, y: -8 }}
              animate={
                ready
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{
                duration: 0.55,
                delay: 0.4 + index * 0.06,
                ease,
              }}
            >
              {label}
            </motion.a>
          ))}
        </nav>

        <div className="nav-actions">
          <CarbonLanguageSwitcher />

          <motion.a
            className="contact-button"
            href={contactHref}
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
          >
            {t("contactButton")}
            <ArrowRight size={16} strokeWidth={1.8} />
          </motion.a>

          <motion.button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Menyunu bağla" : "Menyunu aç"}
            aria-expanded={menuOpen}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{
                    opacity: 0,
                    rotate: -55,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 55,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.2,
                    ease,
                  }}
                >
                  <X size={20} strokeWidth={1.6} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{
                    opacity: 0,
                    rotate: 45,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -45,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.2,
                    ease,
                  }}
                >
                  <Menu size={20} strokeWidth={1.6} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="carbon-premium-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.3,
                ease,
              },
            }}
            transition={{
              duration: 0.45,
              ease,
            }}
          >
            <motion.div
              className="carbon-mobile-atmosphere"
              initial={{
                opacity: 0,
                scale: 1.08,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.04,
              }}
              transition={{
                duration: 0.9,
                ease,
              }}
            />

            <div className="carbon-mobile-inner">
              <motion.div
                className="carbon-mobile-overline"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.12,
                  duration: 0.55,
                  ease,
                }}
              >
                <span>MENYU</span>

                <CarbonLanguageSwitcher mobile />
              </motion.div>

              <nav className="carbon-mobile-navigation">
                {links.map(([label, href, key], index) => {
                  const selected = Boolean(active && active === key);

                  return (
                    <motion.a
                      key={`${label}-${href}-mobile`}
                      href={href}
                      className={selected ? "is-active" : ""}
                      onClick={() => setMenuOpen(false)}
                      initial={{
                        opacity: 0,
                        y: 34,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.65,
                        delay: 0.12 + index * 0.055,
                        ease,
                      }}
                    >
                      <span className="carbon-mobile-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="carbon-mobile-label">
                        {label}
                      </span>

                      <span className="carbon-mobile-arrow">
                        <ArrowRight
                          size={18}
                          strokeWidth={1.5}
                        />
                      </span>
                    </motion.a>
                  );
                })}
              </nav>

              <motion.footer
                className="carbon-mobile-footer"
                initial={{
                  opacity: 0,
                  y: 22,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.43,
                  duration: 0.65,
                  ease,
                }}
              >
                <div className="carbon-mobile-footer-meta">
                  <span>CARBON RENT A CAR</span>
                  <span>BAKI · AZƏRBAYCAN</span>
                </div>

                <motion.a
                  className="carbon-mobile-cta"
                  href={contactHref}
                  onClick={() => setMenuOpen(false)}
                  whileTap={{
                    scale: 0.975,
                  }}
                >
                  <span>
                    <small>BİZİMLƏ ƏLAQƏ</small>
                    <strong>{t("contactButton")}</strong>
                  </span>

                  <motion.i
                    animate={{
                      x: [0, 3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight
                      size={20}
                      strokeWidth={1.7}
                    />
                  </motion.i>
                </motion.a>
              </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
