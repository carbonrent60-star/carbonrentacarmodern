"use client";

import Link from "next/link";
import { motion } from "motion/react";
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
              <span className="home-kicker">XÜSUSİ XİDMƏTLƏR</span>

              <h2>
                Sadəcə avtomobil deyil.
                <br />
                <em>Səfərinizə uyğun xidmət.</em>
              </h2>
            </div>

            <p>
              Carbon gündəlik avtomobil icarəsindən əlavə, xüsusi günlər və
              transfer ehtiyacları üçün ayrıca seçilmiş avtomobillər təqdim edir.
            </p>
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
                <span>01 / TOY AVTOMOBİLLƏRİ</span>
                <Sparkles size={19} strokeWidth={1.35} />
              </div>

              <div className="home-service-card-content">
                <span className="home-service-eyebrow">XÜSUSİ GÜNLƏR</span>

                <h3>
                  Günün özü qədər
                  <br />
                  <em>xüsusi seçim.</em>
                </h3>

                <p>
                  Toy və digər xüsusi günlər üçün premium avtomobillərdən
                  ibarət seçilmiş kolleksiya.
                </p>

                <Link href="/toy-avtomobilleri">
                  Kolleksiyaya bax
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
                <span className="home-service-eyebrow">TRANSFER XİDMƏTİ</span>

                <h3>
                  A nöqtəsindən
                  <br />
                  <em>rahatlıqla B-yə.</em>
                </h3>

                <p>
                  Hava limanı, şəhər və fərdi marşrutlar üçün uyğun
                  avtomobillərlə transfer xidməti.
                </p>

                <Link href="/avtomobiller">
                  Transfer avtomobilləri
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
              <span className="home-kicker">NİYƏ CARBON?</span>

              <h2>
                Detallarda
                <br />
                <em>fərq var.</em>
              </h2>
            </motion.div>

            <span className="home-section-index">03</span>
          </div>

          <div className="home-advantage-grid">
            {advantages.map((item, index) => {
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

      {/* ====================================================
          FINAL CTA
          ==================================================== */}
      <section className="home-final-cta" id="contact">
        <div className="home-final-cta-noise" />

        <div className="home-experience-inner home-final-cta-inner">
          <motion.span
            className="home-final-cta-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            CARBON RENT A CAR
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease }}
          >
            Növbəti yolunuz
            <br />
            <em>buradan başlayır.</em>
          </motion.h2>

          <motion.div
            className="home-final-cta-bottom"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <p>
              Avtomobilinizi seçin və icarə ilə bağlı məlumat üçün bizimlə
              əlaqə saxlayın.
            </p>

            <div className="home-final-actions">
              <Link href="/avtomobiller" className="home-final-primary">
                Avtomobil seç
                <ArrowRight size={16} strokeWidth={1.6} />
              </Link>

              <a href="tel:+994502200050" className="home-final-secondary">
                +994 50 220 00 50
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
