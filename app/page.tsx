"use client";

import { useCarbonCopy } from "@/lib/carbon-locale";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import CarCard from "@/components/CarCard";
import CarbonNavbar from "@/components/CarbonNavbar";
import HomeExperience from "@/components/HomeExperience";
import CarbonSignature from "@/components/CarbonSignature";
import HomeJourneyBoard from "@/components/HomeJourneyBoard";
import HomeTestimonials from "@/components/HomeTestimonials";
import HomeBookingBar from "@/components/HomeBookingBar";
import { featuredCars, type Car } from "@/data/cars";
import { fetchPublicCars } from "@/lib/supabase/cars";
import {
  ArrowDown,
  ArrowRight,
  Gem,
  Headphones,
  ShieldCheck,
  CarFront,
  Phone,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Home() {
  const { copy } = useCarbonCopy();
  const [ready, setReady] = useState(false);
  const [homeFeaturedCars, setHomeFeaturedCars] = useState<Car[]>(featuredCars);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchPublicCars().then((supabaseCars) => {
      if (!mounted || !supabaseCars?.length) {
        return;
      }

      const preferredSlugs = featuredCars.map((car) => car.slug);
      const preferredCars = preferredSlugs
        .map((slug) => supabaseCars.find((car) => car.slug === slug))
        .filter((car): car is Car => Boolean(car));

      setHomeFeaturedCars(
        preferredCars.length >= 3
          ? preferredCars.slice(0, 3)
          : supabaseCars
              .filter((car) => car.rentalVisible !== false)
              .slice(0, 3)
      );
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <motion.div
          className="hero-media"
          initial={{
            opacity: 0,
            scale: 1.08,
          }}
          animate={
            ready
              ? {
                  opacity: 1,
                  scale: 1,
                }
              : {}
          }
          transition={{
            duration: 1.8,
            ease,
          }}
        >
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <motion.div
          className="hero-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        />

        <CarbonNavbar
          home
          ready={ready}
        />

        <motion.div
          className="hero-content"
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
        >
          <motion.div
            className="eyebrow"
            variants={fadeUp}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease,
            }}
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.6,
                ease,
              }}
              style={{ transformOrigin: "left" }}
            />
            {copy.hero.eyebrow}
          </motion.div>

          <div className="hero-title-wrap">
            <motion.h1
              className="hero-title-line"
              initial={{
                opacity: 0,
                y: 65,
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
                duration: 0.9,
                delay: 0.52,
                ease,
              }}
            >
              {copy.hero.line1}
            </motion.h1>

            <motion.h1
              className="hero-title-line hero-title-muted"
              initial={{
                opacity: 0,
                y: 70,
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
                duration: 1,
                delay: 0.65,
                ease,
              }}
            >
              {copy.hero.line2}
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            transition={{
              duration: 0.75,
              delay: 0.82,
              ease,
            }}
          >
            {copy.hero.description}
          </motion.p>

          <motion.div
            className="hero-actions"
            variants={fadeUp}
            transition={{
              duration: 0.75,
              delay: 0.94,
              ease,
            }}
          >
            <motion.a
              className="primary-button"
              href="#cars"
              whileHover={{
                y: -3,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.975,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
            >
              <span className="hero-cta-copy">
                <span className="hero-cta-kicker">{copy.hero.collection}</span>
                <strong>{copy.hero.chooseCar}</strong>
              </span>

              <motion.span
                className="button-icon hero-cta-icon"
                whileHover={{ x: 3, rotate: -4 }}
              >
                <CarFront
                  className="hero-cta-car"
                  size={19}
                  strokeWidth={1.65}
                />
              </motion.span>
            </motion.a>

            <motion.a
              className="secondary-button"
              href="/elaqe"
              whileHover={{
                y: -3,
                backgroundColor: "rgba(255,255,255,.1)",
              }}
              whileTap={{
                scale: 0.975,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
            >
              <span className="hero-cta-contact-icon">
                <Phone size={15} strokeWidth={1.65} />
              </span>

              <span className="hero-cta-copy">
                <span className="hero-cta-kicker">{copy.hero.support}</span>
                <strong>{copy.hero.contactUs}</strong>
              </span>

              <span className="hero-cta-secondary-arrow">
                <ArrowRight size={15} strokeWidth={1.7} />
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-bottom"
          initial={{
            opacity: 0,
            y: 18,
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
            delay: 1.05,
            ease,
          }}
        >
          <div className="benefits">
            <motion.div
              className="benefit"
              whileHover={{ y: -3 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
            >
              <Headphones size={24} strokeWidth={1.4} />

              <div>
                <strong>24/7</strong>
                <span>{copy.hero.support247Text}</span>
              </div>
            </motion.div>

            <motion.div
              className="benefit"
              whileHover={{ y: -3 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
            >
              <Gem size={24} strokeWidth={1.4} />

              <div>
                <strong>Premium</strong>
                <span>{copy.hero.premiumText}</span>
              </div>
            </motion.div>

            <motion.div
              className="benefit benefit-third"
              whileHover={{ y: -3 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
            >
              <ShieldCheck size={25} strokeWidth={1.4} />

              <div>
                <strong>{copy.hero.insured}</strong>
                <span>{copy.hero.insuredText}</span>
              </div>
            </motion.div>
          </div>

          <a href="#cars" className="scroll-indicator">
            <span>{copy.homeExperience.ctaAction}</span>

            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                type: "tween",
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={16} strokeWidth={1.6} />
            </motion.div>
          </a>
        </motion.div>
      </section>

      <HomeBookingBar />

      <section className="fleet-intro" id="cars">
        <div className="fleet-inner">
          <motion.div
            className="fleet-top"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">CARBON FLEET</span>
            <span className="section-number">01</span>
          </motion.div>

          <div className="fleet-heading">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease }}
            >
              {copy.homeExperience.ctaTitle1}
              <br />
              <span>{copy.homeExperience.ctaAction}.</span>
            </motion.h2>

            <motion.div
              className="fleet-heading-side"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <p>
                {copy.homeExperience.intro}
              </p>

              <Link href="/avtomobiller" className="text-link">
                {copy.booking.allCars}
                <ArrowRight size={15} strokeWidth={1.6} />
              </Link>
            </motion.div>
          </div>

          <div className="car-grid">
            {homeFeaturedCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CarbonSignature />
      <HomeJourneyBoard />
      <HomeTestimonials />
      <HomeExperience />
    </main>
  );
}
