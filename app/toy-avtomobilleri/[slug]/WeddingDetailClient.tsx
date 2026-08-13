"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Gauge,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Car } from "@/data/cars";

import CarbonNavbar from "@/components/CarbonNavbar";
const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "Toy avtomobili necə rezervasiya olunur?",
    a: "Avtomobili seçdikdən sonra “Müraciət et” düyməsi vasitəsilə komandamızla əlaqə saxlayın. Tarix və saat dəqiqləşdirildikdən sonra rezervasiya təsdiqlənir.",
  },
  {
    q: "Avtomobil sürücü ilə təqdim olunur?",
    a: "Toy və xüsusi tədbir sifarişlərində xidmət şərtləri seçilmiş avtomobilə və tədbirin formatına görə əvvəlcədən razılaşdırılır.",
  },
  {
    q: "Fotosessiya üçün istifadə etmək mümkündür?",
    a: "Bəli. Avtomobilin fotosessiya və digər xüsusi tədbirlər üçün istifadəsini müraciət zamanı qeyd edə bilərsiniz.",
  },
  {
    q: "Qiymətə hansı xidmətlər daxildir?",
    a: "Xidmətin müddəti, marşrut və əlavə istəklər yekun qiymətə təsir edə bilər. Komandamız müraciətdən sonra bütün detalları sizə təqdim edəcək.",
  },
];

export default function WeddingDetailClient({
  car,
  relatedCars,
}: {
  car: Car;
  relatedCars: Car[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="wedding-detail-page">
      <CarbonNavbar light active="wedding" />
      

      <section className="wedding-detail-hero">
        <div className="wedding-inner">
          <Link
            href="/toy-avtomobilleri"
            className="wedding-back"
          >
            <ArrowLeft size={14} />
            Toy avtomobilləri
          </Link>

          <div className="wedding-detail-grid">
            <motion.div
              className="wedding-detail-visual"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: .8, ease }}
            >
              <div className="wedding-detail-meta">
                <span>CARBON / WEDDING</span>
                <span>{car.category}</span>
              </div>

              <div className="wedding-detail-image">
                <div className="wedding-car-shadow" />
                <img src={car.thumbnail} alt={car.title} />
              </div>

              <div className="wedding-detail-specs">
                {car.seats != null && (
                  <span>
                    <Users size={14} />
                    <strong>{car.seats}</strong>
                    yer
                  </span>
                )}

                {car.engine && (
                  <span>
                    <Gauge size={14} />
                    <strong>{car.engine}</strong>
                    mühərrik
                  </span>
                )}

                <span>
                  <Sparkles size={14} />
                  <strong>{car.transmission}</strong>
                </span>
              </div>
            </motion.div>

            <motion.aside
              className="wedding-detail-summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: .8,
                delay: .12,
                ease,
              }}
            >
              <span className="wedding-kicker">
                XÜSUSİ GÜNLƏR ÜÇÜN
              </span>

              <h1>{car.title}</h1>

              <p>
                Toy, nişan, fotosessiya və xüsusi tədbiriniz üçün
                premium avtomobil təcrübəsi.
              </p>

              <div className="wedding-price-panel">
                <span>Qiymət</span>

                <div>
                  <strong>
                    {car.weddingPrice ?? "—"} ₼
                  </strong>
                  <small>/ başlayır</small>
                </div>
              </div>

              <div className="wedding-includes">
                <div>
                  <CalendarHeart size={16} />
                  <span>
                    <strong>Tarix üzrə rezervasiya</strong>
                    Tədbir gününüzə uyğun planlama
                  </span>
                </div>

                <div>
                  <Clock3 size={16} />
                  <span>
                    <strong>Vaxtın dəqiqləşdirilməsi</strong>
                    Komandamız sizinlə əvvəlcədən əlaqə saxlayır
                  </span>
                </div>

                <div>
                  <Camera size={16} />
                  <span>
                    <strong>Fotosessiya</strong>
                    Xüsusi çəkiliş planını müraciətdə qeyd edin
                  </span>
                </div>

                <div>
                  <ShieldCheck size={16} />
                  <span>
                    <strong>Etibarlı xidmət</strong>
                    Carbon komandası tərəfindən təşkil olunur
                  </span>
                </div>
              </div>

              <Link
                href="/#contact"
                className="wedding-primary-cta"
              >
                <span>
                  Müraciət et
                  <small>
                    Tarix və detalları dəqiqləşdirin
                  </small>
                </span>

                <ArrowRight size={18} />
              </Link>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="wedding-experience">
        <div className="wedding-inner">
          <div className="wedding-section-top">
            <div>
              <span>XİDMƏT PROSESİ</span>
              <h2>
                Sadə və
                <em> problemsiz.</em>
              </h2>
            </div>

            <p>
              Xüsusi gününüzdə avtomobil məsələsini düşünməyin.
              Prosesi əvvəlcədən birlikdə planlaşdırırıq.
            </p>
          </div>

          <div className="wedding-process-grid">
            {[
              ["01", "Avtomobili seçin", "Kolleksiyadan sizə uyğun modeli seçin."],
              ["02", "Tarixi bildirin", "Toy və ya tədbir tarixini komandamızla dəqiqləşdirin."],
              ["03", "Detalları razılaşdırın", "Saat, marşrut və xüsusi istəkləri əvvəlcədən planlaşdırın."],
              ["04", "Günün dadını çıxarın", "Qalan təşkilati avtomobil detallarını bizə buraxın."],
            ].map(([number, title, text]) => (
              <div key={number}>
                <span>{number}</span>
                <Check size={17} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wedding-faq">
        <div className="wedding-inner">
          <div className="wedding-faq-heading">
            <span>FAQ</span>

            <h2>
              Bilmək istədiyiniz
              <em> hər şey.</em>
            </h2>
          </div>

          <div className="wedding-faq-list">
            {faqs.map((item, index) => {
              const open = openFaq === index;

              return (
                <div
                  className={`wedding-faq-item ${
                    open ? "open" : ""
                  }`}
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

                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                    >
                      <ChevronDown size={17} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        className="wedding-faq-answer"
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
      </section>

      {relatedCars.length > 0 && (
        <section className="wedding-related">
          <div className="wedding-inner">
            <div className="wedding-section-top">
              <div>
                <span>DİGƏR SEÇİMLƏR</span>
                <h2>Digər toy avtomobilləri</h2>
              </div>

              <Link href="/toy-avtomobilleri">
                Hamısına bax
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="wedding-related-grid">
              {relatedCars.map((item) => (
                <Link
                  href={`/toy-avtomobilleri/${item.slug}`}
                  key={item.slug}
                >
                  <div>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                    />
                  </div>

                  <small>{item.brand}</small>

                  <h3>{item.title}</h3>

                  <p>
                    <strong>{item.weddingPrice} ₼</strong>
                    <span> / başlayır</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wedding-final">
        <div className="wedding-inner wedding-final-inner">
          <div>
            <Heart size={19} />
            <h2>
              Xüsusi gününüz
              <em> Carbon ilə.</em>
            </h2>
          </div>

          <Link href="/#contact">
            Əlaqə saxla
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
