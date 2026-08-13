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
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import CarbonNavbar from "@/components/CarbonNavbar";
import type { Car } from "@/data/cars";

const ease = [0.22, 1, 0.36, 1] as const;

const pricingTiers = [
  { key: "days1to3", min: 1, max: 3 },
  { key: "days4to7", min: 4, max: 7 },
  { key: "days8to15", min: 8, max: 15 },
  { key: "days16to24", min: 16, max: 24 },
  { key: "days25to30", min: 25, max: 30 },
  { key: "days30plus", min: 31, max: Infinity },
] as const;

const extraLabels: Record<string, string> = {
  support: "Prioritet dəstək",
  "second-driver": "Əlavə sürücü",
};

function isoToday(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

function differenceInDays(start: string, end: string) {
  if (!start || !end) return 1;

  const a = new Date(`${start}T12:00:00`);
  const b = new Date(`${end}T12:00:00`);

  return Math.max(
    1,
    Math.ceil(
      (b.getTime() - a.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
}

function getRate(car: Car, days: number) {
  const tier =
    pricingTiers.find(
      (item) => days >= item.min && days <= item.max,
    ) ?? pricingTiers[pricingTiers.length - 1];

  return car.rentalPrices[tier.key];
}

function formatDate(value: string) {
  if (!value) return "Seçilməyib";

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

type Initial = {
  start: string;
  end: string;
  pickup: string;
  drivers: string;
  extras: string;
};

export default function ReservationCheckout({
  car,
  initial,
}: {
  car: Car | null;
  initial: Initial;
}) {
  const [startDate, setStartDate] = useState(
    initial.start || isoToday(1),
  );

  const [endDate, setEndDate] = useState(
    initial.end || isoToday(4),
  );

  const [pickup, setPickup] = useState(
    initial.pickup === "delivery" ? "delivery" : "office",
  );

  const [drivers, setDrivers] = useState(
    initial.drivers === "2" ? 2 : 1,
  );

  const [selectedExtras, setSelectedExtras] = useState(
    initial.extras
      ? initial.extras.split(",").filter(Boolean)
      : [],
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const days = useMemo(
    () => differenceInDays(startDate, endDate),
    [startDate, endDate],
  );

  const dailyRate = car ? getRate(car, days) : null;

  const total =
    typeof dailyRate === "number"
      ? dailyRate * days
      : null;

  const extrasText = selectedExtras.length
    ? selectedExtras
        .map((id) => extraLabels[id] ?? id)
        .join(", ")
    : "Yoxdur";

  function toggleExtra(id: string) {
    setSelectedExtras((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function nextFromTrip(event: FormEvent) {
    event.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextFromContact(event: FormEvent) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) return;

    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function whatsappHref() {
    if (!car) return "#";

    const lines = [
      "Salam Carbon 👋",
      "",
      "Yeni avtomobil rezervasiya sorğusu:",
      "",
      `Avtomobil: ${car.title}`,
      `Kateqoriya: ${car.category}`,
      `Götürmə: ${formatDate(startDate)}`,
      `Qaytarma: ${formatDate(endDate)}`,
      `Müddət: ${days} gün`,
      `Təhvil: ${
        pickup === "delivery"
          ? "Ünvana çatdırılma"
          : "Carbon məntəqəsi"
      }`,
      ...(pickup === "delivery" && deliveryAddress
        ? [`Ünvan: ${deliveryAddress}`]
        : []),
      `Sürücü: ${drivers}`,
      `Əlavələr: ${extrasText}`,
      `Günlük qiymət: ${
        dailyRate !== null ? `${dailyRate} ₼` : "Sorğu ilə"
      }`,
      `Təxmini məbləğ: ${
        total !== null ? `${total} ₼` : "Sorğu ilə"
      }`,
      "",
      `Ad: ${name}`,
      `Telefon: ${phone}`,
      ...(note.trim() ? [`Qeyd: ${note.trim()}`] : []),
      "",
      "Mövcudluğu təsdiqləməyinizi xahiş edirəm.",
    ];

    return `https://wa.me/994554840006?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
  }

  function finishReservation() {
    setComplete(true);

    setTimeout(() => {
      window.open(
        whatsappHref(),
        "_blank",
        "noopener,noreferrer",
      );
    }, 700);
  }

  if (!car) {
    return (
      <main className="reservation-v4 reservation-v4-empty">
        <CarbonNavbar light active="cars" />

        <div className="reservation-v4-empty-inner">
          <span>CARBON RESERVATION</span>
          <h1>Avtomobil tapılmadı.</h1>
          <p>
            Rezervasiya linki natamamdır və ya avtomobil artıq
            mövcud deyil.
          </p>

          <Link href="/avtomobiller">
            <ArrowLeft size={15} />
            Avtomobillərə qayıt
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="reservation-v4">
      <CarbonNavbar light active="cars" />

      <div className="reservation-v4-progress">
        <motion.div
          animate={{
            width:
              step === 1
                ? "33.333%"
                : step === 2
                  ? "66.666%"
                  : "100%",
          }}
          transition={{ duration: 0.7, ease }}
        />
      </div>

      <section className="reservation-v4-hero">
        <div className="reservation-v4-grid-bg" />
        <div className="reservation-v4-orb reservation-v4-orb-a" />
        <div className="reservation-v4-orb reservation-v4-orb-b" />

        <div className="reservation-v4-container">
          <div className="reservation-v4-topbar">
            <Link href={`/avtomobiller/${car.slug}`}>
              <ArrowLeft size={13} />
              Avtomobilə qayıt
            </Link>

            <div className="reservation-v4-live">
              <i />
              SORĞU SİSTEMİ AKTİVDİR
            </div>
          </div>

          <div className="reservation-v4-heading">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="reservation-v4-kicker">
                CARBON RESERVATION / 04
              </span>

              <h1>
                Son bir neçə
                <br />
                <em>detal.</em>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease,
              }}
            >
              Avtomobil artıq seçilib. Səfər məlumatlarını
              yoxlayın, əlaqə məlumatlarınızı daxil edin və
              sorğunu Carbon komandasına göndərin.
            </motion.p>
          </div>

          <div className="reservation-v4-steps">
            {[
              ["01", "Səfər", "Tarix və seçimlər"],
              ["02", "Əlaqə", "Sizin məlumatlar"],
              ["03", "Yoxlama", "Son təsdiq"],
            ].map((item, index) => {
              const number = index + 1;
              const active = step === number;
              const done = step > number;

              return (
                <button
                  type="button"
                  key={item[0]}
                  className={`${active ? "active" : ""} ${
                    done ? "done" : ""
                  }`}
                  onClick={() => {
                    if (number < step) setStep(number);
                  }}
                >
                  <span>
                    {done ? <Check size={13} /> : item[0]}
                  </span>

                  <div>
                    <strong>{item[1]}</strong>
                    <small>{item[2]}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="reservation-v4-body">
        <div className="reservation-v4-container">
          <div className="reservation-v4-layout">
            <div className="reservation-v4-workspace">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form
                    key="trip"
                    className="reservation-v4-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease }}
                    onSubmit={nextFromTrip}
                  >
                    <div className="reservation-v4-panel-head">
                      <div>
                        <span>01 / SƏFƏR</span>
                        <h2>Səfərinizi yoxlayın.</h2>
                      </div>

                      <CalendarDays size={23} />
                    </div>

                    <div className="reservation-v4-date-grid">
                      <label>
                        <span>GÖTÜRMƏ TARİXİ</span>
                        <input
                          type="date"
                          min={isoToday()}
                          value={startDate}
                          onChange={(event) => {
                            const next = event.target.value;
                            setStartDate(next);

                            if (next >= endDate) {
                              const date = new Date(
                                `${next}T12:00:00`,
                              );
                              date.setDate(date.getDate() + 1);

                              setEndDate(
                                date
                                  .toISOString()
                                  .split("T")[0],
                              );
                            }
                          }}
                          required
                        />
                      </label>

                      <div className="reservation-v4-date-bridge">
                        <Clock3 size={14} />
                        <strong>{days}</strong>
                        <span>GÜN</span>
                      </div>

                      <label>
                        <span>QAYTARMA TARİXİ</span>
                        <input
                          type="date"
                          min={startDate}
                          value={endDate}
                          onChange={(event) =>
                            setEndDate(event.target.value)
                          }
                          required
                        />
                      </label>
                    </div>

                    <div className="reservation-v4-section-label">
                      TƏHVİL ÜSULU
                    </div>

                    <div className="reservation-v4-choice-grid">
                      <button
                        type="button"
                        className={
                          pickup === "office"
                            ? "active"
                            : ""
                        }
                        onClick={() => setPickup("office")}
                      >
                        <span>
                          <CarFront size={19} />
                        </span>

                        <div>
                          <strong>Carbon məntəqəsi</strong>
                          <small>
                            Avtomobili məntəqədən təhvil alın
                          </small>
                        </div>

                        <i>
                          {pickup === "office" && (
                            <Check size={12} />
                          )}
                        </i>
                      </button>

                      <button
                        type="button"
                        className={
                          pickup === "delivery"
                            ? "active"
                            : ""
                        }
                        onClick={() => setPickup("delivery")}
                      >
                        <span>
                          <MapPin size={19} />
                        </span>

                        <div>
                          <strong>Çatdırılma</strong>
                          <small>
                            Avtomobil seçdiyiniz ünvana gəlsin
                          </small>
                        </div>

                        <i>
                          {pickup === "delivery" && (
                            <Check size={12} />
                          )}
                        </i>
                      </button>
                    </div>

                    <AnimatePresence>
                      {pickup === "delivery" && (
                        <motion.label
                          className="reservation-v4-wide-field"
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                        >
                          <span>ÇATDIRILMA ÜNVANI</span>
                          <input
                            value={deliveryAddress}
                            onChange={(event) =>
                              setDeliveryAddress(
                                event.target.value,
                              )
                            }
                            placeholder="Məsələn: Nizami küç. 90"
                            required
                          />
                        </motion.label>
                      )}
                    </AnimatePresence>

                    <div className="reservation-v4-options-row">
                      <div>
                        <span>SÜRÜCÜ SAYI</span>

                        <div className="reservation-v4-driver">
                          <button
                            type="button"
                            onClick={() => setDrivers(1)}
                            className={
                              drivers === 1 ? "active" : ""
                            }
                          >
                            1
                          </button>

                          <button
                            type="button"
                            onClick={() => setDrivers(2)}
                            className={
                              drivers === 2 ? "active" : ""
                            }
                          >
                            2
                          </button>
                        </div>
                      </div>

                      <div>
                        <span>ƏLAVƏ XİDMƏTLƏR</span>

                        <div className="reservation-v4-extra-row">
                          {[
                            [
                              "support",
                              "Prioritet dəstək",
                            ],
                            [
                              "second-driver",
                              "Əlavə sürücü",
                            ],
                          ].map(([id, label]) => (
                            <button
                              type="button"
                              key={id}
                              onClick={() =>
                                toggleExtra(id)
                              }
                              className={
                                selectedExtras.includes(id)
                                  ? "active"
                                  : ""
                              }
                            >
                              <i>
                                {selectedExtras.includes(
                                  id,
                                ) && (
                                  <Check size={10} />
                                )}
                              </i>

                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      className="reservation-v4-next"
                      type="submit"
                    >
                      <span>
                        <small>NÖVBƏTİ ADDIM</small>
                        Əlaqə məlumatları
                      </span>

                      <i>
                        <ArrowRight size={16} />
                      </i>
                    </button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form
                    key="contact"
                    className="reservation-v4-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease }}
                    onSubmit={nextFromContact}
                  >
                    <div className="reservation-v4-panel-head">
                      <div>
                        <span>02 / ƏLAQƏ</span>
                        <h2>Sizinlə necə əlaqə saxlayaq?</h2>
                      </div>

                      <CircleUserRound size={23} />
                    </div>

                    <div className="reservation-v4-contact-grid">
                      <label>
                        <span>
                          <UserRound size={13} />
                          AD VƏ SOYAD
                        </span>

                        <input
                          type="text"
                          value={name}
                          onChange={(event) =>
                            setName(event.target.value)
                          }
                          placeholder="Adınız və soyadınız"
                          autoComplete="name"
                          required
                        />
                      </label>

                      <label>
                        <span>
                          <Phone size={13} />
                          TELEFON
                        </span>

                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) =>
                            setPhone(event.target.value)
                          }
                          placeholder="+994 50 000 00 00"
                          autoComplete="tel"
                          required
                        />
                      </label>
                    </div>

                    <label className="reservation-v4-note">
                      <span>ƏLAVƏ QEYD</span>

                      <textarea
                        value={note}
                        onChange={(event) =>
                          setNote(event.target.value)
                        }
                        placeholder="Xüsusi istəyiniz varsa burada qeyd edin..."
                        rows={5}
                      />
                    </label>

                    <div className="reservation-v4-privacy">
                      <ShieldCheck size={16} />

                      <div>
                        <strong>
                          Məlumatlar yalnız rezervasiya üçün
                          istifadə olunur.
                        </strong>

                        <span>
                          Sorğu göndərilməsi avtomatik ödəniş
                          və ya yekun rezervasiya yaratmır.
                        </span>
                      </div>
                    </div>

                    <div className="reservation-v4-actions">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft size={14} />
                        Geri
                      </button>

                      <button type="submit">
                        Yekun yoxlama
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 3 && !complete && (
                  <motion.div
                    key="review"
                    className="reservation-v4-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <div className="reservation-v4-panel-head">
                      <div>
                        <span>03 / YEKUN</span>
                        <h2>Hər şey hazırdır.</h2>
                      </div>

                      <Sparkles size={23} />
                    </div>

                    <div className="reservation-v4-review">
                      <div>
                        <span>AVTOMOBİL</span>
                        <strong>{car.title}</strong>
                        <small>{car.category}</small>
                      </div>

                      <div>
                        <span>SƏFƏR</span>
                        <strong>
                          {formatDate(startDate)} →{" "}
                          {formatDate(endDate)}
                        </strong>
                        <small>{days} gün</small>
                      </div>

                      <div>
                        <span>TƏHVİL</span>
                        <strong>
                          {pickup === "delivery"
                            ? "Çatdırılma"
                            : "Carbon məntəqəsi"}
                        </strong>
                        <small>
                          {pickup === "delivery"
                            ? deliveryAddress
                            : "Məntəqədən təhvil"}
                        </small>
                      </div>

                      <div>
                        <span>SÜRÜCÜ</span>
                        <strong>{drivers}</strong>
                        <small>{extrasText}</small>
                      </div>

                      <div>
                        <span>ƏLAQƏ</span>
                        <strong>{name}</strong>
                        <small>{phone}</small>
                      </div>
                    </div>

                    <div className="reservation-v4-final-price">
                      <div>
                        <span>GÜNLÜK TARİF</span>
                        <strong>
                          {dailyRate !== null
                            ? `${dailyRate} ₼`
                            : "Sorğu ilə"}
                        </strong>
                      </div>

                      <div>
                        <span>TƏXMİNİ MƏBLƏĞ</span>
                        <strong>
                          {total !== null
                            ? `${total} ₼`
                            : "Sorğu ilə"}
                        </strong>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      className="reservation-v4-confirm"
                      onClick={finishReservation}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span>
                        <MessageCircle size={18} />

                        <span>
                          <small>
                            SORĞUNU TAMAMLA
                          </small>
                          WhatsApp ilə göndər
                        </span>
                      </span>

                      <i>
                        <ArrowRight size={17} />
                      </i>
                    </motion.button>

                    <div className="reservation-v4-actions reservation-v4-actions-final">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                      >
                        <ArrowLeft size={14} />
                        Məlumatları dəyiş
                      </button>
                    </div>
                  </motion.div>
                )}

                {complete && (
                  <motion.div
                    key="complete"
                    className="reservation-v4-complete"
                    initial={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <motion.div
                      className="reservation-v4-complete-icon"
                      initial={{
                        scale: 0,
                        rotate: -20,
                      }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 17,
                        delay: 0.08,
                      }}
                    >
                      <CheckCircle2 size={30} />
                    </motion.div>

                    <span>CARBON REQUEST / READY</span>

                    <h2>
                      Sorğunuz
                      <br />
                      <em>hazırdır.</em>
                    </h2>

                    <p>
                      WhatsApp açılır və rezervasiya məlumatları
                      avtomatik hazırlanır. Mesajı göndərdikdən
                      sonra Carbon komandası mövcudluğu
                      təsdiqləyəcək.
                    </p>

                    <a
                      href={whatsappHref()}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={16} />
                      WhatsApp-ı yenidən aç
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.aside
              className="reservation-v4-summary"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.15,
                ease,
              }}
            >
              <div className="reservation-v4-car">
                <div className="reservation-v4-car-grid" />

                <div className="reservation-v4-car-top">
                  <span>
                    <Zap size={12} />
                    SELECTED
                  </span>

                  <span>{car.category}</span>
                </div>

                <div className="reservation-v4-car-word">
                  {car.brand}
                </div>

                <Image
                  src={car.thumbnail}
                  alt={car.title}
                  fill
                  priority
                  sizes="(max-width: 950px) 100vw, 420px"
                />

                <div className="reservation-v4-car-name">
                  <span>{car.brand}</span>
                  <strong>{car.title}</strong>
                </div>
              </div>

              <div className="reservation-v4-summary-body">
                <div className="reservation-v4-summary-title">
                  <span>CANLI XÜLASƏ</span>
                  <i />
                </div>

                <div className="reservation-v4-summary-list">
                  <div>
                    <CalendarDays size={14} />

                    <span>
                      <small>Tarix</small>
                      <strong>
                        {formatDate(startDate)} —{" "}
                        {formatDate(endDate)}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <Clock3 size={14} />

                    <span>
                      <small>Müddət</small>
                      <strong>{days} gün</strong>
                    </span>
                  </div>

                  <div>
                    <MapPin size={14} />

                    <span>
                      <small>Təhvil</small>
                      <strong>
                        {pickup === "delivery"
                          ? "Çatdırılma"
                          : "Carbon məntəqəsi"}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <Users size={14} />

                    <span>
                      <small>Sürücü</small>
                      <strong>{drivers}</strong>
                    </span>
                  </div>
                </div>

                <div className="reservation-v4-price">
                  <span>
                    <small>Günlük tarif</small>
                    <strong>
                      {dailyRate !== null
                        ? `${dailyRate} ₼`
                        : "Sorğu ilə"}
                    </strong>
                  </span>

                  <span>
                    <small>Təxmini məbləğ</small>
                    <strong>
                      {total !== null
                        ? `${total} ₼`
                        : "Sorğu ilə"}
                    </strong>
                  </span>
                </div>

                <div className="reservation-v4-trust">
                  <ShieldCheck size={14} />
                  <span>
                    Ödəniş yalnız mövcudluq və şərtlər
                    təsdiqləndikdən sonra.
                  </span>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="reservation-v4-assurance">
        <div className="reservation-v4-container">
          {[
            [
              ShieldCheck,
              "Aydın proses",
              "Göndərmə ödəniş demək deyil",
            ],
            [
              Headphones,
              "Birbaşa komanda",
              "Sorğu real əməkdaş tərəfindən yoxlanılır",
            ],
            [
              WalletCards,
              "Real tarif",
              "Qiymət seçilmiş müddətə görə hesablanır",
            ],
          ].map(([Icon, title, text], index) => {
            const FeatureIcon = Icon as typeof ShieldCheck;

            return (
              <motion.div
                key={String(title)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
              >
                <FeatureIcon size={18} />

                <span>
                  <strong>{String(title)}</strong>
                  <small>{String(text)}</small>
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
