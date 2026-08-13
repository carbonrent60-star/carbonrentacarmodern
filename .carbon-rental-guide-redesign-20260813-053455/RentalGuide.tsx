"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  FileText,
  Fuel,
  Gauge,
  Headphones,
  KeyRound,
  MapPin,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const rentalFaq = [
  {
    q: "Kirayə maşını üçün məsafə limitinin nə qədər olduğunu necə öyrənə bilərəm?",
    a: "Carbon-da standart icarələr üçün yürüş şərtləri avtomobilə və icarə müddətinə görə dəyişə bilər. Dəqiq məlumat rezervasiya zamanı komandamız tərəfindən təqdim olunur.",
  },
  {
    q: "Kirayə maşını üçün yanacaq siyasəti necədir?",
    a: "Avtomobili qəbul etdiyiniz yanacaq səviyyəsinə uyğun şəkildə təhvil verməyiniz xahiş olunur. Avtomobilə görə xüsusi şərt varsa, götürülmə zamanı sizə bildirilir.",
  },
  {
    q: "Kirayə maşını üçün məsafə siyasəti necə işləyir?",
    a: "Şəhərdaxili və region səfərləri üçün şərtlər seçilən avtomobilə görə fərqlənə bilər. Uzun məsafəli səfərinizi əvvəlcədən bildirməyiniz tövsiyə olunur.",
  },
  {
    q: "Yol qəzası və ya nasazlıq halında nə etməliyəm?",
    a: "Avtomobili təhlükəsiz yerdə saxlayın və dərhal Carbon Rent A Car komandası ilə əlaqə saxlayın. Komandamız sizə növbəti addımları izah edəcək.",
  },
  {
    q: "Kirayə maşını üçün depozit siyasəti necədir?",
    a: "Depozit tələbi seçilən avtomobil və icarə şərtlərinə görə müəyyən edilir. Mövcud depozit şərtləri rezervasiya təsdiqlənməzdən əvvəl sizə açıq şəkildə bildirilir.",
  },
];

const steps = [
  {
    icon: Clock3,
    title: "Vaxtında gəlin",
    short: "Götürülmə vaxtı",
    text: "Avtomobilinizi götürmək üçün uyğun vaxt komandamız tərəfindən əvvəlcədən dəqiqləşdirilir. Gecikmə olduqda bizimlə əlaqə saxlamağınız kifayətdir.",
  },
  {
    icon: FileText,
    title: "Nə gətirməlisiniz",
    short: "Sənədlər",
    text: "Şəxsiyyətinizi təsdiq edən sənəd və etibarlı sürücülük vəsiqəsi tələb olunur. Əlavə sənəd lazım olarsa, rezervasiyadan əvvəl sizə bildiriləcək.",
  },
  {
    icon: CreditCard,
    title: "Depozit",
    short: "Ödəniş şərtləri",
    text: "Depozit və ödəniş şərtləri avtomobilə görə fərqlənə bilər. Bütün məbləğlər avtomobili götürməzdən əvvəl sizinlə təsdiqlənir.",
  },
];

export default function RentalGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const step = steps[activeStep];
  const StepIcon = step.icon;

  return (
    <>
      <section className="rental-guide">
        <div className="rental-guide-inner">
          <motion.div
            className="rental-guide-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease }}
          >
            <div>
              <span>İCARƏ PROSESİ</span>
              <h2>
                Götürün.
                <em> Sürün. Qaytarın.</em>
              </h2>
            </div>

            <p>
              Rezervasiyadan avtomobili təhvil verdiyiniz ana qədər bütün
              proses aydın, sürətli və rahat şəkildə təşkil olunur.
            </p>
          </motion.div>

          <div className="rental-process">
            <div className="rental-process-tabs">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const active = activeStep === index;

                return (
                  <button
                    type="button"
                    key={item.title}
                    className={active ? "active" : ""}
                    onClick={() => setActiveStep(index)}
                  >
                    {active && (
                      <motion.span
                        className="rental-tab-bg"
                        layoutId="rental-tab-bg"
                        transition={{
                          type: "spring",
                          stiffness: 360,
                          damping: 31,
                        }}
                      />
                    )}

                    <span className="rental-tab-content">
                      <Icon size={18} strokeWidth={1.5} />

                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.short}</small>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                className="rental-process-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.35,
                  ease,
                }}
              >
                <div className="rental-process-icon">
                  <StepIcon size={22} strokeWidth={1.4} />
                </div>

                <div>
                  <span>
                    0{activeStep + 1} / 03
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.text}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rental-benefit-row">
            {[
              [ShieldCheck, "Kasko sığortalı", "Etibarlı avtomobillər"],
              [BadgeCheck, "Yoxlanılmış park", "Texniki nəzarət"],
              [Headphones, "24/7 dəstək", "Hər zaman əlaqə"],
              [MapPin, "Çatdırılma", "Mümkün ünvanlara"],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof ShieldCheck;

              return (
                <div key={String(title)}>
                  <I size={17} strokeWidth={1.45} />

                  <span>
                    <strong>{String(title)}</strong>
                    <small>{String(text)}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rental-requirements">
        <div className="rental-guide-inner">
          <div className="rental-requirements-heading">
            <span>İCARƏ ÜÇÜN</span>

            <h2>
              Yola çıxmazdan
              <em> əvvəl.</em>
            </h2>
          </div>

          <div className="rental-requirement-grid">
            <div>
              <UserRoundCheck size={19} strokeWidth={1.4} />
              <span>01</span>
              <h3>Şəxsiyyət sənədi</h3>
              <p>
                Etibarlı şəxsiyyət sənədinizi özünüzlə gətirin.
              </p>
            </div>

            <div>
              <KeyRound size={19} strokeWidth={1.4} />
              <span>02</span>
              <h3>Sürücülük vəsiqəsi</h3>
              <p>
                Etibarlı sürücülük vəsiqəsi təqdim olunmalıdır.
              </p>
            </div>

            <div>
              <CreditCard size={19} strokeWidth={1.4} />
              <span>03</span>
              <h3>Ödəniş</h3>
              <p>
                Razılaşdırılmış icarə və depozit ödənişini tamamlayın.
              </p>
            </div>

            <div>
              <CarFront size={19} strokeWidth={1.4} />
              <span>04</span>
              <h3>Təhvil-təslim</h3>
              <p>
                Avtomobilin vəziyyətini komanda ilə birlikdə yoxlayın.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rental-faq-section">
        <div className="rental-guide-inner">
          <div className="rental-faq-layout">
            <div className="rental-faq-intro">
              <span>FAQ</span>

              <h2>
                Tez-tez verilən
                <em> suallar.</em>
              </h2>

              <p>
                İcarə prosesi ilə bağlı əsas sualları burada topladıq.
                Əlavə məlumat üçün Carbon komandası ilə əlaqə saxlaya bilərsiniz.
              </p>

              <a href="/#contact">
                Bizimlə əlaqə
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="rental-faq-list">
              {rentalFaq.map((item, index) => {
                const open = openFaq === index;

                return (
                  <div
                    className={`rental-faq-item ${open ? "open" : ""}`}
                    key={item.q}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(open ? null : index)
                      }
                    >
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <strong>{item.q}</strong>

                      <motion.i
                        animate={{
                          rotate: open ? 180 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 26,
                        }}
                      >
                        <ChevronDown size={17} />
                      </motion.i>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          className="rental-faq-answer"
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.35,
                            ease,
                          }}
                        >
                          <p>{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
