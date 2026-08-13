"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  FileText,
  Headphones,
  MapPin,
  ShieldCheck,
  Sparkles,
  CarFront,
} from "lucide-react";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    number: "01",
    eyebrow: "GÖTÜRÜLMƏ VAXTI",
    title: "Vaxtında gəlin",
    short: "Götürülmə vaxtı",
    description:
      "Avtomobilinizi götürmək üçün uyğun vaxt komandanız tərəfindən əvvəlcədən dəqiqləşdirilir. Gecikmə olduqda bizimlə əlaqə saxlamağınız kifayətdir.",
    detail: "Dəqiqlik bizim prinsipimizdir",
    subdetail: "Sizin vaxtınız bizim üçün önəmlidir.",
    icon: Clock3,
  },
  {
    number: "02",
    eyebrow: "SƏNƏDLƏR",
    title: "Sadəcə əsas sənədlər",
    short: "Nə gətirməlisiniz",
    description:
      "Təhvil zamanı şəxsiyyət sənədi və etibarlı sürücülük vəsiqəsi kifayətdir. Prosesi mümkün qədər qısa və rahat saxlayırıq.",
    detail: "Minimum prosedur",
    subdetail: "Daha az gözləmə, daha tez yola çıxış.",
    icon: FileText,
  },
  {
    number: "03",
    eyebrow: "ÖDƏNİŞ ŞƏRTLƏRİ",
    title: "Şəffaf depozit",
    short: "Depozit",
    description:
      "Depozit və ödəniş şərtləri avtomobil seçiminə uyğun olaraq əvvəlcədən izah edilir. Təhvil zamanı sürpriz və gizli şərt yoxdur.",
    detail: "Şərtlər əvvəlcədən məlumdur",
    subdetail: "Aydın qiymət. Aydın proses.",
    icon: CreditCard,
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Kasko sığortalı",
    text: "Etibarlı avtomobillər",
    index: "01",
  },
  {
    icon: Check,
    title: "Yoxlanılmış park",
    text: "Texniki nəzarət",
    index: "02",
  },
  {
    icon: Headphones,
    title: "24/7 dəstək",
    text: "Hər zaman əlaqə",
    index: "03",
  },
  {
    icon: MapPin,
    title: "Çatdırılma",
    text: "Mümkün ünvanlara",
    index: "04",
  },
];

const requirements = [
  {
    icon: FileText,
    number: "01",
    title: "Şəxsiyyət sənədi",
    text: "Avtomobili təhvil alarkən etibarlı şəxsiyyət sənədinizi təqdim edin.",
  },
  {
    icon: CarFront,
    number: "02",
    title: "Sürücülük vəsiqəsi",
    text: "Etibarlı sürücülük vəsiqəsi avtomobilin təhvili üçün tələb olunur.",
  },
  {
    icon: CreditCard,
    number: "03",
    title: "Ödəniş",
    text: "Ödəniş və depozit şərtləri seçdiyiniz avtomobilə uyğun əvvəlcədən bildirilir.",
  },
  {
    icon: Check,
    number: "04",
    title: "Təhvil-təslim",
    text: "Avtomobil birlikdə yoxlanılır və təhvil prosesi aydın şəkildə tamamlanır.",
  },
];

const faqs = [
  {
    q: "Avtomobili necə rezervasiya edə bilərəm?",
    a: "İstədiyiniz avtomobili seçdikdən sonra bizimlə əlaqə saxlayın. Komandamız mövcudluğu, tarixləri və təhvil detallarını sizinlə dəqiqləşdirəcək.",
  },
  {
    q: "Depozit bütün avtomobillər üçün eynidir?",
    a: "Xeyr. Depozit məbləği avtomobilin kateqoriyasına və icarə şərtlərinə görə dəyişə bilər. Məbləğ rezervasiyadan əvvəl sizə bildirilir.",
  },
  {
    q: "Avtomobil ünvana çatdırıla bilər?",
    a: "Mümkün ünvanlar və vaxt aralığı üzrə çatdırılma təşkil edilə bilər. Dəqiq imkan rezervasiya zamanı təsdiqlənir.",
  },
  {
    q: "İcarə müddətini uzatmaq mümkündür?",
    a: "Avtomobil növbəti tarixlər üçün rezervasiya edilməyibsə, müddətin uzadılması mümkündür. Bunun üçün əvvəlcədən komandamızla əlaqə saxlamaq lazımdır.",
  },
];

export default function RentalGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const step = steps[activeStep];
  const StepIcon = step.icon;

  return (
    <>
      <section className="carbon-guide">
        <div className="carbon-guide-ambient carbon-guide-ambient-a" />
        <div className="carbon-guide-ambient carbon-guide-ambient-b" />

        <div className="carbon-guide-inner">
          <motion.div
            className="carbon-guide-head"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, ease }}
          >
            <div>
              <span className="carbon-guide-kicker">
                <i />
                CARBON EXPERIENCE
              </span>

              <h2>
                İcarə prosesi.
                <br />
                <em>Sadə və aydın.</em>
              </h2>
            </div>

            <div className="carbon-guide-head-side">
              <span>01 — 03</span>
              <p>
                Avtomobili seçdiyiniz andan açarı aldığınız ana qədər hər
                detal düşünülüb.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="carbon-guide-shell"
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="carbon-guide-tabs">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const active = index === activeStep;

                return (
                  <button
                    key={item.number}
                    type="button"
                    className={active ? "active" : ""}
                    onClick={() => setActiveStep(index)}
                  >
                    {active && (
                      <motion.span
                        className="carbon-guide-tab-active"
                        layoutId="carbon-guide-tab"
                        transition={{ duration: 0.45, ease }}
                      />
                    )}

                    <span className="carbon-guide-tab-number">
                      {item.number}
                    </span>

                    <span className="carbon-guide-tab-icon">
                      <Icon size={17} strokeWidth={1.55} />
                    </span>

                    <span className="carbon-guide-tab-copy">
                      <strong>{item.short}</strong>
                      <small>{item.eyebrow}</small>
                    </span>

                    <span className="carbon-guide-tab-dot" />
                  </button>
                );
              })}
            </div>

            <div className="carbon-guide-stage">
              <div className="carbon-guide-stage-grid" />
              <div className="carbon-guide-stage-glow" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  className="carbon-guide-stage-content"
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
                  transition={{ duration: 0.48, ease }}
                >
                  <div className="carbon-guide-stage-main">
                    <div className="carbon-guide-stage-meta">
                      <span className="carbon-guide-big-icon">
                        <StepIcon size={23} strokeWidth={1.4} />
                      </span>

                      <span>
                        {step.number} <i>/ 03</i>
                      </span>
                    </div>

                    <span className="carbon-guide-eyebrow">{step.eyebrow}</span>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>

                    <div className="carbon-guide-principle">
                      <Sparkles size={17} strokeWidth={1.45} />
                      <span>
                        <strong>{step.detail}</strong>
                        <small>{step.subdetail}</small>
                      </span>
                    </div>
                  </div>

                  <div className="carbon-guide-visual">
                    <div className="carbon-guide-orbit carbon-guide-orbit-a" />
                    <div className="carbon-guide-orbit carbon-guide-orbit-b" />
                    <div className="carbon-guide-orbit carbon-guide-orbit-c" />

                    <motion.div
                      className="carbon-guide-monogram"
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease }}
                    >
                      <span>C</span>
                    </motion.div>

                    <div className="carbon-guide-status-card">
                      <span className="carbon-guide-status-live">
                        <i />
                        CARBON STANDARD
                      </span>

                      <strong>{step.number}</strong>
                      <small>{step.short}</small>

                      <div>
                        <span>STATUS</span>
                        <b>READY</b>
                      </div>
                    </div>

                    <span className="carbon-guide-coordinate">
                      BAKU · AZ
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="carbon-guide-progress">
                <motion.span
                  animate={{ width: `${((activeStep + 1) / 3) * 100}%` }}
                  transition={{ duration: 0.55, ease }}
                />
              </div>
            </div>
          </motion.div>

          <div className="carbon-benefits">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  className="carbon-benefit"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.07,
                    ease,
                  }}
                  whileHover={{ y: -5 }}
                >
                  <span className="carbon-benefit-number">
                    {benefit.index}
                  </span>

                  <span className="carbon-benefit-icon">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>

                  <div>
                    <strong>{benefit.title}</strong>
                    <small>{benefit.text}</small>
                  </div>

                  <span className="carbon-benefit-line" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="carbon-requirements">
        <div className="carbon-guide-inner">
          <motion.div
            className="carbon-requirements-head"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <span>BEFORE YOU DRIVE</span>
            <h2>
              Yola çıxmaq üçün
              <br />
              <em>cəmi bir neçə detal.</em>
            </h2>
          </motion.div>

          <div className="carbon-requirements-grid">
            {requirements.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.07,
                    ease,
                  }}
                >
                  <span className="carbon-requirement-index">
                    {item.number}
                  </span>

                  <span className="carbon-requirement-icon">
                    <Icon size={22} strokeWidth={1.35} />
                  </span>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>

                  <span className="carbon-requirement-corner" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="carbon-faq">
        <div className="carbon-guide-inner carbon-faq-layout">
          <div className="carbon-faq-intro">
            <span>FAQ / CARBON</span>

            <h2>
              Sualınız
              <br />
              <em>qaldı?</em>
            </h2>

            <p>
              Rezervasiya və icarə ilə bağlı ən çox verilən sualları burada
              topladıq.
            </p>

            <a href="#contact">
              Bizimlə əlaqə
              <ArrowRight size={15} strokeWidth={1.5} />
            </a>
          </div>

          <div className="carbon-faq-list">
            {faqs.map((item, index) => {
              const open = openFaq === index;

              return (
                <motion.div
                  key={item.q}
                  className={`carbon-faq-item ${open ? "open" : ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span>0{index + 1}</span>
                    <strong>{item.q}</strong>

                    <i>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        +
                      </motion.span>
                    </i>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        className="carbon-faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease }}
                      >
                        <p>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
