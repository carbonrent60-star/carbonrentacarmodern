"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Fuel,
  Gauge,
  Headphones,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  type Car,
  getShortTermPrice,
  getStartingPrice,
} from "@/data/cars";
import RentalGuide from "@/components/RentalGuide";

const ease = [0.22, 1, 0.36, 1] as const;

const rentalPeriods = [
  { key: "days1to3", label: "1–3 gün" },
  { key: "days4to7", label: "4–7 gün" },
  { key: "days8to15", label: "8–15 gün" },
  { key: "days16to24", label: "16–24 gün" },
  { key: "days25to30", label: "25–30 gün" },
  { key: "days30plus", label: "30+ gün" },
] as const;

const destinations = [
  { key: "baku", label: "Bakı" },
  { key: "seaBreeze", label: "Sea Breeze" },
  { key: "qabala", label: "Qəbələ" },
  { key: "ismayilli", label: "İsmayıllı" },
  { key: "quba", label: "Quba" },
  { key: "shamaxi", label: "Şamaxı" },
  { key: "shaki", label: "Şəki" },
  { key: "shusha", label: "Şuşa" },
  { key: "lankaran", label: "Lənkəran" },
] as const;

export default function CarDetailClient({
  car,
  relatedCars,
}: {
  car: Car;
  relatedCars: Car[];
}) {
  const shortPrice = getShortTermPrice(car);
  const startingPrice = getStartingPrice(car);

  const availableTransfers = destinations.filter(
    ({ key }) => car.transferPrices[key] !== null
  );

  return (
    <main className="vehicle-page">
      

      <section className="vehicle-hero">
        <div className="vehicle-hero-inner">
          <motion.div
            className="vehicle-breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/avtomobiller">
              <ArrowLeft size={13} />
              Avtomobillər
            </Link>

            <span>/</span>
            <span>{car.title}</span>
          </motion.div>

          <div className="vehicle-main-grid">
            <motion.div
              className="vehicle-showroom"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease }}
            >
              <div className="vehicle-showroom-top">
                <span className="vehicle-category">{car.category}</span>

                {car.transferAvailable && (
                  <span className="vehicle-transfer-label">
                    Transfer mövcuddur
                  </span>
                )}
              </div>

              <div className="vehicle-shadow" />

              <motion.img
                src={car.thumbnail}
                alt={car.title}
                className="vehicle-main-image"
                initial={{
                  opacity: 0,
                  x: -40,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.15,
                  ease,
                }}
              />

              <span className="vehicle-showroom-index">
                CARBON / {car.category.toUpperCase()}
              </span>
            </motion.div>

            <motion.aside
              className="vehicle-summary"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease,
              }}
            >
              <span className="vehicle-brand">{car.brand}</span>

              <h1>{car.title}</h1>

              <p className="vehicle-description">
                Rahatlıq, keyfiyyət və etibarlı sürüş təcrübəsi. Carbon Rent A
                Car ilə avtomobilinizi rahat şəkildə seçin və səfərinizə
                başlayın.
              </p>

              <div className="vehicle-price-block">
                <span>Gündəlik icarə</span>

                <div>
                  {shortPrice !== null ? (
                    <>
                      <strong>{shortPrice} ₼</strong>
                      <small>/ gündən</small>
                    </>
                  ) : (
                    <strong>Əlaqə saxlayın</strong>
                  )}
                </div>

                {startingPrice !== null &&
                  startingPrice !== shortPrice && (
                    <p>
                      Uzunmüddətli icarədə {startingPrice} ₼ / gün-dən
                    </p>
                  )}
              </div>

              <div className="vehicle-quick-specs">
                {car.seats !== null && (
                  <div>
                    <Users size={19} strokeWidth={1.4} />
                    <span>Sərnişin</span>
                    <strong>{car.seats} nəfər</strong>
                  </div>
                )}

                <div>
                  <Gauge size={19} strokeWidth={1.4} />
                  <span>Sürətlər qutusu</span>
                  <strong>{car.transmission}</strong>
                </div>

                <div>
                  <Fuel size={19} strokeWidth={1.4} />
                  <span>Yanacaq</span>
                  <strong>{car.fuel}</strong>
                </div>

                {car.engine && (
                  <div>
                    <Sparkles size={19} strokeWidth={1.4} />
                    <span>Mühərrik</span>
                    <strong>{car.engine}</strong>
                  </div>
                )}

                {car.baggage !== null && (
                  <div>
                    <BriefcaseBusiness size={19} strokeWidth={1.4} />
                    <span>Baqaj</span>
                    <strong>{car.baggage} böyük</strong>
                  </div>
                )}
              </div>

              <div className="vehicle-actions">
                <motion.a
                  href="#booking"
                  className="vehicle-primary-action"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  İcarə et
                  <ArrowRight size={17} />
                </motion.a>

                <a
                  href="tel:+994554840006"
                  className="vehicle-secondary-action"
                >
                  +994 55 484 00 06
                </a>
              </div>

              <div className="vehicle-mini-trust">
                <span>
                  <ShieldCheck size={14} />
                  Kasko sığortalı
                </span>

                <span>
                  <Headphones size={14} />
                  24/7 dəstək
                </span>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="vehicle-pricing">
        <div className="vehicle-section-inner">
          <motion.div
            className="vehicle-section-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease }}
          >
            <div>
              <span>01 / İCARƏ QİYMƏTLƏRİ</span>

              <h2>
                Daha uzun sür.
                <br />
                <em>Daha sərfəli ödə.</em>
              </h2>
            </div>

            <p>
              İcarə müddəti artdıqca gündəlik qiymət azalır. Sizə uyğun
              müddəti seçin.
            </p>
          </motion.div>

          <div className="pricing-grid">
            {rentalPeriods.map(({ key, label }, index) => {
              const price = car.rentalPrices[key];

              if (price === null) {
                return null;
              }

              return (
                <motion.div
                  className="price-tier"
                  key={key}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.055,
                    ease,
                  }}
                >
                  <span>{label}</span>

                  <div>
                    <strong>{price}</strong>
                    <small>₼ / gün</small>
                  </div>

                  <Check size={16} strokeWidth={1.5} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="vehicle-details">
        <div className="vehicle-section-inner">
          <div className="vehicle-detail-grid">
            <motion.div
              className="vehicle-detail-heading"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease }}
            >
              <span>02 / AVTOMOBİL</span>

              <h2>
                Səfər üçün
                <br />
                <em>hazırdır.</em>
              </h2>
            </motion.div>

            <div className="vehicle-detail-list">
              <div>
                <span>Kateqoriya</span>
                <strong>{car.category}</strong>
              </div>

              <div>
                <span>Marka</span>
                <strong>{car.brand}</strong>
              </div>

              <div>
                <span>Transmissiya</span>
                <strong>{car.transmission}</strong>
              </div>

              <div>
                <span>Yanacaq</span>
                <strong>{car.fuel}</strong>
              </div>

              {car.engine && (
                <div>
                  <span>Mühərrik</span>
                  <strong>{car.engine}</strong>
                </div>
              )}

              {car.seats !== null && (
                <div>
                  <span>Oturacaq sayı</span>
                  <strong>{car.seats}</strong>
                </div>
              )}

              {car.baggage !== null && (
                <div>
                  <span>Böyük baqaj</span>
                  <strong>{car.baggage}</strong>
                </div>
              )}

              {car.smallBaggage !== null && (
                <div>
                  <span>Kiçik baqaj</span>
                  <strong>{car.smallBaggage}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {availableTransfers.length > 0 && (
        <section className="vehicle-transfers">
          <div className="vehicle-section-inner">
            <div className="vehicle-section-heading transfer-heading">
              <div>
                <span>03 / TRANSFER</span>

                <h2>
                  Bakıdan
                  <br />
                  <em>istiqamətinizə.</em>
                </h2>
              </div>

              <p>
                Bu avtomobil üçün mövcud transfer istiqamətləri və qiymətləri.
              </p>
            </div>

            <div className="transfer-grid">
              {availableTransfers.map(({ key, label }, index) => (
                <motion.div
                  className="transfer-item"
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.04,
                    ease,
                  }}
                >
                  <MapPin size={16} strokeWidth={1.4} />

                  <span>{label}</span>

                  <strong>{car.transferPrices[key]} ₼</strong>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="vehicle-booking" id="booking">
        <motion.div
          className="vehicle-booking-inner"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="booking-copy">
            <span>CARBON RENT A CAR</span>

            <h2>
              {car.title}
              <br />
              <em>sizi gözləyir.</em>
            </h2>

            <p>
              İcarə tarixini dəqiqləşdirmək və avtomobilin mövcudluğunu
              öyrənmək üçün bizimlə əlaqə saxlayın.
            </p>
          </div>

          <div className="booking-card">
            <div className="booking-card-car">
              <img src={car.thumbnail} alt="" />

              <div>
                <span>{car.category}</span>
                <strong>{car.title}</strong>
              </div>
            </div>

            <div className="booking-card-row">
              <CalendarDays size={17} />
              <div>
                <span>İcarə müddəti</span>
                <strong>Tarixi əlaqə zamanı seçin</strong>
              </div>
            </div>

            <div className="booking-card-row">
              <MapPin size={17} />
              <div>
                <span>Təhvil yeri</span>
                <strong>Bakı və razılaşdırılmış ünvan</strong>
              </div>
            </div>

            <a href="tel:+994554840006" className="booking-call">
              İndi əlaqə saxla
              <ArrowUpRight size={17} />
            </a>

            <span className="booking-phone">
              +994 55 484 00 06
            </span>
          </div>
        </motion.div>
      </section>

      <RentalGuide />

      {relatedCars.length > 0 && (
        <section className="related-cars">
          <div className="vehicle-section-inner">
            <div className="related-head">
              <div>
                <span>DAHA ÇOX SEÇİM</span>
                <h2>Oxşar avtomobillər</h2>
              </div>

              <Link href="/avtomobiller">
                Hamısına bax
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="related-grid">
              {relatedCars.map((item, index) => {
                const price = getShortTermPrice(item);

                return (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease,
                    }}
                  >
                    <Link
                      href={`/avtomobiller/${item.slug}`}
                      className="related-card"
                    >
                      <div className="related-visual">
                        <div className="related-shadow" />

                        <img src={item.thumbnail} alt={item.title} />

                        <span>{item.category}</span>

                        <div className="related-arrow">
                          <ArrowUpRight size={17} />
                        </div>
                      </div>

                      <div className="related-info">
                        <div>
                          <small>{item.brand}</small>
                          <strong>{item.title}</strong>
                        </div>

                        {price !== null && (
                          <p>
                            {price} ₼
                            <span>/ gün</span>
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <footer className="vehicle-footer">
        <div>
          <Image
            src="/images/carbon-logo.webp"
            alt="Carbon Rent A Car"
            width={170}
            height={60}
          />

          <span>© Carbon Rent A Car</span>
        </div>

        <Link href="/avtomobiller">
          Avtomobillərə qayıt
          <ArrowUpRight size={14} />
        </Link>
      </footer>
    </main>
  );
}
