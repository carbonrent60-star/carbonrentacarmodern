"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Luggage,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Phone,
  Plane,
  Plus,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import CarbonNavbar from "@/components/CarbonNavbar";
import type { Car } from "@/data/cars";

const ease = [0.22, 1, 0.36, 1] as const;

type RouteKey = keyof Car["transferPrices"];
type SelectedRoute = RouteKey | "custom";

const routeOptions: Array<{ key: RouteKey; from: string; to: string; hint: string }> = [
  { key: "baku", from: "Hava limanı", to: "Bakı", hint: "Terminal qarşılanma" },
  { key: "seaBreeze", from: "Sea Breeze", to: "Hava limanı", hint: "Resort transferi" },
  { key: "qabala", from: "Qəbələ", to: "Bakı", hint: "Region səfəri" },
  { key: "ismayilli", from: "İsmayıllı", to: "Bakı", hint: "Dağ marşrutu" },
  { key: "quba", from: "Quba", to: "Bakı", hint: "Şimal istiqaməti" },
  { key: "shamaxi", from: "Şamaxı", to: "Bakı", hint: "Premium region" },
  { key: "shaki", from: "Şəki", to: "Bakı", hint: "Uzun məsafə" },
  { key: "shusha", from: "Şuşa", to: "Bakı", hint: "Xüsusi marşrut" },
  { key: "lankaran", from: "Lənkəran", to: "Bakı", hint: "Cənub istiqaməti" },
];

const timeSlots = ["08:00", "10:00", "12:00", "15:00", "18:00", "21:00"];

type Initial = {
  route: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
};

function isoTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function formatDate(value: string) {
  if (!value) return "Seçilməyib";

  const [year, month, day] = value.split("-").map(Number);
  const months = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avq", "sen", "okt", "noy", "dek"];
  const monthIndex = Math.max(0, Math.min(11, (month || 1) - 1));

  return `${String(day || 1).padStart(2, "0")} ${months[monthIndex]} ${year || ""}`.trim();
}

function routeLabel(route: SelectedRoute) {
  if (route === "custom") return ["Fərdi marşrut", "Komanda hesablasın"] as const;

  const item = routeOptions.find((option) => option.key === route);
  return [item?.from ?? "Marşrut", item?.to ?? "Seçilməyib"] as const;
}

function safeRoute(input: string, car: Car | null): SelectedRoute {
  if (input === "custom") return "custom";

  const route = routeOptions.find(
    (option) => option.key === input && typeof car?.transferPrices[option.key] === "number",
  );

  return route?.key ?? routeOptions.find((option) => typeof car?.transferPrices[option.key] === "number")?.key ?? "custom";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function TransferCheckout({
  car,
  initial,
}: {
  car: Car | null;
  initial: Initial;
}) {
  const initialSelectedRoute = safeRoute(initial.route, car);
  const [initialFrom, initialTo] = routeLabel(initialSelectedRoute);
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [route, setRoute] = useState<SelectedRoute>(initialSelectedRoute);
  const [pointFrom, setPointFrom] = useState(initial.pickup || initialFrom);
  const [pointTo, setPointTo] = useState(initial.dropoff || initialTo);
  const [minimumDate] = useState(() => isoTomorrow());
  const [date, setDate] = useState(() => initial.date || minimumDate);
  const [time, setTime] = useState(() => initial.time || "12:00");
  const [pickup, setPickup] = useState(initial.pickup || initialFrom);
  const [dropoff, setDropoff] = useState(initial.dropoff || initialTo);
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(1);
  const [flight, setFlight] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const availableRoutes = useMemo(
    () =>
      routeOptions.filter(
        (option) => typeof car?.transferPrices[option.key] === "number",
      ),
    [car],
  );

  const selectedPrice =
    car && route !== "custom" ? car.transferPrices[route] ?? null : null;
  const [from, to] = routeLabel(route);
  const displayFrom = pickup || pointFrom || from;
  const displayTo = dropoff || pointTo || to;
  const priceText = selectedPrice !== null ? `${selectedPrice} ₼` : "Sorğu ilə";
  const progress = step === 1 ? "33.333%" : step === 2 ? "66.666%" : "100%";
  const passengerLimit = car?.seats ?? 8;
  const pointOptions = useMemo(
    () =>
      Array.from(
        new Set(availableRoutes.flatMap((option) => [option.from, option.to])),
      ),
    [availableRoutes],
  );

  function syncRoute(nextFrom: string, nextTo: string) {
    const matchedRoute = availableRoutes.find(
      (option) =>
        (option.from === nextFrom && option.to === nextTo) ||
        (option.from === nextTo && option.to === nextFrom),
    );

    setRoute(matchedRoute?.key ?? "custom");
    setPickup(nextFrom);
    setDropoff(nextTo);
  }

  function selectFrom(nextFrom: string) {
    setPointFrom(nextFrom);
    syncRoute(nextFrom, pointTo);
  }

  function selectTo(nextTo: string) {
    setPointTo(nextTo);
    syncRoute(pointFrom, nextTo);
  }

  function selectCustomRoute() {
    setRoute("custom");
    setPointFrom("Fərdi başlanğıc");
    setPointTo("Fərdi təyinat");
    setPickup("");
    setDropoff("");
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
      "Salam Carbon",
      "",
      "Yeni transfer rezervasiya sorğusu:",
      "",
      `Avtomobil: ${car.title}`,
      `Kateqoriya: ${car.category}`,
      `Marşrut: ${displayFrom} -> ${displayTo}`,
      `Götürülmə nöqtəsi: ${displayFrom}`,
      `Təyinat: ${displayTo}`,
      `Tarix: ${formatDate(date)}`,
      `Saat: ${time}`,
      `Sərnişin: ${passengers}`,
      `Baqaj: ${luggage}`,
      ...(flight.trim() ? [`Uçuş nömrəsi: ${flight.trim()}`] : []),
      `Qiymət: ${selectedPrice !== null ? `${selectedPrice} ₼` : "Sorğu ilə"}`,
      "",
      `Ad: ${name}`,
      `Telefon: ${phone}`,
      ...(note.trim() ? [`Qeyd: ${note.trim()}`] : []),
      "",
      "Mövcudluğu təsdiqləməyinizi xahiş edirəm.",
    ];

    return `https://wa.me/994554840006?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  function finish() {
    setComplete(true);
    window.setTimeout(() => {
      window.open(whatsappHref(), "_blank", "noopener,noreferrer");
    }, 650);
  }

  if (!car || !car.transferAvailable) {
    return (
      <main className="transfer-checkout transfer-checkout-empty">
        <CarbonNavbar light active="transfer" />
        <section>
          <span>CARBON TRANSFER</span>
          <h1>Transfer avtomobili tapılmadı.</h1>
          <p>Link natamamdır və ya seçilmiş avtomobil transfer üçün aktiv deyil.</p>
          <Link href="/avtomobiller">
            <ArrowLeft size={15} />
            Transfer avtomobillərinə qayıt
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="transfer-checkout">
      <CarbonNavbar light active="transfer" />

      <div className="transfer-checkout-progress">
        <motion.span animate={{ width: progress }} transition={{ duration: 0.65, ease }} />
      </div>

      <section className="transfer-checkout-hero">
        <div className="transfer-checkout-grid" />
        <div className="transfer-checkout-container">
          <div className="transfer-checkout-topbar">
            <Link href={`/transfer/${car.slug}`}>
              <ArrowLeft size={13} />
              Transfer avtomobilinə qayıt
            </Link>
            <span>
              <Plane size={14} />
              Sürücülü transfer
            </span>
          </div>

          <div className="transfer-checkout-heading">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <span>CARBON TRANSFER CHECKOUT</span>
              <h1>
                Marşrutu seçin.
                <em> Qalanını biz idarə edək.</em>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease }}
            >
              Götürülmə nöqtəsi, vaxt, sərnişin və baqaj məlumatlarını seçin.
              Sorğu WhatsApp-a hazır mesaj kimi ötürülür.
            </motion.p>
          </div>

          <div className="transfer-checkout-steps">
            {[
              ["01", "Marşrut", "Lokasiya və vaxt"],
              ["02", "Əlaqə", "Müştəri məlumatı"],
              ["03", "Yekun", "WhatsApp sorğusu"],
            ].map((item, index) => {
              const number = index + 1;
              const active = step === number;
              const done = step > number;

              return (
                <button
                  type="button"
                  key={item[0]}
                  className={`${active ? "active" : ""} ${done ? "done" : ""}`}
                  onClick={() => {
                    if (number < step) setStep(number);
                  }}
                >
                  <span>{done ? <Check size={13} /> : item[0]}</span>
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

      <section className="transfer-checkout-body">
        <div className="transfer-checkout-container transfer-checkout-layout">
          <div className="transfer-checkout-workspace">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="trip"
                  className="transfer-checkout-panel"
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.35, ease }}
                  onSubmit={nextFromTrip}
                >
                  <div className="transfer-checkout-panel-head">
                    <div>
                      <span>01 / MARŞRUT</span>
                      <h2>Haradan hara gedirsiniz?</h2>
                    </div>
                    <Navigation size={24} />
                  </div>

                  <div className="transfer-point-builder">
                    <div className="transfer-point-column">
                      <span>01 / HARADAN</span>
                      <div>
                        {pointOptions.map((point) => (
                          <button
                            type="button"
                            key={`from-${point}`}
                            className={pointFrom === point ? "active" : ""}
                            onClick={() => selectFrom(point)}
                          >
                            {point}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="transfer-route-stage" aria-label="Seçilmiş transfer marşrutu">
                      <motion.div
                        className="transfer-route-node is-from"
                        key={`from-${pointFrom}`}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.36, ease }}
                      >
                        <MapPin size={18} />
                        <small>Başlanğıc</small>
                        <strong>{pointFrom}</strong>
                      </motion.div>

                      <div className="transfer-route-rail">
                        <motion.span
                          key={`${pointFrom}-${pointTo}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.7, ease }}
                        />
                        <motion.i
                          key={`marker-${pointFrom}-${pointTo}`}
                          initial={{ left: "0%" }}
                          animate={{ left: "100%" }}
                          transition={{ duration: 0.95, ease, repeat: Infinity, repeatDelay: 1.2 }}
                        >
                          <Plane size={15} />
                        </motion.i>
                      </div>

                      <motion.div
                        className="transfer-route-node is-to"
                        key={`to-${pointTo}`}
                        initial={{ opacity: 0, y: -12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.36, ease }}
                      >
                        <Navigation size={18} />
                        <small>Təyinat</small>
                        <strong>{pointTo}</strong>
                      </motion.div>

                      <div className="transfer-route-stage-price">
                        <span>{route === "custom" ? "Fərdi marşrut" : "Seçilmiş marşrut"}</span>
                        <strong>{selectedPrice !== null ? `${selectedPrice} ₼` : "Sorğu ilə"}</strong>
                      </div>
                    </div>

                    <div className="transfer-point-column">
                      <span>02 / HARA</span>
                      <div>
                        {pointOptions.map((point) => (
                          <button
                            type="button"
                            key={`to-${point}`}
                            className={pointTo === point ? "active" : ""}
                            onClick={() => selectTo(point)}
                          >
                            {point}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={route === "custom" ? "active" : ""}
                          onClick={selectCustomRoute}
                        >
                          Fərdi marşrut
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="transfer-location-grid">
                    <label>
                      <span><MapPin size={13} /> Götürülmə nöqtəsi</span>
                      <input
                        value={pickup}
                        onChange={(event) => setPickup(event.target.value)}
                        placeholder={displayFrom}
                        required
                      />
                    </label>
                    <label>
                      <span><Navigation size={13} /> Təyinat</span>
                      <input
                        value={dropoff}
                        onChange={(event) => setDropoff(event.target.value)}
                        placeholder={displayTo}
                        required
                      />
                    </label>
                  </div>

                  <div className="transfer-datetime-grid">
                    <label>
                      <span><CalendarDays size={13} /> Tarix</span>
                      <input
                        type="date"
                        value={date}
                        min={minimumDate}
                        onChange={(event) => setDate(event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span><Clock3 size={13} /> Saat</span>
                      <input
                        type="time"
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                        required
                      />
                    </label>
                  </div>

                  <div className="transfer-time-chips">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={time === slot ? "active" : ""}
                        onClick={() => setTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <div className="transfer-counter-grid">
                    <div>
                      <span><Users size={13} /> Sərnişin</span>
                      <div>
                        <button type="button" onClick={() => setPassengers((value) => clamp(value - 1, 1, passengerLimit))}>
                          <Minus size={13} />
                        </button>
                        <strong>{passengers}</strong>
                        <button type="button" onClick={() => setPassengers((value) => clamp(value + 1, 1, passengerLimit))}>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span><Luggage size={13} /> Baqaj</span>
                      <div>
                        <button type="button" onClick={() => setLuggage((value) => clamp(value - 1, 0, 8))}>
                          <Minus size={13} />
                        </button>
                        <strong>{luggage}</strong>
                        <button type="button" onClick={() => setLuggage((value) => clamp(value + 1, 0, 8))}>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="transfer-flight-field">
                    <span><Plane size={13} /> Uçuş nömrəsi və ya qarşılanma qeydi</span>
                    <input
                      value={flight}
                      onChange={(event) => setFlight(event.target.value)}
                      placeholder="Məsələn: J2 023, terminal 1"
                    />
                  </label>

                  <button className="transfer-checkout-next" type="submit">
                    <span>
                      <small>NÖVBƏTİ ADDIM</small>
                      Əlaqə məlumatları
                    </span>
                    <i><ArrowRight size={16} /></i>
                  </button>
                </motion.form>
              ) : null}

              {step === 2 ? (
                <motion.form
                  key="contact"
                  className="transfer-checkout-panel"
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.35, ease }}
                  onSubmit={nextFromContact}
                >
                  <div className="transfer-checkout-panel-head">
                    <div>
                      <span>02 / ƏLAQƏ</span>
                      <h2>Sizinlə necə əlaqə saxlayaq?</h2>
                    </div>
                    <UserRound size={24} />
                  </div>

                  <div className="transfer-contact-grid">
                    <label>
                      <span><UserRound size={13} /> Ad və soyad</span>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Adınız və soyadınız"
                        autoComplete="name"
                        required
                      />
                    </label>
                    <label>
                      <span><Phone size={13} /> Telefon</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="+994 50 000 00 00"
                        autoComplete="tel"
                        required
                      />
                    </label>
                  </div>

                  <label className="transfer-note-field">
                    <span>Əlavə qeyd</span>
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Uşaq oturacağı, əlavə dayanacaq, qarşılanma lövhəsi və s."
                      rows={5}
                    />
                  </label>

                  <div className="transfer-checkout-privacy">
                    <ShieldCheck size={16} />
                    <div>
                      <strong>Bu yalnız transfer sorğusudur.</strong>
                      <span>Ödəniş və yekun təsdiq Carbon komandası məlumatları yoxladıqdan sonra edilir.</span>
                    </div>
                  </div>

                  <div className="transfer-checkout-actions">
                    <button type="button" onClick={() => setStep(1)}>
                      <ArrowLeft size={14} />
                      Geri
                    </button>
                    <button type="submit">
                      Yekun yoxlama
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.form>
              ) : null}

              {step === 3 && !complete ? (
                <motion.div
                  key="review"
                  className="transfer-checkout-panel"
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="transfer-checkout-panel-head">
                    <div>
                      <span>03 / YEKUN</span>
                      <h2>Transfer sorğusu hazırdır.</h2>
                    </div>
                    <MessageCircle size={24} />
                  </div>

                  <div className="transfer-review-grid">
                    <div>
                      <span>Avtomobil</span>
                      <strong>{car.title}</strong>
                      <small>{car.category}</small>
                    </div>
                    <div>
                      <span>Marşrut</span>
                      <strong>{displayFrom} {"->"} {displayTo}</strong>
                      <small>{route === "custom" ? "Qiymət sorğu ilə hesablanır" : `${selectedPrice} ₼`}</small>
                    </div>
                    <div>
                      <span>Vaxt</span>
                      <strong>{formatDate(date)}</strong>
                      <small>{time}</small>
                    </div>
                    <div>
                      <span>Sərnişin və baqaj</span>
                      <strong>{passengers} nəfər · {luggage} baqaj</strong>
                      <small>{flight || "Uçuş qeydi yoxdur"}</small>
                    </div>
                    <div>
                      <span>Əlaqə</span>
                      <strong>{name}</strong>
                      <small>{phone}</small>
                    </div>
                  </div>

                  <div className="transfer-final-price">
                    <span>Transfer qiyməti</span>
                    <strong>{selectedPrice !== null ? `${selectedPrice} ₼` : "Sorğu ilə"}</strong>
                  </div>

                  <motion.button
                    type="button"
                    className="transfer-confirm"
                    onClick={finish}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span>
                      <MessageCircle size={18} />
                      <span>
                        <small>SORĞUNU TAMAMLA</small>
                        WhatsApp ilə göndər
                      </span>
                    </span>
                    <i><ArrowRight size={17} /></i>
                  </motion.button>

                  <div className="transfer-checkout-actions">
                    <button type="button" onClick={() => setStep(2)}>
                      <ArrowLeft size={14} />
                      Məlumatları dəyiş
                    </button>
                  </div>
                </motion.div>
              ) : null}

              {complete ? (
                <motion.div
                  key="complete"
                  className="transfer-complete"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <span><CheckCircle2 size={30} /></span>
                  <p>CARBON TRANSFER / READY</p>
                  <h2>Sorğunuz hazırdır.</h2>
                  <small>WhatsApp açılır. Mesajı göndərdikdən sonra Carbon komandası transferi təsdiqləyəcək.</small>
                  <a href={whatsappHref()} target="_blank" rel="noreferrer">
                    <MessageCircle size={16} />
                    WhatsApp-ı yenidən aç
                  </a>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <motion.aside
            className="transfer-checkout-summary"
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
          >
            <div className="transfer-summary-car">
              <div className="transfer-summary-grid" />
              <motion.div
                className="transfer-summary-light"
                animate={{ x: ["-12%", "8%", "-12%"], opacity: [0.28, 0.55, 0.28] }}
                transition={{ duration: 7, repeat: Infinity, ease }}
              />
              <div className="transfer-summary-top">
                <span><Plane size={12} /> TRANSFER</span>
                <span>{car.category}</span>
              </div>
              <motion.div
                className="transfer-summary-vehicle"
                key={car.slug}
                initial={{ opacity: 0, x: 22, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.72, ease }}
              >
                <Image
                  src={car.thumbnail}
                  alt={car.title}
                  fill
                  priority
                  sizes="(max-width: 980px) 100vw, 420px"
                />
              </motion.div>
              <motion.strong
                key={car.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
              >
                {car.title}
              </motion.strong>
            </div>

            <div className="transfer-summary-body">
              <div className="transfer-summary-route">
                <motion.span
                  key={`summary-from-${displayFrom}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease }}
                >
                  {displayFrom}
                </motion.span>
                <i><MapPin size={13} /></i>
                <motion.span
                  key={`summary-to-${displayTo}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease }}
                >
                  {displayTo}
                </motion.span>
              </div>

              <div className="transfer-summary-list">
                <div>
                  <CalendarDays size={14} />
                  <span>
                    <small>Tarix və saat</small>
                    <strong>{formatDate(date)} · {time}</strong>
                  </span>
                </div>
                <div>
                  <Users size={14} />
                  <span>
                    <small>Sərnişin</small>
                    <strong>{passengers} nəfər</strong>
                  </span>
                </div>
                <div>
                  <Luggage size={14} />
                  <span>
                    <small>Baqaj</small>
                    <strong>{luggage}</strong>
                  </span>
                </div>
              </div>

              <div className="transfer-summary-price">
                <span>Yekun transfer</span>
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={`${route}-${selectedPrice ?? "custom"}`}
                    initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                    transition={{ duration: 0.32, ease }}
                  >
                    {priceText.split("").map((character, index) => (
                      <motion.span
                        key={`${priceText}-${character}-${index}`}
                        initial={{ opacity: 0, y: 24, rotateX: -75 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.42, delay: index * 0.045, ease }}
                      >
                        {character === " " ? "\u00a0" : character}
                      </motion.span>
                    ))}
                  </motion.strong>
                </AnimatePresence>
                <motion.i
                  key={`price-line-${route}-${selectedPrice ?? "custom"}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.62, ease }}
                />
              </div>

              <div className="transfer-summary-trust">
                <WalletCards size={14} />
                <span>Ödəniş məlumatları komanda tərəfindən təsdiq zamanı dəqiqləşdirilir.</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}
