"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

type CarbonNavbarProps = {
  home?: boolean;
  ready?: boolean;
  light?: boolean;
  active?: "cars" | "wedding" | "transfer";
};

export default function CarbonNavbar({
  home = false,
  ready = true,
  light = false,
  active,
}: CarbonNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = home
    ? [
        ["Avtomobillər", "#cars", "cars"],
        ["Toy avtomobilləri", "/toy-avtomobilleri", "wedding"],
        ["Haqqımızda", "#about", ""],
        ["Xidmətlər", "#services", ""],
        ["Əlaqə", "#contact", ""],
      ]
    : [
        ["Ana səhifə", "/", ""],
        ["Avtomobillər", "/avtomobiller", "cars"],
        ["Toy avtomobilləri", "/toy-avtomobilleri", "wedding"],
        ["Haqqımızda", "/#about", ""],
        ["Əlaqə", "/#contact", ""],
      ];

  const contactHref = home ? "#contact" : "/#contact";

  return (
    <motion.header
      className={`navbar carbon-shared-navbar ${
        light ? "carbon-shared-navbar-light" : ""
      }`}
      initial={{
        opacity: 0,
        y: -18,
      }}
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
            initial={{
              opacity: 0,
              y: -8,
            }}
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
        <button className="language" type="button">
          AZ
          <ChevronDown size={13} strokeWidth={1.7} />
        </button>

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
          Əlaqə saxla
          <ArrowRight size={16} strokeWidth={1.8} />
        </motion.a>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Menyunu bağla" : "Menyunu aç"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={20} strokeWidth={1.7} />
          ) : (
            <Menu size={20} strokeWidth={1.7} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            transition={{
              duration: 0.3,
              ease,
            }}
          >
            {links.map(([label, href]) => (
              <a
                key={`${label}-${href}`}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
