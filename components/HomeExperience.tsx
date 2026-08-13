"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCarbonCopy } from "@/lib/carbon-locale";
import {
  ArrowRight,
  CarFront,
  Clock3,
  Gem,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const advantages = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Etibarlı xidmət",
    text: "Səfərinizin hər mərhələsində aydın şərtlər və diqqətli xidmət.",
  },
  {
    number: "02",
    icon: CarFront,
    title: "Seçilmiş avtomobillər",
    text: "Gündəlik istifadə, biznes və xüsusi günlər üçün seçilmiş modellər.",
  },
  {
    number: "03",
    icon: Clock3,
    title: "Vaxtınıza uyğun",
    text: "Avtomobil seçimi və təhvil prosesini mümkün qədər rahat qururuq.",
  },
  {
    number: "04",
    icon: MapPin,
    title: "Bakı və ətrafı",
    text: "Şəhər daxili icarədən hava limanı və transfer ehtiyaclarına qədər.",
  },
];

export default function HomeExperience() {
  const { copy } = useCarbonCopy();
  const localizedAdvantages = advantages.map((item, index) => ({
    ...item,
    title: copy.homeExperience.advantages[index][0],
    text: copy.homeExperience.advantages[index][1],
  }));

  return (
    <>
      {/* ====================================================
          SERVICES / TWO PRIMARY USE CASES
          ==================================================== */}
      <section className="home-experience">
        <div className="home-experience-inner">
          <motion.div
            className="home-experience-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease }}
          >
            <div>
              <span className="home-kicker">{copy.homeExperience.kicker}</span>

              <h2>
                {copy.homeExperience.title1}
                <br />
                <em>{copy.homeExperience.title2}</em>
              </h2>
            </div>

            <p>{copy.homeExperience.intro}</p>
          </motion.div>

          <div className="home-service-grid">
            <motion.article
              className="home-service-card home-service-card--wedding"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="home-service-card-top">
                <span>{copy.homeExperience.services[0].top}</span>
                <Sparkles size={19} strokeWidth={1.35} />
              </div>

              <div className="home-service-card-content">
                <span className="home-service-eyebrow">
                  {copy.homeExperience.services[0].eyebrow}
                </span>

                <h3>
                  {copy.homeExperience.services[0].title1}
                  <br />
                  <em>{copy.homeExperience.services[0].title2}</em>
                </h3>

                <p>{copy.homeExperience.services[0].text}</p>

                <Link href="/toy-avtomobilleri">
                  {copy.homeExperience.services[0].action}
                  <ArrowRight size={15} strokeWidth={1.5} />
                </Link>
              </div>

              <div className="home-service-watermark">
                <Gem size={150} strokeWidth={0.55} />
              </div>
            </motion.article>

            <motion.article
              className="home-service-card home-service-card--transfer"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.8, delay: 0.08, ease }}
            >
              <div className="home-service-card-top">
                <span>02 / TRANSFER</span>
                <MapPin size={19} strokeWidth={1.35} />
              </div>

              <div className="home-service-card-content">
                <span className="home-service-eyebrow">
                  {copy.homeExperience.services[1].eyebrow}
                </span>

                <h3>
                  {copy.homeExperience.services[1].title1}
                  <br />
                  <em>{copy.homeExperience.services[1].title2}</em>
                </h3>

                <p>{copy.homeExperience.services[1].text}</p>

                <Link href="/avtomobiller">
                  {copy.homeExperience.services[1].action}
                  <ArrowRight size={15} strokeWidth={1.5} />
                </Link>
              </div>

              <div className="home-service-watermark">
                <CarFront size={165} strokeWidth={0.5} />
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ====================================================
          WHY CARBON
          ==================================================== */}
      <section className="home-why">
        <div className="home-experience-inner">
          <div className="home-why-head">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="home-kicker">{copy.homeExperience.whyKicker}</span>

              <h2>
                {copy.homeExperience.whyTitle1}
                <br />
                <em>{copy.homeExperience.whyTitle2}</em>
              </h2>
            </motion.div>

            <span className="home-section-index">03</span>
          </div>

          <div className="home-advantage-grid">
            {localizedAdvantages.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.number}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.06,
                    ease,
                  }}
                >
                  <div className="home-advantage-top">
                    <Icon size={21} strokeWidth={1.3} />
                    <span>{item.number}</span>
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
}
