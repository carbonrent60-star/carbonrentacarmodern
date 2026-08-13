"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  FileCheck2,
  Fuel,
  Gauge,
  Headphones,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";

import type { Car } from "@/data/cars";

import CarbonNavbar from "@/components/CarbonNavbar";
const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  car: Car;
  relatedCars: Car[];
};

type RouteKey = keyof Car["transferPrices"];

const routes: {
  key: RouteKey;
  from: string;
  to: string;
}[] = [
  {
    key: "baku",
    from: "Hava Limanı",
    to: "Bakı",
  },
  {
    key: "seaBreeze",
    from: "Sea Breeze",
    to: "Hava Limanı",
  },
  {
    key: "qabala",
    from: "Qəbələ",
    to: "Bakı",
  },
  {
    key: "ismayilli",
    from: "İsmayıllı",
    to: "Bakı",
  },
  {
    key: "quba",
    from: "Quba",
    to: "Bakı",
  },
  {
    key: "shamaxi",
    from: "Şamaxı",
    to: "Bakı",
  },
  {
    key: "shaki",
    from: "Şəki",
    to: "Bakı",
  },
  {
    key: "shusha",
    from: "Şuşa",
    to: "Bakı",
  },
  {
    key: "lankaran",
    from: "Lənkəran",
    to: "Bakı",
  },
];

const serviceTabs = [
  {
    id: "time",
    label: "Vaxtında gəlin",
    short: "Vaxt",
    icon: Clock3,
    title: "Transfer vaxtınızı əvvəlcədən planlayırıq.",
    text:
      "Carbon Rent a Car olaraq, transfer üçün sizə uyğun vaxt komandamız tərəfindən əvvəlcədən dəqiqləşdirilir. Sürücü razılaşdırılmış vaxtda hazır olur və səfəriniz gecikmədən başlayır.",
    note:
      "Uçuş və ya qarşılanma vaxtınız dəyişərsə, komandamıza əvvəlcədən məlumat verməyiniz kifayətdir.",
  },
  {
    id: "documents",
    label: "Nə gətirməlisiniz",
    short: "Sənəd",
    icon: FileCheck2,
    title: "Transfer üçün əlavə sənəd prosesi minimumdur.",
    text:
      "Transfer xidməti avtomobil icarəsindən fərqli olaraq sürücü ilə təqdim olunur. Sifariş zamanı əlaqə məlumatlarınızı, qarşılanma nöqtəsini və səfər detallarını düzgün qeyd etməyiniz kifayətdir.",
    note:
      "Hava limanı transferində uçuş nömrəsini paylaşmaq qarşılanmanı daha rahat təşkil etməyə kömək edir.",
  },
  {
    id: "deposit",
    label: "Depozit",
    short: "Ödəniş",
    icon: WalletCards,
    title: "Transfer sifarişində şərtlər əvvəlcədən dəqiqləşdirilir.",
    text:
      "Transfer qiyməti seçilmiş avtomobil və istiqamət əsasında müəyyən edilir. Rezervasiya və ödəniş detalları sifariş təsdiqlənərkən komandamız tərəfindən sizə təqdim olunur.",
    note:
      "Xüsusi marşrut, əlavə dayanacaq və ya fərqli tələb olduqda qiymət ayrıca dəqiqləşdirilə bilər.",
  },
];

const faqs = [
  {
    q: "Transfer qiymətinə sürücü daxildirmi?",
    a:
      "Bəli. Transfer avtomobilləri yalnız sürücü ilə təqdim olunur və göstərilən transfer xidməti bu format üçün nəzərdə tutulub.",
  },
  {
    q: "Hava limanında qarşılanma mümkündürmü?",
    a:
      "Bəli. Hava limanı transferi təşkil edilə bilər. Qarşılanmanın problemsiz təşkili üçün uçuş və əlaqə məlumatlarınızı sifariş zamanı paylaşın.",
  },
  {
    q: "Göstərilən istiqamətlərdən başqa yerə transfer sifariş edə bilərəm?",
    a:
      "Bəli. Siyahıda olmayan istiqamət üçün komandamızla əlaqə saxlayın. Marşrut və qiymət ayrıca hesablanacaq.",
  },
  {
    q: "Transfer vaxtını sonradan dəyişmək mümkündürmü?",
    a:
      "Mümkün olduqda vaxt dəyişikliyi təşkil edilir. Dəyişiklik barədə mümkün qədər erkən məlumat vermək tövsiyə olunur.",
  },
  {
    q: "Transfer üçün depozit tələb olunurmu?",
    a:
      "Rezervasiya və ödəniş şərtləri seçilmiş marşrut və sifarişə uyğun olaraq komandamız tərəfindən təsdiq zamanı bildirilir.",
  },
  {
    q: "Əlavə dayanacaq etmək mümkündürmü?",
    a:
      "Bəli, əvvəlcədən razılaşdırmaq mümkündür. Əlavə dayanacaq və marşrut dəyişikliyi yekun qiymətə təsir edə bilər.",
  },
];

function getStartingPrice(car: Car) {
  const prices = Object.values(
    car.transferPrices
  ).filter(
    (value): value is number =>
      typeof value === "number"
  );

  return prices.length
    ? Math.min(...prices)
    : null;
}

export default function TransferDetailClient({
  car,
  relatedCars,
}: Props) {
  const [activeTab, setActiveTab] =
    useState("time");

  const [openFaq, setOpenFaq] =
    useState<number | null>(0);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const active =
    serviceTabs.find(
      (tab) => tab.id === activeTab
    ) ?? serviceTabs[0];

  const ActiveIcon = active.icon;

  const availableRoutes = routes.filter(
    ({ key }) =>
      typeof car.transferPrices[key] ===
      "number"
  );

  const startingPrice =
    getStartingPrice(car);

  return (
    <main className="transfer-detail-page">
      <CarbonNavbar light active="transfer" />
      {/* NAV */}
      

      {/* HERO */}
      <section className="transfer-detail-hero">
        <div className="transfer-detail-inner">
          <motion.div
            initial={{
              opacity: 0,
              x: -12,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <Link
              href="/avtomobiller"
              className="catalog-back"
            >
              <ArrowLeft size={13} />
              Transfer avtomobillərinə qayıt
            </Link>
          </motion.div>

          <div className="transfer-detail-layout">
            <motion.div
              className="transfer-detail-car"
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                ease,
              }}
            >
              <div className="transfer-detail-label">
                <span>CARBON TRANSFER</span>
                <i />
                <span>{car.category}</span>
              </div>

              <h1>{car.title}</h1>

              <p className="transfer-driver-note">
                <Check size={13} />
                Avtomobil yalnız sürücü ilə
                təqdim olunur
              </p>

              <div className="transfer-detail-image">
                <div className="transfer-detail-shadow" />

                <motion.img
                  src={car.thumbnail}
                  alt={car.title}
                  initial={{
                    opacity: 0,
                    x: -30,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.9,
                    delay: 0.12,
                    ease,
                  }}
                />
              </div>

              <div className="transfer-car-specs">
                {car.seats !== null && (
                  <span>
                    <Users size={14} />
                    <strong>{car.seats}</strong>
                    nəfər
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
                  <Fuel size={14} />
                  <strong>
                    {car.transmission}
                  </strong>
                </span>

                {car.baggage !== null && (
                  <span>
                    <BriefcaseBusiness
                      size={14}
                    />
                    <strong>
                      {car.baggage}
                    </strong>
                    baqaj
                  </span>
                )}
              </div>
            </motion.div>

            {/* ROUTES */}
            <motion.div
              className="transfer-route-panel"
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.1,
                ease,
              }}
            >
              <div className="transfer-route-head">
                <div>
                  <span>
                    TRANSFER QİYMƏTLƏRİ
                  </span>
                  <h2>
                    İstiqaməti
                    <em> seçin.</em>
                  </h2>
                </div>

                {startingPrice !== null && (
                  <div className="transfer-start">
                    <small>Başlayır</small>
                    <strong>
                      {startingPrice} ₼
                    </strong>
                  </div>
                )}
              </div>

              <div className="transfer-route-list">
                {availableRoutes.map(
                  (
                    { key, from, to },
                    index
                  ) => (
                    <motion.div
                      className="transfer-route-row"
                      key={key}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          0.2 +
                          index * 0.035,
                      }}
                    >
                      <div className="route-number">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </div>

                      <div className="route-place">
                        <strong>{from}</strong>
                        <span>{to}</span>
                      </div>

                      <div className="route-line">
                        <i />
                        <MapPin size={11} />
                      </div>

                      <strong className="route-price">
                        {
                          car.transferPrices[
                            key
                          ]
                        }{" "}
                        ₼
                      </strong>
                    </motion.div>
                  )
                )}
              </div>

              <a
                href="tel:+994554840006"
                className="transfer-apply"
              >
                <span>
                  Müraciət et
                  <small>
                    Transfer sifariş edin
                  </small>
                </span>

                <ArrowUpRight size={18} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="transfer-process-section">
        <div className="transfer-detail-inner">
          <div className="transfer-section-heading">
            <span>01 / PROSES</span>

            <h2>
              Səfərdən əvvəl
              <em> bilməli olduqlarınız.</em>
            </h2>
          </div>

          <div className="transfer-service-tabs">
            {serviceTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    activeTab === tab.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                >
                  {activeTab === tab.id && (
                    <motion.span
                      className="transfer-tab-bg"
                      layoutId="transfer-tab"
                      transition={{
                        type: "spring",
                        stiffness: 330,
                        damping: 31,
                      }}
                    />
                  )}

                  <span className="transfer-tab-icon">
                    <Icon size={17} />
                  </span>

                  <span>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="transfer-tab-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.28,
                }}
                className="transfer-tab-content-grid"
              >
                <div className="transfer-content-icon">
                  <ActiveIcon
                    size={22}
                    strokeWidth={1.35}
                  />
                </div>

                <div>
                  <span>
                    {active.short}
                  </span>

                  <h3>{active.title}</h3>
                </div>

                <div className="transfer-tab-copy">
                  <p>{active.text}</p>

                  <div>
                    <Sparkles size={13} />
                    <span>
                      {active.note}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="transfer-benefits">
        <div className="transfer-detail-inner">
          <div className="transfer-benefit-grid">
            <div>
              <ShieldCheck size={19} />
              <span>100% Təhlükəsizlik</span>
              <p>
                Kasko sığortalı və etibarlı
                avtomobillər.
              </p>
            </div>

            <div>
              <CreditCard size={19} />
              <span>
                Təhlükəsiz ödənişlər
              </span>
              <p>
                Aydın və qorunan ödəniş
                prosesi.
              </p>
            </div>

            <div>
              <Headphones size={19} />
              <span>24/7 Dəstək</span>
              <p>
                Səfəriniz boyunca bizimlə
                əlaqə saxlaya bilərsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="transfer-faq-section">
        <div className="transfer-detail-inner">
          <div className="transfer-section-heading transfer-faq-heading">
            <span>02 / FAQ</span>

            <h2>
              Tez-tez verilən
              <em> suallar.</em>
            </h2>

            <p>
              Transfer sifarişi ilə bağlı
              əsas məlumatlar.
            </p>
          </div>

          <div className="transfer-faq-list">
            {faqs.map((faq, index) => {
              const opened =
                openFaq === index;

              return (
                <motion.div
                  layout
                  key={faq.q}
                  className={`transfer-faq-item ${
                    opened ? "open" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        opened ? null : index
                      )
                    }
                  >
                    <span className="faq-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <strong>
                      {faq.q}
                    </strong>

                    <motion.span
                      className="faq-toggle"
                      animate={{
                        rotate:
                          opened ? 180 : 0,
                      }}
                    >
                      <ChevronDown
                        size={15}
                      />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {opened && (
                      <motion.div
                        className="faq-answer-wrap"
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
                          duration: 0.3,
                          ease,
                        }}
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {relatedCars.length > 0 && (
        <section className="transfer-related">
          <div className="transfer-detail-inner">
            <div className="transfer-section-heading transfer-related-heading">
              <span>03 / TRANSFER PARKI</span>

              <h2>
                Digər
                <em> avtomobillər.</em>
              </h2>

              <Link href="/avtomobiller">
                Hamısına bax
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="transfer-related-grid">
              {relatedCars.map(
                (item, index) => {
                  const price =
                    getStartingPrice(item);

                  return (
                    <motion.div
                      key={item.slug}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          index * 0.06,
                      }}
                    >
                      <Link
                        href={`/transfer/${item.slug}`}
                        className="transfer-related-card"
                      >
                        <div>
                          <span>
                            {item.category}
                          </span>

                          <img
                            src={
                              item.thumbnail
                            }
                            alt={item.title}
                          />

                          <i>
                            <ArrowUpRight
                              size={14}
                            />
                          </i>
                        </div>

                        <section>
                          <div>
                            <small>
                              {item.brand}
                            </small>
                            <strong>
                              {item.title}
                            </strong>
                          </div>

                          {price !== null && (
                            <p>
                              <small>
                                Başlayır
                              </small>
                              <strong>
                                {price} ₼
                              </strong>
                            </p>
                          )}
                        </section>
                      </Link>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="transfer-final-cta">
        <div className="transfer-detail-inner transfer-final-inner">
          <div>
            <span>CARBON TRANSFER</span>
            <h2>
              Haraya gedirsiniz?
              <em>
                {" "}
                Sizi biz çatdıraq.
              </em>
            </h2>
          </div>

          <a href="tel:+994554840006">
            Əlaqə saxla
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
