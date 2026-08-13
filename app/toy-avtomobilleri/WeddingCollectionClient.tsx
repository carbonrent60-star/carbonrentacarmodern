"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  Gauge,
  Users,
} from "lucide-react";

import CarbonNavbar from "@/components/CarbonNavbar";
import { cars, type Car } from "@/data/cars";
import { useCarbonCopy } from "@/lib/carbon-locale";
import { fetchPublicCars } from "@/lib/supabase/cars";

const ease = [0.22, 1, 0.36, 1] as const;

const weddingCollectionText = {
  az: {
    back: "Ana səhifə",
    kicker: "CARBON / XÜSUSİ KOLLEKSİYA",
    hero1: "Xüsusi gününüzə",
    hero2: " xüsusi avtomobil.",
    intro:
      "Toy, nişan, fotosessiya və xüsusi tədbirlər üçün seçilmiş premium avtomobillər.",
    car: "AVTOMOBİL",
    selected: "SEÇİLMİŞ AVTOMOBİLLƏR",
    collection: "Toy kolleksiyası",
    collectionIntro:
      "Klassik, sport və premium modellər arasından xüsusi gününüzə uyğun avtomobili seçin.",
    wedding: "TOY",
    seats: "yer",
    starts: "Başlayır",
    final1: "Detallar sizə deyil,",
    final2: " bizə qalsın.",
    finalIntro:
      "Avtomobil seçimi, vaxt və təşkilati detallar üçün komandamızla əlaqə saxlayın. Xüsusi gününüz üçün uyğun variantı birlikdə müəyyən edək.",
    request: "Müraciət et",
  },
  en: {
    back: "Home",
    kicker: "CARBON / SPECIAL COLLECTION",
    hero1: "A special car",
    hero2: " for your special day.",
    intro:
      "Selected premium cars for weddings, engagements, photo sessions and special events.",
    car: "CAR",
    selected: "SELECTED CARS",
    collection: "Wedding collection",
    collectionIntro:
      "Choose the right car for your special day from classic, sport and premium models.",
    wedding: "WEDDING",
    seats: "seats",
    starts: "Starts from",
    final1: "Leave the details",
    final2: " to us.",
    finalIntro:
      "Contact our team for car selection, timing and organization details. Together we will find the right option for your special day.",
    request: "Send request",
  },
  ru: {
    back: "Главная",
    kicker: "CARBON / СПЕЦИАЛЬНАЯ КОЛЛЕКЦИЯ",
    hero1: "Особенный автомобиль",
    hero2: " для особенного дня.",
    intro:
      "Подобранные премиальные автомобили для свадьбы, помолвки, фотосессии и особых мероприятий.",
    car: "АВТО",
    selected: "ВЫБРАННЫЕ АВТО",
    collection: "Свадебная коллекция",
    collectionIntro:
      "Выберите автомобиль для особого дня среди классических, спортивных и премиальных моделей.",
    wedding: "СВАДЬБА",
    seats: "мест",
    starts: "От",
    final1: "Оставьте детали",
    final2: " нам.",
    finalIntro:
      "Свяжитесь с нашей командой по выбору автомобиля, времени и организационным деталям. Вместе подберем подходящий вариант для вашего особого дня.",
    request: "Отправить заявку",
  },
} as const;

export default function WeddingCollectionClient() {
  const { locale } = useCarbonCopy();
  const t = weddingCollectionText[locale];
  const [siteCars, setSiteCars] = useState<Car[]>(cars);

  useEffect(() => {
    let mounted = true;

    fetchPublicCars().then((supabaseCars) => {
      if (mounted && supabaseCars?.length) {
        setSiteCars(supabaseCars);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const weddingCars = siteCars.filter(
    (car) =>
      car.weddingAvailable &&
      car.weddingPrice != null
  );

  return (
    <main className="wedding-page">
      <CarbonNavbar
        light
        active="wedding"
      />

      <section className="wedding-hero">
        <div className="wedding-inner">
          <motion.div
            initial={{
              opacity: 0,
              x: -14,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.55,
              ease,
            }}
          >
            <Link href="/" className="wedding-back">
              <ArrowLeft size={14} />
              {t.back}
            </Link>
          </motion.div>

          <div className="wedding-hero-grid">
            <motion.div
              initial={{
                opacity: 0,
                y: 34,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.82,
                delay: 0.08,
                ease,
              }}
            >
              <span className="wedding-kicker">
                {t.kicker}
              </span>

              <h1>
                {t.hero1}
                <em>{t.hero2}</em>
              </h1>
            </motion.div>

            <motion.div
              className="wedding-hero-copy"
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.72,
                delay: 0.23,
                ease,
              }}
            >
              <p>
                {t.intro}
              </p>

              <div>
                <span>
                  {String(weddingCars.length).padStart(2, "0")}
                </span>
                <small>{t.car}</small>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="wedding-catalog">
        <div className="wedding-inner">
          <motion.div
            className="wedding-section-top"
            initial={{
              opacity: 0,
              y: 32,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.72,
              ease,
            }}
          >
            <div>
              <span>{t.selected}</span>
              <h2>{t.collection}</h2>
            </div>

            <p>
              {t.collectionIntro}
            </p>
          </motion.div>

          <div className="wedding-grid">
            {weddingCars.map((car, index) => (
              <motion.div
                className="wedding-motion-card"
                key={car.slug}
                initial={{
                  opacity: 0,
                  y: 48,
                  scale: 0.975,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.12,
                  margin: "0px 0px -35px 0px",
                }}
                transition={{
                  duration: 0.75,
                  delay: (index % 2) * 0.09,
                  ease,
                }}
              >
                <Link
                  href={`/toy-avtomobilleri/${car.slug}`}
                  className="wedding-card"
                >
                  <div className="wedding-card-top">
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="wedding-card-type">
                      {t.wedding}
                    </span>
                  </div>

                  <div className="wedding-card-image">
                    <div className="wedding-car-shadow" />

                    <motion.img
                      src={car.thumbnail}
                      alt={car.title}
                      initial={{
                        scale: 0.94,
                        y: 10,
                      }}
                      whileInView={{
                        scale: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.25,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.08,
                        ease,
                      }}
                      whileHover={{
                        scale: 1.035,
                        y: -3,
                      }}
                    />
                  </div>

                  <div className="wedding-card-content">
                    <div className="wedding-card-title">
                      <div>
                        <small>{car.brand}</small>
                        <h3>{car.title}</h3>
                      </div>

                      <ArrowRight size={18} />
                    </div>

                    <div className="wedding-card-specs">
                      {car.seats != null && (
                        <span>
                          <Users size={13} />
                          {car.seats} {t.seats}
                        </span>
                      )}

                      {car.engine && (
                        <span>
                          <Gauge size={13} />
                          {car.engine}
                        </span>
                      )}

                      <span>
                        <CalendarHeart size={13} />
                        {t.wedding}
                      </span>
                    </div>

                    <div className="wedding-card-price">
                      <span>{t.starts}</span>

                      <strong>
                        {car.weddingPrice} ₼
                      </strong>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="wedding-info">
        <motion.div
          className="wedding-inner wedding-info-grid"
          initial={{
            opacity: 0,
            y: 38,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.28,
          }}
          transition={{
            duration: 0.78,
            ease,
          }}
        >
          <span>CARBON WEDDING</span>

          <h2>
            {t.final1}
            <em>{t.final2}</em>
          </h2>

          <p>
            {t.finalIntro}
          </p>

          <Link href="/#contact">
            {t.request}
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
