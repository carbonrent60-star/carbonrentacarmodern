"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  CarFront,
  ClipboardCheck,
  KeyRound,
  Route,
} from "lucide-react";
import { useCarbonCopy, type CarbonLocale } from "@/lib/carbon-locale";

const ease = [0.22, 1, 0.36, 1] as const;

const boardCopy: Record<
  CarbonLocale,
  {
    kicker: string;
    title1: string;
    title2: string;
    intro: string;
    status: string;
    action: string;
    steps: Array<{
      title: string;
      text: string;
      tag: string;
    }>;
  }
> = {
  az: {
    kicker: "CARBON ROUTE BOARD",
    title1: "Seçimdən açara",
    title2: "qədər hər şey aydın.",
    intro:
      "Səfər məqsədinizi seçdikdən sonra proses qısa, şəffaf və rahat mərhələlərlə davam edir.",
    status: "Səfər planı hazırlanır",
    action: "Avtomobillərə bax",
    steps: [
      {
        title: "Tarixi seçin",
        text: "Götürülmə və qaytarılma tarixlərini rahatlıqla müəyyən edin.",
        tag: "01 / tarix",
      },
      {
        title: "Uyğun avtomobil",
        text: "Komanda seçiminizə uyğun avtomobil və şərtləri dəqiqləşdirir.",
        tag: "02 / seçim",
      },
      {
        title: "Təsdiq",
        text: "Qiymət, depozit və təhvil detalları əvvəlcədən aydın olur.",
        tag: "03 / təsdiq",
      },
      {
        title: "Açar hazırdır",
        text: "Avtomobil yoxlanılır, təmiz hazırlanır və vaxtında təhvil verilir.",
        tag: "04 / təhvil",
      },
    ],
  },
  en: {
    kicker: "CARBON ROUTE BOARD",
    title1: "From choice to keys,",
    title2: "everything stays clear.",
    intro:
      "After choosing the purpose of your trip, the process continues through short, transparent and comfortable steps.",
    status: "Trip plan in progress",
    action: "View cars",
    steps: [
      {
        title: "Choose dates",
        text: "Set your pick-up and return dates in a clear flow.",
        tag: "01 / dates",
      },
      {
        title: "Matching car",
        text: "The team confirms the right car and terms around your selection.",
        tag: "02 / match",
      },
      {
        title: "Confirmation",
        text: "Price, deposit and handover details are made clear in advance.",
        tag: "03 / confirm",
      },
      {
        title: "Keys ready",
        text: "The car is checked, cleaned and prepared for on-time handover.",
        tag: "04 / handover",
      },
    ],
  },
  ru: {
    kicker: "CARBON ROUTE BOARD",
    title1: "От выбора до ключей",
    title2: "всё остается понятным.",
    intro:
      "После выбора цели поездки процесс проходит через короткие, прозрачные и удобные этапы.",
    status: "План поездки готовится",
    action: "Смотреть автомобили",
    steps: [
      {
        title: "Выберите даты",
        text: "Укажите даты получения и возврата в понятном формате.",
        tag: "01 / даты",
      },
      {
        title: "Подходящий авто",
        text: "Команда уточняет автомобиль и условия под ваш выбор.",
        tag: "02 / подбор",
      },
      {
        title: "Подтверждение",
        text: "Цена, депозит и детали передачи заранее становятся понятными.",
        tag: "03 / подтверждение",
      },
      {
        title: "Ключи готовы",
        text: "Автомобиль проверяется, очищается и готовится к передаче вовремя.",
        tag: "04 / передача",
      },
    ],
  },
};

const icons = [CalendarCheck, CarFront, ClipboardCheck, KeyRound];

export default function HomeJourneyBoard() {
  const { locale } = useCarbonCopy();
  const copy = boardCopy[locale];
  const reduceMotion = useReducedMotion();

  return (
    <section className="home-journey-board">
      <div className="home-journey-board-inner">
        <motion.div
          className="home-journey-board-head"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease }}
        >
          <div>
            <span>{copy.kicker}</span>
            <h2>
              {copy.title1}
              <br />
              <em>{copy.title2}</em>
            </h2>
          </div>

          <p>{copy.intro}</p>
        </motion.div>

        <div className="home-journey-board-stage">
          <div className="home-journey-board-map" aria-hidden="true">
            <div className="home-journey-map-grid" />
            <div className="home-journey-map-status">
              <span>
                <i />
                {copy.status}
              </span>
              <Route size={18} strokeWidth={1.35} />
            </div>
            <div className="home-journey-route-line">
              <motion.i
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 1.2, ease }}
              />
              <motion.span
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        left: ["0%", "100%"],
                      }
                }
                transition={{
                  duration: 5.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <CarFront size={17} strokeWidth={1.45} />
              </motion.span>
            </div>
            <strong>BAKU</strong>
            <small>40.4093 N / 49.8671 E</small>
          </div>

          <div className="home-journey-steps">
            {copy.steps.map((step, index) => {
              const Icon = icons[index];

              return (
                <motion.article
                  key={step.tag}
                  initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.28 }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.06,
                    ease,
                  }}
                >
                  <span>{step.tag}</span>
                  <div>
                    <Icon size={19} strokeWidth={1.35} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>

        <Link href="/avtomobiller" className="home-journey-board-action">
          {copy.action}
          <span>
            <ArrowRight size={15} strokeWidth={1.6} />
          </span>
        </Link>
      </div>
    </section>
  );
}
