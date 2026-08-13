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
import {
  translateCarValue,
  useCarbonCopy,
} from "@/lib/carbon-locale";

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

const transferText = {
  az: {
    back: "Transfer avtomobillərinə qayıt",
    driverOnly: "Avtomobil yalnız sürücü ilə təqdim olunur",
    person: "nəfər",
    engine: "mühərrik",
    baggage: "baqaj",
    prices: "TRANSFER QİYMƏTLƏRİ",
    chooseRoute1: "İstiqaməti",
    chooseRoute2: " seçin.",
    starts: "Başlayır",
    request: "Müraciət et",
    orderTransfer: "Transfer sifariş edin",
    process: "01 / PROSES",
    beforeTrip1: "Səfərdən əvvəl",
    beforeTrip2: " bilməli olduqlarınız.",
    benefits: [
      ["100% Təhlükəsizlik", "Kasko sığortalı və etibarlı avtomobillər."],
      ["Təhlükəsiz ödənişlər", "Aydın və qorunan ödəniş prosesi."],
      ["24/7 Dəstək", "Səfəriniz boyunca bizimlə əlaqə saxlaya bilərsiniz."],
    ],
    faqLabel: "02 / FAQ",
    faqTitle1: "Tez-tez verilən",
    faqTitle2: " suallar.",
    faqIntro: "Transfer sifarişi ilə bağlı əsas məlumatlar.",
    relatedLabel: "03 / TRANSFER PARKI",
    other1: "Digər",
    other2: " avtomobillər.",
    viewAll: "Hamısına bax",
    final1: "Haraya gedirsiniz?",
    final2: " Sizi biz çatdıraq.",
    contact: "Əlaqə saxla",
    tabs: serviceTabs,
    faqs,
    routeNames: {
      baku: ["Hava Limanı", "Bakı"],
      seaBreeze: ["Sea Breeze", "Hava Limanı"],
      qabala: ["Qəbələ", "Bakı"],
      ismayilli: ["İsmayıllı", "Bakı"],
      quba: ["Quba", "Bakı"],
      shamaxi: ["Şamaxı", "Bakı"],
      shaki: ["Şəki", "Bakı"],
      shusha: ["Şuşa", "Bakı"],
      lankaran: ["Lənkəran", "Bakı"],
    },
  },
  en: {
    back: "Back to transfer cars",
    driverOnly: "The car is provided with a driver only",
    person: "passengers",
    engine: "engine",
    baggage: "luggage",
    prices: "TRANSFER PRICES",
    chooseRoute1: "Choose",
    chooseRoute2: " a route.",
    starts: "Starts from",
    request: "Send request",
    orderTransfer: "Order a transfer",
    process: "01 / PROCESS",
    beforeTrip1: "What to know",
    beforeTrip2: " before the trip.",
    benefits: [
      ["100% Safety", "Reliable cars with comprehensive insurance."],
      ["Secure payments", "Clear and protected payment process."],
      ["24/7 Support", "You can contact us throughout your trip."],
    ],
    faqLabel: "02 / FAQ",
    faqTitle1: "Frequently asked",
    faqTitle2: " questions.",
    faqIntro: "Key information about transfer orders.",
    relatedLabel: "03 / TRANSFER FLEET",
    other1: "Other",
    other2: " cars.",
    viewAll: "View all",
    final1: "Where are you going?",
    final2: " We will take you there.",
    contact: "Contact us",
    tabs: [
      {
        ...serviceTabs[0],
        label: "Arrive on time",
        short: "Time",
        title: "We plan your transfer time in advance.",
        text:
          "For your transfer, our team confirms the suitable time with you in advance. The driver is ready at the agreed time and your trip starts without delay.",
        note:
          "If your flight or pickup time changes, simply inform our team in advance.",
      },
      {
        ...serviceTabs[1],
        label: "What to provide",
        short: "Details",
        title: "The document process for transfer is minimal.",
        text:
          "Unlike self-drive rental, transfer service is provided with a driver. It is enough to share your contact details, pickup point and trip details correctly.",
        note:
          "For airport transfers, sharing your flight number helps organize pickup smoothly.",
      },
      {
        ...serviceTabs[2],
        label: "Payment",
        short: "Payment",
        title: "Transfer terms are confirmed in advance.",
        text:
          "The transfer price is based on the selected car and route. Reservation and payment details are shared by our team when the order is confirmed.",
        note:
          "Special routes, extra stops or different requests can affect the final price.",
      },
    ],
    faqs: [
      {
        q: "Is the driver included in the transfer price?",
        a:
          "Yes. Transfer cars are provided only with a driver, and the listed transfer service is designed for this format.",
      },
      {
        q: "Is airport pickup available?",
        a:
          "Yes. Airport transfer can be arranged. Share your flight and contact details when ordering so pickup is organized smoothly.",
      },
      {
        q: "Can I order a transfer to another destination?",
        a:
          "Yes. Contact our team for routes not listed. The route and price will be calculated separately.",
      },
      {
        q: "Can the transfer time be changed later?",
        a:
          "When possible, time changes can be arranged. We recommend informing us as early as possible.",
      },
      {
        q: "Is a deposit required for transfer?",
        a:
          "Reservation and payment terms are confirmed by our team according to the selected route and order.",
      },
      {
        q: "Can we make an extra stop?",
        a:
          "Yes, it can be agreed in advance. Extra stops or route changes may affect the final price.",
      },
    ],
    routeNames: {
      baku: ["Airport", "Baku"],
      seaBreeze: ["Sea Breeze", "Airport"],
      qabala: ["Gabala", "Baku"],
      ismayilli: ["Ismayilli", "Baku"],
      quba: ["Guba", "Baku"],
      shamaxi: ["Shamakhi", "Baku"],
      shaki: ["Sheki", "Baku"],
      shusha: ["Shusha", "Baku"],
      lankaran: ["Lankaran", "Baku"],
    },
  },
  ru: {
    back: "Назад к трансферным авто",
    driverOnly: "Автомобиль предоставляется только с водителем",
    person: "пассажиров",
    engine: "двигатель",
    baggage: "багаж",
    prices: "ЦЕНЫ НА ТРАНСФЕР",
    chooseRoute1: "Выберите",
    chooseRoute2: " направление.",
    starts: "От",
    request: "Отправить заявку",
    orderTransfer: "Заказать трансфер",
    process: "01 / ПРОЦЕСС",
    beforeTrip1: "Что нужно знать",
    beforeTrip2: " перед поездкой.",
    benefits: [
      ["100% безопасность", "Надежные автомобили с КАСКО."],
      ["Безопасные платежи", "Понятный и защищенный процесс оплаты."],
      ["Поддержка 24/7", "Вы можете связаться с нами во время поездки."],
    ],
    faqLabel: "02 / FAQ",
    faqTitle1: "Частые",
    faqTitle2: " вопросы.",
    faqIntro: "Основная информация о заказе трансфера.",
    relatedLabel: "03 / ТРАНСФЕРНЫЙ ПАРК",
    other1: "Другие",
    other2: " автомобили.",
    viewAll: "Смотреть все",
    final1: "Куда вы едете?",
    final2: " Мы вас довезем.",
    contact: "Связаться",
    tabs: [
      {
        ...serviceTabs[0],
        label: "Прибыть вовремя",
        short: "Время",
        title: "Мы заранее планируем время трансфера.",
        text:
          "Команда заранее уточняет удобное для вас время трансфера. Водитель будет готов в согласованное время, и поездка начнется без задержек.",
        note:
          "Если время рейса или встречи изменится, достаточно заранее сообщить нашей команде.",
      },
      {
        ...serviceTabs[1],
        label: "Что предоставить",
        short: "Данные",
        title: "Процесс документов для трансфера минимален.",
        text:
          "В отличие от аренды без водителя, трансфер предоставляется с водителем. Достаточно правильно указать контакты, точку встречи и детали поездки.",
        note:
          "Для трансфера из аэропорта номер рейса помогает организовать встречу спокойнее.",
      },
      {
        ...serviceTabs[2],
        label: "Оплата",
        short: "Оплата",
        title: "Условия трансфера уточняются заранее.",
        text:
          "Цена зависит от выбранного автомобиля и направления. Детали бронирования и оплаты команда сообщает при подтверждении заказа.",
        note:
          "Особый маршрут, дополнительная остановка или отдельные пожелания могут изменить финальную цену.",
      },
    ],
    faqs: [
      {
        q: "Входит ли водитель в стоимость трансфера?",
        a:
          "Да. Трансферные автомобили предоставляются только с водителем, и указанная услуга рассчитана на этот формат.",
      },
      {
        q: "Возможна ли встреча в аэропорту?",
        a:
          "Да. Трансфер из аэропорта можно организовать. Для удобной встречи укажите номер рейса и контактные данные при заказе.",
      },
      {
        q: "Можно заказать трансфер в другое направление?",
        a:
          "Да. Свяжитесь с нашей командой для направления вне списка. Маршрут и цена будут рассчитаны отдельно.",
      },
      {
        q: "Можно изменить время трансфера позже?",
        a:
          "Если возможно, изменение времени организуется. Рекомендуем сообщать об изменениях как можно раньше.",
      },
      {
        q: "Нужен ли депозит для трансфера?",
        a:
          "Условия бронирования и оплаты подтверждаются командой в зависимости от выбранного маршрута и заказа.",
      },
      {
        q: "Можно сделать дополнительную остановку?",
        a:
          "Да, это можно согласовать заранее. Дополнительная остановка или изменение маршрута могут повлиять на итоговую цену.",
      },
    ],
    routeNames: {
      baku: ["Аэропорт", "Баку"],
      seaBreeze: ["Sea Breeze", "Аэропорт"],
      qabala: ["Габала", "Баку"],
      ismayilli: ["Исмаиллы", "Баку"],
      quba: ["Губа", "Баку"],
      shamaxi: ["Шамахы", "Баку"],
      shaki: ["Шеки", "Баку"],
      shusha: ["Шуша", "Баку"],
      lankaran: ["Ленкорань", "Баку"],
    },
  },
} as const;

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
  const { locale } = useCarbonCopy();
  const t = transferText[locale];
  const [activeTab, setActiveTab] =
    useState("time");

  const [openFaq, setOpenFaq] =
    useState<number | null>(0);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const active =
    t.tabs.find(
      (tab) => tab.id === activeTab
    ) ?? t.tabs[0];

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
              {t.back}
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
                <span>{translateCarValue(car.category, locale)}</span>
              </div>

              <h1>{car.title}</h1>

              <p className="transfer-driver-note">
                <Check size={13} />
                {t.driverOnly}
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
                    {t.person}
                  </span>
                )}

                {car.engine && (
                  <span>
                    <Gauge size={14} />
                    <strong>{car.engine}</strong>
                    {t.engine}
                  </span>
                )}

                <span>
                  <Fuel size={14} />
                  <strong>
                    {translateCarValue(car.transmission, locale)}
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
                    {t.baggage}
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
                    {t.prices}
                  </span>
                  <h2>
                    {t.chooseRoute1}
                    <em>{t.chooseRoute2}</em>
                  </h2>
                </div>

                {startingPrice !== null && (
                  <div className="transfer-start">
                    <small>{t.starts}</small>
                    <strong>
                      {startingPrice} ₼
                    </strong>
                  </div>
                )}
              </div>

              <div className="transfer-route-list">
                {availableRoutes.map(
                  (
                    { key },
                    index
                  ) => {
                    const [from, to] = t.routeNames[key];

                    return (
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
                  );
                  }
                )}
              </div>

              <a
                href="tel:+994554840006"
                className="transfer-apply"
              >
                <span>
                  {t.request}
                  <small>
                    {t.orderTransfer}
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
            <span>{t.process}</span>

            <h2>
              {t.beforeTrip1}
              <em>{t.beforeTrip2}</em>
            </h2>
          </div>

          <div className="transfer-service-tabs">
            {t.tabs.map((tab) => {
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
              <span>{t.benefits[0][0]}</span>
              <p>{t.benefits[0][1]}</p>
            </div>

            <div>
              <CreditCard size={19} />
              <span>
                {t.benefits[1][0]}
              </span>
              <p>{t.benefits[1][1]}</p>
            </div>

            <div>
              <Headphones size={19} />
              <span>{t.benefits[2][0]}</span>
              <p>{t.benefits[2][1]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="transfer-faq-section">
        <div className="transfer-detail-inner">
          <div className="transfer-section-heading transfer-faq-heading">
            <span>{t.faqLabel}</span>

            <h2>
              {t.faqTitle1}
              <em>{t.faqTitle2}</em>
            </h2>

            <p>{t.faqIntro}</p>
          </div>

          <div className="transfer-faq-list">
            {t.faqs.map((faq, index) => {
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
              <span>{t.relatedLabel}</span>

              <h2>
                {t.other1}
                <em>{t.other2}</em>
              </h2>

              <Link href="/avtomobiller">
                {t.viewAll}
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
                            {translateCarValue(item.category, locale)}
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
                                {t.starts}
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
              {t.final1}
              <em>
                {t.final2}
              </em>
            </h2>
          </div>

          <a href="tel:+994554840006">
            {t.contact}
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
