"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Fuel,
  Gauge,
  Headphones,
  Luggage,
  MapPin,
  Minus,
  Phone,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import CarbonNavbar from "@/components/CarbonNavbar";
import CarbonDateRangePicker from "@/components/CarbonDateRangePicker";
import {
  translateCarValue,
  useCarbonCopy,
} from "@/lib/carbon-locale";
import {
  type Car,
  type CarVariant,
  getShortTermPrice,
} from "@/data/cars";

const ease = [0.22, 1, 0.36, 1] as const;

const pricingTiers = [
  { key: "days1to3", label: "1–3 gün", min: 1, max: 3 },
  { key: "days4to7", label: "4–7 gün", min: 4, max: 7 },
  { key: "days8to15", label: "8–15 gün", min: 8, max: 15 },
  { key: "days16to24", label: "16–24 gün", min: 16, max: 24 },
  { key: "days25to30", label: "25–30 gün", min: 25, max: 30 },
  { key: "days30plus", label: "30+ gün", min: 31, max: Infinity },
] as const;

const pickupOptions = [
  {
    id: "office",
    title: "Carbon məntəqəsi",
    text: "Avtomobili məntəqədən təhvil alın",
    icon: CarFront,
  },
  {
    id: "delivery",
    title: "Çatdırılma",
    text: "Ünvanınıza çatdırılma sorğusu",
    icon: MapPin,
  },
];

const extras = [
  {
    id: "support",
    title: "Prioritet dəstək",
    text: "Rezervasiya boyunca sürətli əlaqə",
    price: 0,
    icon: Headphones,
  },
  {
    id: "second-driver",
    title: "Əlavə sürücü",
    text: "İkinci sürücünü rezervasiyaya əlavə edin",
    price: 0,
    icon: Users,
  },
];

const detailText = {
  az: {
    reservation: "REZERVASİYA",
    tripTitle: "Səfərinizi qurun.",
    requestOpen: "Sorğu açıqdır",
    selectedDuration: "Seçilmiş müddət üçün",
    day: "gün",
    byRequest: "Sorğu ilə",
    extras: "Əlavələr",
    selected: "seçilib",
    optional: "İstəyə bağlı",
    estimatedTotal: "Təxmini məbləğ",
    nextStep: "NÖVBƏTİ ADDIM",
    confirm: "Rezervasiyanı təsdiqlə",
    security:
      "Sorğu göndərmə ödəniş yaratmır. Mövcudluq və yekun şərtlər Carbon komandası tərəfindən təsdiqlənir.",
    heroTitle1: "Avtomobil hazırdır.",
    heroTitle2: "Siz tarixi seçin.",
    heroIntro:
      "Tarixləri seçin və təxmini qiyməti dərhal görün. Son təsdiqdən əvvəl komandamız mövcudluğu və bütün şərtləri sizinlə dəqiqləşdirəcək.",
    clearTerms: "Aydın şərtlər",
    noHiddenSteps: "Gizli addım yoxdur",
    directSupport: "Birbaşa dəstək",
    carbonTeam: "Carbon komandası ilə",
    freeRequest: "Ödənişsiz sorğu",
    confirmFirst: "Əvvəl təsdiq, sonra proses",
    cars: "Avtomobillər",
    forRent: "İCARƏ ÜÇÜN",
    passenger: "Sərnişin",
    person: "nəfər",
    fuel: "Yanacaq",
    transmission: "Sürətlər qutusu",
    engine: "Mühərrik",
    luggage: "Baqaj",
    large: "böyük",
    pickupOfficeTitle: "Carbon məntəqəsi",
    pickupDeliveryTitle: "Çatdırılma",
    prioritySupportTitle: "Prioritet dəstək",
    prioritySupportText: "Rezervasiya boyunca sürətli əlaqə",
    secondDriverTitle: "Əlavə sürücü",
    secondDriverText: "İkinci sürücünü rezervasiyaya əlavə edin",
    alternatives: "ALTERNATİVLƏR",
    anotherChoice1: "Başqa bir",
    anotherChoice2: " seçim?",
    allCars: "Bütün avtomobillər",
    startingPrice: "Başlayan qiymət",
    booking: "Rezervasiya",
    bestRate: "ƏN YAXŞI TARİF",
  },
  en: {
    reservation: "RESERVATION",
    tripTitle: "Set up your trip.",
    requestOpen: "Request is open",
    selectedDuration: "For the selected duration",
    day: "day",
    byRequest: "On request",
    extras: "Extras",
    selected: "selected",
    optional: "Optional",
    estimatedTotal: "Estimated total",
    nextStep: "NEXT STEP",
    confirm: "Confirm reservation",
    security:
      "Sending a request does not create a payment. Availability and final terms are confirmed by the Carbon team.",
    heroTitle1: "The car is ready.",
    heroTitle2: "Choose your dates.",
    heroIntro:
      "Select dates and see the estimated price instantly. Before final confirmation, our team will confirm availability and all terms with you.",
    clearTerms: "Clear terms",
    noHiddenSteps: "No hidden steps",
    directSupport: "Direct support",
    carbonTeam: "With the Carbon team",
    freeRequest: "Free request",
    confirmFirst: "Confirmation first, process after",
    cars: "Cars",
    forRent: "FOR RENT",
    passenger: "Passenger",
    person: "people",
    fuel: "Fuel",
    transmission: "Transmission",
    engine: "Engine",
    luggage: "Luggage",
    large: "large",
    pickupOfficeTitle: "Carbon office",
    pickupDeliveryTitle: "Delivery",
    prioritySupportTitle: "Priority support",
    prioritySupportText: "Fast contact throughout the reservation",
    secondDriverTitle: "Additional driver",
    secondDriverText: "Add a second driver to the reservation",
    alternatives: "ALTERNATIVES",
    anotherChoice1: "Another",
    anotherChoice2: " choice?",
    allCars: "All cars",
    startingPrice: "Starting price",
    booking: "Reservation",
    bestRate: "BEST RATE",
  },
  ru: {
    reservation: "БРОНИРОВАНИЕ",
    tripTitle: "Настройте поездку.",
    requestOpen: "Заявка открыта",
    selectedDuration: "За выбранный период",
    day: "день",
    byRequest: "По запросу",
    extras: "Дополнительно",
    selected: "выбрано",
    optional: "Опционально",
    estimatedTotal: "Итого ориентировочно",
    nextStep: "СЛЕДУЮЩИЙ ШАГ",
    confirm: "Подтвердить бронирование",
    security:
      "Отправка заявки не создает оплату. Наличие и финальные условия подтверждаются командой Carbon.",
    heroTitle1: "Автомобиль готов.",
    heroTitle2: "Выберите даты.",
    heroIntro:
      "Выберите даты и сразу увидьте ориентировочную стоимость. Перед финальным подтверждением наша команда уточнит наличие и все условия.",
    clearTerms: "Понятные условия",
    noHiddenSteps: "Без скрытых шагов",
    directSupport: "Прямая поддержка",
    carbonTeam: "С командой Carbon",
    freeRequest: "Бесплатная заявка",
    confirmFirst: "Сначала подтверждение, затем процесс",
    cars: "Автомобили",
    forRent: "ДЛЯ АРЕНДЫ",
    passenger: "Пассажиры",
    person: "чел.",
    fuel: "Топливо",
    transmission: "Коробка передач",
    engine: "Двигатель",
    luggage: "Багаж",
    large: "большой",
    pickupOfficeTitle: "Офис Carbon",
    pickupDeliveryTitle: "Доставка",
    prioritySupportTitle: "Приоритетная поддержка",
    prioritySupportText: "Быстрая связь на протяжении бронирования",
    secondDriverTitle: "Дополнительный водитель",
    secondDriverText: "Добавьте второго водителя к бронированию",
    alternatives: "АЛЬТЕРНАТИВЫ",
    anotherChoice1: "Другой",
    anotherChoice2: " вариант?",
    allCars: "Все автомобили",
    startingPrice: "Цена от",
    booking: "Бронирование",
    bestRate: "ЛУЧШИЙ ТАРИФ",
  },
} as const;

function isoToday(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

function differenceInDays(start: string, end: string) {
  if (!start || !end) return 1;

  const a = new Date(`${start}T12:00:00`);
  const b = new Date(`${end}T12:00:00`);

  const difference = Math.ceil(
    (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24),
  );

  return Math.max(1, difference);
}


function getRate(car: Car, days: number) {
  const tier =
    pricingTiers.find(
      (item) => days >= item.min && days <= item.max,
    ) ?? pricingTiers[pricingTiers.length - 1];

  return car.rentalPrices[tier.key];
}

function getVariantStartingPrice(variant: CarVariant) {
  return (
    variant.rentalPrices.days1to3 ??
    variant.rentalPrices.days4to7 ??
    variant.rentalPrices.days8to15 ??
    variant.rentalPrices.days16to24 ??
    variant.rentalPrices.days25to30 ??
    variant.rentalPrices.days30plus
  );
}

function formatDate(value: string, locale: "az" | "en" | "ru") {
  if (!value) {
    return locale === "ru"
      ? "Дата не выбрана"
      : locale === "en"
        ? "Date not selected"
        : "Tarix seçilməyib";
  }

  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-US" : "az-AZ";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function ReservationPanel({
  car,
  compact = false,
}: {
  car: Car;
  compact?: boolean;
}) {
  const { locale } = useCarbonCopy();
  const t = detailText[locale];
  const [startDate, setStartDate] = useState(isoToday(1));
  const [endDate, setEndDate] = useState(isoToday(4));
  const [pickup, setPickup] = useState("office");
  const [pickupOpen, setPickupOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [drivers, setDrivers] = useState(1);

  const days = useMemo(
    () => differenceInDays(startDate, endDate),
    [startDate, endDate],
  );

  const dailyRate = getRate(car, days);

  const estimatedTotal =
    typeof dailyRate === "number" ? dailyRate * days : null;

  const selectedPickup =
    pickupOptions.find((item) => item.id === pickup) ??
    pickupOptions[0];
  const selectedPickupTitle =
    selectedPickup.id === "delivery"
      ? t.pickupDeliveryTitle
      : t.pickupOfficeTitle;
  const localizedExtras = extras.map((extra) => ({
    ...extra,
    title:
      extra.id === "second-driver"
        ? t.secondDriverTitle
        : t.prioritySupportTitle,
    text:
      extra.id === "second-driver"
        ? t.secondDriverText
        : t.prioritySupportText,
  }));

  const checkoutParams = new URLSearchParams({
    car: car.slug,
    start: startDate,
    end: endDate,
    pickup,
    drivers: String(drivers),
  });

  if (selectedExtras.length) {
    checkoutParams.set("extras", selectedExtras.join(","));
  }

  const checkoutHref = `/rezervasiya?${checkoutParams.toString()}`;

  function toggleExtra(id: string) {
    setSelectedExtras((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div
      className={`carbon-reserve-card ${
        compact ? "carbon-reserve-card-compact" : ""
      }`}
    >
      <div className="carbon-reserve-card-top">
        <div>
          <span className="carbon-reserve-kicker">
            {t.reservation}
          </span>

          <h3>{t.tripTitle}</h3>
        </div>

        <div className="carbon-live-status">
          <i />
          {t.requestOpen}
        </div>
      </div>

      <div className="carbon-reserve-price">
        <span>{t.selectedDuration}</span>

        {dailyRate !== null ? (
          <div>
            <strong>{dailyRate} ₼</strong>
            <small>/ {t.day}</small>
          </div>
        ) : (
          <strong>{t.byRequest}</strong>
        )}
      </div>

      <CarbonDateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(nextStart, nextEnd) => {
            setStartDate(nextStart);
            setEndDate(nextEnd);
          }}
        />

      <div className="carbon-extras">
        <button
          type="button"
          className="carbon-extras-trigger"
          onClick={() => setExtrasOpen((value) => !value)}
        >
          <span>
            <Sparkles size={14} />
            {t.extras}
          </span>

          <span>
            {selectedExtras.length
              ? `${selectedExtras.length} ${t.selected}`
              : t.optional}

            <ChevronDown
              size={14}
              className={extrasOpen ? "rotate" : ""}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {extrasOpen && (
            <motion.div
              className="carbon-extras-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              {localizedExtras.map((extra) => {
                const Icon = extra.icon;
                const selected = selectedExtras.includes(
                  extra.id,
                );

                return (
                  <button
                    type="button"
                    key={extra.id}
                    className={selected ? "active" : ""}
                    onClick={() => toggleExtra(extra.id)}
                  >
                    <span className="carbon-extra-check">
                      {selected && <Check size={11} />}
                    </span>

                    <Icon size={15} />

                    <span>
                      <strong>{extra.title}</strong>
                      <small>{extra.text}</small>
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="carbon-reserve-summary">
        <div>
          <span>
            {formatDate(startDate, locale)} — {formatDate(endDate, locale)}
          </span>

          <small>
            {days} {t.day} · {selectedPickupTitle}
          </small>
        </div>

        <div className="carbon-reserve-total">
          <span>{t.estimatedTotal}</span>

          <strong>
            {estimatedTotal !== null
              ? `${estimatedTotal} ₼`
              : t.byRequest}
          </strong>
        </div>
      </div>

      <motion.a
        href={checkoutHref}
        className="carbon-reserve-submit"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
      >
        <span>
          <small>{t.nextStep}</small>
          {t.confirm}
        </span>

        <span className="carbon-submit-arrow">
          <ArrowRight size={17} />
        </span>
      </motion.a>

      <div className="carbon-reserve-security">
        <ShieldCheck size={13} />

        <span>
          {t.security}
        </span>
      </div>
    </div>
  );
}

export default function CarDetailClient({
  car,
  relatedCars,
}: {
  car: Car;
  relatedCars: Car[];
}) {
  const { locale } = useCarbonCopy();
  const t = detailText[locale];
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const carY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 70],
  );

  const carScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.96],
  );

  const startingPrice = getShortTermPrice(car);

  const specs = [
    {
      icon: Users,
      label: t.passenger,
      value:
        car.seats !== null ? `${car.seats} ${t.person}` : "—",
    },
    {
      icon: Fuel,
      label: t.fuel,
      value: translateCarValue(car.fuel, locale),
    },
    {
      icon: Settings2,
      label: t.transmission,
      value: translateCarValue(car.transmission, locale),
    },
    {
      icon: Gauge,
      label: t.engine,
      value: car.engine ?? "—",
    },
    {
      icon: CalendarDays,
      label: "İl",
      value: car.manufactureYear ? String(car.manufactureYear) : "—",
    },
    {
      icon: Luggage,
      label: t.luggage,
      value:
        car.baggage !== null ? `${car.baggage} ${t.large}` : "—",
    },
  ];

  const availableTiers = pricingTiers.filter(
    (tier) => car.rentalPrices[tier.key] !== null,
  );
  const formatTierLabel = (tier: (typeof pricingTiers)[number]) =>
    tier.key === "days30plus"
      ? `30+ ${t.day}`
      : `${tier.min}-${tier.max} ${t.day}`;

  return (
    <main className="carbon-detail-v3">
      <CarbonNavbar light active="cars" />

      <section
        className="carbon-detail-hero"
        ref={heroRef}
      >
        <div className="carbon-detail-container">
          <motion.div
            className="carbon-detail-breadcrumb"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Link href="/avtomobiller">
              <ArrowLeft size={13} />
              {t.cars}
            </Link>

            <span>/</span>
            <span>{car.brand}</span>
            <span>/</span>
            <strong>{car.title}</strong>
          </motion.div>

          <div className="carbon-detail-layout">
            <div className="carbon-detail-left">
              <motion.div
                className="carbon-detail-title-row"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.08,
                  ease,
                }}
              >
                <div>
                  <span className="carbon-detail-kicker">
                    {car.brand} · {car.category}
                  </span>

                  <h1>{car.title}</h1>
                </div>

                <div className="carbon-detail-index">
                  <span>CARBON FLEET</span>
                  <strong>
                    {car.id.slice(0, 2).toUpperCase()}
                  </strong>
                </div>
              </motion.div>

              <motion.div
                className="carbon-showroom-v3"
                initial={{
                  opacity: 0,
                  y: 25,
                  scale: 0.985,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.14,
                  ease,
                }}
              >
                <div className="carbon-showroom-grid" />
                <div className="carbon-showroom-glow" />

                <div className="carbon-showroom-top">
                  <div className="carbon-showroom-status">
                    <i />
                    {t.forRent}
                  </div>

                  <div className="carbon-showroom-tags">
                    <span>{car.category}</span>

                    {car.transferAvailable && (
                      <span>Transfer</span>
                    )}
                  </div>
                </div>

                <div className="carbon-showroom-word">
                  {car.brand}
                </div>

                <motion.div
                  className="carbon-showroom-car"
                  style={{
                    y: carY,
                    scale: carScale,
                  }}
                >
                  <div className="carbon-showroom-shadow" />

                  <Image
                    src={car.thumbnail}
                    alt={car.title}
                    fill
                    priority
                    sizes="(max-width: 1000px) 100vw, 65vw"
                  />
                </motion.div>

                <div className="carbon-showroom-bottom">
                  <span>
                    <Zap size={13} />
                    CARBON SELECTED
                  </span>

                  <span>AZ · BAKU</span>
                </div>
              </motion.div>

              <motion.div
                className="carbon-spec-rail"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.32,
                  ease,
                }}
              >
                {specs.map((spec) => {
                  const Icon = spec.icon;

                  return (
                    <div key={spec.label}>
                      <Icon size={16} strokeWidth={1.45} />

                      <span>
                        <small>{spec.label}</small>
                        <strong>{spec.value}</strong>
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            <motion.aside
              className="carbon-detail-reservation"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.22,
                ease,
              }}
            >
              <ReservationPanel car={car} />
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="carbon-price-experience">
        <div className="carbon-detail-container">
          <motion.div
            className="carbon-section-head-v3"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease }}
          >
            <div>
              <span>FLEXIBLE RATE</span>

              <h2>
                Daha uzun sürün.
                <br />
                <em>Daha yaxşı qiymət.</em>
              </h2>
            </div>

            <p>
              Günlük qiymət icarə müddətinə uyğun avtomatik
              dəyişir. Aşağıdakı tariflər bu avtomobilin real
              Carbon qiymət cədvəlindən götürülür.
            </p>
          </motion.div>

          <div className="carbon-rate-grid">
            {pricingTiers.map((tier, index) => {
              const price = car.rentalPrices[tier.key];
              const best =
                price !== null &&
                availableTiers.length > 0 &&
                price ===
                  Math.min(
                    ...availableTiers.map(
                      (item) =>
                        car.rentalPrices[item.key] as number,
                    ),
                  );

              return (
                <motion.div
                  key={tier.key}
                  className={`carbon-rate-card ${
                    best ? "best" : ""
                  }`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.055,
                    ease,
                  }}
                >
                  <div className="carbon-rate-card-top">
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {best && <small>{t.bestRate}</small>}
                  </div>

                  <strong>{formatTierLabel(tier)}</strong>

                  <div className="carbon-rate-value">
                    {price !== null ? (
                      <>
                        <b>{price}</b>
                        <span>
                          ₼
                          <small>/ {t.day}</small>
                        </span>
                      </>
                    ) : (
                      <b className="carbon-rate-na">—</b>
                    )}
                  </div>

                  <div className="carbon-rate-line" />
                </motion.div>
              );
            })}
          </div>

          {car.variants?.length ? (
            <motion.section
              className="carbon-variant-rates"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.62, ease }}
            >
              <div className="carbon-section-head-v3">
                <div>
                  <span>YEAR / BODY VARIANTS</span>

                  <h2>
                    Eyni model.
                    <br />
                    <em>Fərqli il və kuzov.</em>
                  </h2>
                </div>

                <p>
                  Bu model üzrə mövcud variantları və hər variantın
                  başlanğıc günlük qiymətini müqayisə edin.
                </p>
              </div>

              <div className="carbon-variant-grid">
                {car.variants.map((variant) => {
                  const price = getVariantStartingPrice(variant);
                  const image = variant.thumbnail || car.thumbnail;

                  return (
                    <article key={variant.id} className="carbon-variant-card">
                      <div className="carbon-variant-card-image">
                        <Image
                          src={image}
                          alt={`${car.title} ${variant.label}`}
                          fill
                          sizes="(max-width: 900px) 100vw, 180px"
                        />
                      </div>

                      <div className="carbon-variant-card-copy">
                        <span>{variant.label}</span>
                        <strong>
                          {[
                            variant.manufactureYear,
                            variant.bodyStyle,
                          ]
                            .filter(Boolean)
                            .join(" / ") || car.title}
                        </strong>
                        <small>
                          {variant.engine ?? car.engine ?? "Carbon variant"}
                        </small>
                      </div>

                      <b>
                        {price !== null ? `${price} ₼ / ${t.day}` : t.byRequest}
                      </b>
                    </article>
                  );
                })}
              </div>
            </motion.section>
          ) : null}
        </div>
      </section>

      <section className="carbon-detail-story">
        <div className="carbon-detail-container">
          <div className="carbon-story-layout">
            <div className="carbon-story-sticky">
              <span>THE CAR</span>

              <h2>
                Detallar
                <br />
                <em>önəmlidir.</em>
              </h2>

              <p>
                Gündəlik şəhər istifadəsindən uzun səfərlərə
                qədər rahat, aydın və problemsiz icarə
                təcrübəsi.
              </p>
            </div>

            <div className="carbon-story-specs">
              {specs.map((spec, index) => {
                const Icon = spec.icon;

                return (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <Icon size={18} strokeWidth={1.4} />

                    <div>
                      <small>{spec.label}</small>
                      <strong>{spec.value}</strong>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                className="carbon-story-highlight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <ShieldCheck size={21} />

                <div>
                  <span>CARBON STANDARD</span>
                  <strong>
                    Təmiz. Yoxlanılmış. Hazır.
                  </strong>
                  <p>
                    Hər avtomobil təhvil öncəsi texniki və
                    vizual yoxlamadan keçirilir.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="carbon-booking-experience"
        id="booking"
      >
        <div className="carbon-booking-orb carbon-booking-orb-a" />
        <div className="carbon-booking-orb carbon-booking-orb-b" />

        <div className="carbon-detail-container">
          <div className="carbon-booking-layout">
            <motion.div
              className="carbon-booking-copy-v3"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
            >
              <span>CARBON RESERVATION</span>

              <h2>
                {t.heroTitle1}
                <br />
                <em>{t.heroTitle2}</em>
              </h2>

              <p>{t.heroIntro}</p>

              <div className="carbon-booking-trust">
                <div>
                  <ShieldCheck size={18} />
                  <span>
                    <strong>{t.clearTerms}</strong>
                    <small>{t.noHiddenSteps}</small>
                  </span>
                </div>

                <div>
                  <Headphones size={18} />
                  <span>
                    <strong>{t.directSupport}</strong>
                    <small>{t.carbonTeam}</small>
                  </span>
                </div>

                <div>
                  <WalletCards size={18} />
                  <span>
                    <strong>{t.freeRequest}</strong>
                    <small>{t.confirmFirst}</small>
                  </span>
                </div>
              </div>

              <a
                href="tel:+994554840006"
                className="carbon-booking-phone"
              >
                <Phone size={15} />
                +994 55 484 00 06
              </a>
            </motion.div>

            <motion.div
              className="carbon-booking-card-wrap"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.08,
                ease,
              }}
            >
              <div className="carbon-booking-car-preview">
                <div>
                  <span>SEÇİLMİŞ AVTOMOBİL</span>
                  <strong>{car.title}</strong>
                </div>

                <Image
                  src={car.thumbnail}
                  alt={car.title}
                  width={260}
                  height={150}
                />
              </div>

              <ReservationPanel car={car} compact />
            </motion.div>
          </div>
        </div>
      </section>

      {relatedCars.length > 0 && (
        <section className="carbon-related-v3">
          <div className="carbon-detail-container">
            <div className="carbon-related-head-v3">
              <div>
                <span>{t.alternatives}</span>

                <h2>
                  {t.anotherChoice1}
                  <em>{t.anotherChoice2}</em>
                </h2>
              </div>

              <Link href="/avtomobiller">
                {t.allCars}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="carbon-related-grid-v3">
              {relatedCars.map((item, index) => {
                const price = getShortTermPrice(item);

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 28 }}
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
                      className="carbon-related-image"
                    >
                      <span>{translateCarValue(item.category, locale)}</span>

                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="(max-width: 800px) 100vw, 33vw"
                      />

                      <motion.i
                        whileHover={{
                          rotate: -8,
                          scale: 1.08,
                        }}
                      >
                        <ArrowRight size={15} />
                      </motion.i>
                    </Link>

                    <div className="carbon-related-info">
                      <div>
                        <span>{item.brand}</span>
                        <strong>{item.title}</strong>
                      </div>

                      <div>
                        {price !== null ? (
                          <>
                            <strong>{price} ₼</strong>
                            <span>/ {t.day}</span>
                          </>
                        ) : (
                          <span>{t.byRequest}</span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="carbon-mobile-reserve">
        <div>
          <span>{t.startingPrice}</span>

          <strong>
            {startingPrice !== null
              ? `${startingPrice} ₼ / ${t.day}`
              : t.byRequest}
          </strong>
        </div>

        <a href="#booking">
          {t.booking}
          <ArrowRight size={15} />
        </a>
      </div>
    </main>
  );
}
