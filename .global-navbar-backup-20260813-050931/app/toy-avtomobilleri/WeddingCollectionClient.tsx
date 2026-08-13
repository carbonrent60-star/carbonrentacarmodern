"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  Gauge,
  Users,
} from "lucide-react";

import CarbonNavbar from "@/components/CarbonNavbar";
import { cars } from "@/data/cars";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WeddingCollectionClient() {
  const weddingCars = cars.filter(
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
              Ana səhifə
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
                CARBON / XÜSUSİ KOLLEKSİYA
              </span>

              <h1>
                Xüsusi gününüzə
                <em> xüsusi avtomobil.</em>
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
                Toy, nişan, fotosessiya və xüsusi tədbirlər üçün
                seçilmiş premium avtomobillər.
              </p>

              <div>
                <span>
                  {String(weddingCars.length).padStart(2, "0")}
                </span>
                <small>AVTOMOBİL</small>
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
              <span>SEÇİLMİŞ AVTOMOBİLLƏR</span>
              <h2>Toy kolleksiyası</h2>
            </div>

            <p>
              Klassik, sport və premium modellər arasından
              xüsusi gününüzə uyğun avtomobili seçin.
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
                      TOY
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
                          {car.seats} yer
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
                        Toy
                      </span>
                    </div>

                    <div className="wedding-card-price">
                      <span>Başlayır</span>

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
            Detallar sizə deyil,
            <em> bizə qalsın.</em>
          </h2>

          <p>
            Avtomobil seçimi, vaxt və təşkilati detallar üçün
            komandamızla əlaqə saxlayın. Xüsusi gününüz üçün
            uyğun variantı birlikdə müəyyən edək.
          </p>

          <Link href="/#contact">
            Müraciət et
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
