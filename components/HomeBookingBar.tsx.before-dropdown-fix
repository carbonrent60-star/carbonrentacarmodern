"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cars } from "@/data/cars";

const ease = [0.22, 1, 0.36, 1] as const;

const months = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

const weekdays = ["B.e", "Ç.a", "Ç", "C.a", "C", "Ş", "B"];

function toLocalISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function fromISO(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function formatDate(value: string) {
  if (!value) return "Tarix seçin";

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
  }).format(fromISO(value));
}

function formatLongDate(value: string) {
  if (!value) return "Seçilməyib";

  return new Intl.DateTimeFormat("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fromISO(value));
}

function addMonths(date: Date, count: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + count,
    1,
    12,
    0,
    0
  );
}

function sameMonth(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

function sameDay(a: Date, b: Date) {
  return toLocalISO(a) === toLocalISO(b);
}

function getCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1, 12);
  const lastDay = new Date(year, monthIndex + 1, 0, 12);

  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const output: Date[] = [];

  for (let index = startOffset; index > 0; index--) {
    output.push(
      new Date(year, monthIndex, 1 - index, 12)
    );
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    output.push(new Date(year, monthIndex, day, 12));
  }

  let next = 1;

  while (output.length < 42) {
    output.push(
      new Date(year, monthIndex + 1, next, 12)
    );
    next += 1;
  }

  return output;
}

function getDailyPrice(car: (typeof cars)[number], days: number) {
  const prices = car.rentalPrices;

  if (days >= 30) return prices.days30plus;
  if (days >= 25) return prices.days25to30;
  if (days >= 16) return prices.days16to24;
  if (days >= 8) return prices.days8to15;
  if (days >= 4) return prices.days4to7;

  return prices.days1to3;
}

type CalendarMonthProps = {
  month: Date;
  startDate: string;
  endDate: string;
  minDate: string;
  onSelect: (value: string) => void;
};

function CalendarMonth({
  month,
  startDate,
  endDate,
  minDate,
  onSelect,
}: CalendarMonthProps) {
  const days = useMemo(
    () => getCalendarDays(month),
    [month]
  );

  const today = fromISO(minDate);
  const start = startDate ? fromISO(startDate) : null;
  const end = endDate ? fromISO(endDate) : null;

  return (
    <div className="hb-calendar-month">
      <div className="hb-calendar-month-title">
        <strong>{months[month.getMonth()]}</strong>
        <span>{month.getFullYear()}</span>
      </div>

      <div className="hb-calendar-weekdays">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="hb-calendar-days">
        {days.map((date) => {
          const iso = toLocalISO(date);
          const outside = !sameMonth(date, month);
          const disabled = date < today && !sameDay(date, today);

          const isStart =
            Boolean(start) && sameDay(date, start!);

          const isEnd =
            Boolean(end) && sameDay(date, end!);

          const inRange =
            Boolean(start) &&
            Boolean(end) &&
            date > start! &&
            date < end!;

          const isToday = sameDay(date, today);

          return (
            <button
              type="button"
              key={iso}
              disabled={disabled}
              className={[
                outside ? "is-outside" : "",
                disabled ? "is-disabled" : "",
                isStart ? "is-start" : "",
                isEnd ? "is-end" : "",
                inRange ? "is-range" : "",
                isToday ? "is-today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelect(iso)}
            >
              <span>{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type DatePickerProps = {
  open: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  minDate: string;
  onChange: (start: string, end: string) => void;
};

function DateRangePicker({
  open,
  onClose,
  startDate,
  endDate,
  minDate,
  onChange,
}: DatePickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
      12
    );
  });

  const [phase, setPhase] = useState<"start" | "end">("start");

  useEffect(() => {
    if (!open) return;

    const base = startDate
      ? fromISO(startDate)
      : fromISO(minDate);

    setVisibleMonth(
      new Date(
        base.getFullYear(),
        base.getMonth(),
        1,
        12
      )
    );

    setPhase("start");
  }, [open, startDate, minDate]);

  const handleSelect = (value: string) => {
    if (phase === "start") {
      const selected = fromISO(value);

      let nextEnd = endDate;

      if (
        !nextEnd ||
        fromISO(nextEnd) <= selected
      ) {
        const future = new Date(selected);
        future.setDate(future.getDate() + 3);
        nextEnd = toLocalISO(future);
      }

      onChange(value, nextEnd);
      setPhase("end");
      return;
    }

    if (!startDate) {
      onChange(value, "");
      setPhase("end");
      return;
    }

    if (value <= startDate) {
      onChange(value, "");
      setPhase("end");
      return;
    }

    onChange(startDate, value);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="hb-picker-backdrop"
            aria-label="Təqvimi bağla"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="hb-calendar-panel"
            initial={{
              opacity: 0,
              y: 14,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.985,
            }}
            transition={{
              duration: 0.32,
              ease,
            }}
          >
            <div className="hb-calendar-top">
              <div>
                <span>İCARƏ TARİXLƏRİ</span>
                <strong>
                  {phase === "start"
                    ? "Götürmə tarixini seçin"
                    : "Qaytarma tarixini seçin"}
                </strong>
              </div>

              <button
                type="button"
                className="hb-picker-close"
                onClick={onClose}
                aria-label="Bağla"
              >
                <X size={17} />
              </button>
            </div>

            <div className="hb-calendar-summary">
              <button
                type="button"
                className={
                  phase === "start" ? "is-active" : ""
                }
                onClick={() => setPhase("start")}
              >
                <CalendarDays size={16} />
                <span>
                  <small>GÖTÜRMƏ</small>
                  <strong>{formatLongDate(startDate)}</strong>
                </span>
              </button>

              <span className="hb-calendar-summary-arrow">
                <ArrowRight size={15} />
              </span>

              <button
                type="button"
                className={
                  phase === "end" ? "is-active" : ""
                }
                onClick={() => setPhase("end")}
              >
                <Clock3 size={16} />
                <span>
                  <small>QAYTARMA</small>
                  <strong>{formatLongDate(endDate)}</strong>
                </span>
              </button>
            </div>

            <div className="hb-calendar-navigation">
              <button
                type="button"
                onClick={() =>
                  setVisibleMonth((value) =>
                    addMonths(value, -1)
                  )
                }
                aria-label="Əvvəlki ay"
              >
                <ChevronLeft size={18} />
              </button>

              <div>
                {months[visibleMonth.getMonth()]}{" "}
                {visibleMonth.getFullYear()}
              </div>

              <button
                type="button"
                onClick={() =>
                  setVisibleMonth((value) =>
                    addMonths(value, 1)
                  )
                }
                aria-label="Növbəti ay"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="hb-calendar-grid">
              <CalendarMonth
                month={visibleMonth}
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                onSelect={handleSelect}
              />

              <CalendarMonth
                month={addMonths(visibleMonth, 1)}
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                onSelect={handleSelect}
              />
            </div>

            <div className="hb-calendar-bottom">
              <span>
                <i />
                Seçilmiş tarix aralığı
              </span>

              <button
                type="button"
                onClick={onClose}
              >
                Hazırdır
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type CarPickerProps = {
  open: boolean;
  selectedSlug: string;
  onClose: () => void;
  onSelect: (slug: string) => void;
};

function CarPicker({
  open,
  selectedSlug,
  onClose,
  onSelect,
}: CarPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Hamısı");

  const rentalCars = useMemo(
    () => cars.filter((car) => car.rentalVisible !== false),
    []
  );

  const categories = useMemo(
    () => [
      "Hamısı",
      ...Array.from(
        new Set(rentalCars.map((car) => car.category))
      ),
    ],
    [rentalCars]
  );

  const filteredCars = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("az");

    return rentalCars.filter((car) => {
      const matchesCategory =
        category === "Hamısı" ||
        car.category === category;

      const matchesSearch =
        !query ||
        `${car.brand} ${car.title} ${car.category}`
          .toLocaleLowerCase("az")
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [rentalCars, category, search]);

  useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className="hb-picker-backdrop"
            type="button"
            aria-label="Avtomobil seçimini bağla"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="hb-car-panel"
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.985,
            }}
            transition={{
              duration: 0.34,
              ease,
            }}
          >
            <div className="hb-car-panel-top">
              <div>
                <span>CARBON FLEET</span>
                <strong>Avtomobilinizi seçin</strong>
                <p>
                  Səfəriniz üçün uyğun modeli şəkillərlə
                  müqayisə edin.
                </p>
              </div>

              <button
                type="button"
                className="hb-picker-close"
                onClick={onClose}
                aria-label="Bağla"
              >
                <X size={17} />
              </button>
            </div>

            <div className="hb-car-toolbar">
              <label className="hb-car-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Mercedes, Hyundai, SUV..."
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Axtarışı sil"
                  >
                    <X size={13} />
                  </button>
                )}
              </label>

              <div className="hb-car-categories">
                {categories.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      category === item ? "is-active" : ""
                    }
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="hb-car-results-head">
              <span>
                {filteredCars.length} avtomobil
              </span>

              <span>
                Şəkil · sinif · günlük qiymət
              </span>
            </div>

            <div className="hb-car-grid">
              {filteredCars.map((car) => {
                const selected = selectedSlug === car.slug;
                const price = getDailyPrice(car, 3);

                return (
                  <motion.button
                    type="button"
                    key={car.slug}
                    className={`hb-car-option ${
                      selected ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      onSelect(car.slug);
                      onClose();
                    }}
                    whileHover={{ y: -3 }}
                    transition={{
                      duration: 0.25,
                      ease,
                    }}
                  >
                    <div className="hb-car-option-image">
                      <img
                        src={car.thumbnail}
                        alt={car.title}
                        loading="lazy"
                      />

                      <span className="hb-car-option-category">
                        {car.category}
                      </span>

                      {selected && (
                        <span className="hb-car-option-check">
                          <Check size={14} strokeWidth={2.2} />
                        </span>
                      )}
                    </div>

                    <div className="hb-car-option-copy">
                      <div>
                        <small>{car.brand}</small>
                        <strong>{car.title}</strong>
                      </div>

                      <div className="hb-car-option-price">
                        <small>günlük</small>
                        <strong>
                          {price ? `${price} ₼` : "Sorğu"}
                        </strong>
                      </div>
                    </div>

                    <div className="hb-car-option-meta">
                      <span>
                        <Users size={12} />
                        {car.seats ?? "—"}
                      </span>

                      <span>{car.transmission}</span>

                      <span>{car.fuel}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {filteredCars.length === 0 && (
              <div className="hb-car-empty">
                <CarFront size={25} strokeWidth={1.4} />
                <strong>Uyğun avtomobil tapılmadı</strong>
                <span>
                  Axtarışı və ya kateqoriyanı dəyişin.
                </span>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function HomeBookingBar() {
  const [carSlug, setCarSlug] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickup, setPickup] =
    useState<"office" | "delivery">("office");

  const [ready, setReady] = useState(false);
  const [carPickerOpen, setCarPickerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const returnDate = new Date(today);
    returnDate.setDate(returnDate.getDate() + 4);

    setStartDate(toLocalISO(tomorrow));
    setEndDate(toLocalISO(returnDate));

    const timer = window.setTimeout(() => {
      setReady(true);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const locked = carPickerOpen || calendarOpen;

    if (!locked) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCarPickerOpen(false);
        setCalendarOpen(false);
      }
    };

    window.addEventListener("keydown", close);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [carPickerOpen, calendarOpen]);

  const selectedCar = useMemo(
    () => cars.find((car) => car.slug === carSlug),
    [carSlug]
  );

  const duration = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = fromISO(startDate);
    const end = fromISO(endDate);

    return Math.max(
      0,
      Math.round(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
  }, [startDate, endDate]);

  const minStart = useMemo(() => {
    return toLocalISO(new Date());
  }, []);

  const dailyPrice = useMemo(() => {
    if (!selectedCar || duration < 1) return null;

    return getDailyPrice(selectedCar, duration);
  }, [selectedCar, duration]);

  const estimate =
    dailyPrice && duration
      ? dailyPrice * duration
      : null;

  const reservationHref = useMemo(() => {
    if (!carSlug) return "#cars";
    if (!startDate || !endDate || duration < 1) {
      return "#cars";
    }

    const params = new URLSearchParams({
      car: carSlug,
      start: startDate,
      end: endDate,
      pickup,
      drivers: "1",
    });

    return `/rezervasiya?${params.toString()}`;
  }, [
    carSlug,
    startDate,
    endDate,
    pickup,
    duration,
  ]);

  const valid =
    Boolean(carSlug) &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    duration > 0;

  return (
    <section
      ref={sectionRef}
      className="home-booking hb-v2"
      aria-label="Sürətli rezervasiya"
    >
      <motion.div
        className="home-booking-shell"
        initial={{
          opacity: 0,
          y: 42,
        }}
        animate={
          ready
            ? {
                opacity: 1,
                y: 0,
              }
            : {}
        }
        transition={{
          duration: 0.9,
          ease,
        }}
      >
        <div className="home-booking-topline">
          <div className="home-booking-topline-left">
            <span className="home-booking-live">
              <i />
              REZERVASİYA
            </span>

            <span className="home-booking-separator" />

            <span className="home-booking-status">
              <Check size={12} strokeWidth={2} />
              Sistem aktivdir
            </span>
          </div>

          <div className="home-booking-index">
            <span>CARBON</span>
            <strong>01</strong>
          </div>
        </div>

        <div className="home-booking-heading">
          <div>
            <span className="home-booking-eyebrow">
              <Sparkles size={13} strokeWidth={1.65} />
              SÜRƏTLİ SEÇİM
            </span>

            <h2>
              Səfərinizi
              <span> indi planlayın.</span>
            </h2>
          </div>

          <p>
            Avtomobili şəkillərlə seçin, tarix aralığını
            müəyyən edin və rezervasiyanı saniyələr içində
            başladın.
          </p>
        </div>

        <div className="hb-v2-command">
          <button
            type="button"
            className={`hb-v2-field hb-v2-car ${
              selectedCar ? "has-value" : ""
            }`}
            onClick={() => {
              setCalendarOpen(false);
              setCarPickerOpen(true);
            }}
          >
            <span className="hb-v2-icon">
              <CarFront size={18} strokeWidth={1.55} />
            </span>

            <span className="hb-v2-field-copy">
              <small>AVTOMOBİL</small>

              {selectedCar ? (
                <span className="hb-v2-selected-car">
                  <span className="hb-v2-selected-image">
                    <img
                      src={selectedCar.thumbnail}
                      alt=""
                    />
                  </span>

                  <span>
                    <strong>{selectedCar.title}</strong>
                    <em>{selectedCar.category}</em>
                  </span>
                </span>
              ) : (
                <strong>Avtomobil seçin</strong>
              )}
            </span>

            <ChevronDown
              className="hb-v2-chevron"
              size={16}
            />
          </button>

          <button
            type="button"
            className="hb-v2-field hb-v2-date"
            onClick={() => {
              setCarPickerOpen(false);
              setCalendarOpen(true);
            }}
          >
            <span className="hb-v2-icon">
              <CalendarDays size={18} strokeWidth={1.55} />
            </span>

            <span className="hb-v2-field-copy">
              <small>GÖTÜRMƏ</small>
              <strong>{formatDate(startDate)}</strong>
              <em>{formatLongDate(startDate)}</em>
            </span>
          </button>

          <button
            type="button"
            className="hb-v2-field hb-v2-date"
            onClick={() => {
              setCarPickerOpen(false);
              setCalendarOpen(true);
            }}
          >
            <span className="hb-v2-icon">
              <Clock3 size={18} strokeWidth={1.55} />
            </span>

            <span className="hb-v2-field-copy">
              <small>QAYTARMA</small>
              <strong>{formatDate(endDate)}</strong>
              <em>{formatLongDate(endDate)}</em>
            </span>
          </button>

          <label className="hb-v2-field hb-v2-pickup">
            <span className="hb-v2-icon">
              <MapPin size={18} strokeWidth={1.55} />
            </span>

            <span className="hb-v2-field-copy">
              <small>TƏHVİL</small>

              <span className="hb-v2-native-select">
                <select
                  value={pickup}
                  onChange={(event) =>
                    setPickup(
                      event.target.value as
                        | "office"
                        | "delivery"
                    )
                  }
                  aria-label="Təhvil üsulu"
                >
                  <option value="office">
                    Carbon ofisi
                  </option>

                  <option value="delivery">
                    Ünvanıma çatdırılma
                  </option>
                </select>

                <ChevronDown size={15} />
              </span>
            </span>
          </label>

          <motion.a
            className={`home-booking-submit hb-v2-submit ${
              valid ? "is-ready" : ""
            }`}
            href={reservationHref}
            onClick={(event) => {
              if (!valid) {
                event.preventDefault();

                if (!carSlug) {
                  setCarPickerOpen(true);
                } else {
                  setCalendarOpen(true);
                }
              }
            }}
            whileHover={
              valid
                ? {
                    y: -2,
                  }
                : {}
            }
            whileTap={
              valid
                ? {
                    scale: 0.985,
                  }
                : {}
            }
          >
            <span>
              <small>
                {valid
                  ? estimate
                    ? `${duration} GÜN · ~${estimate} ₼`
                    : `${duration} GÜN`
                  : "DAVAM ET"}
              </small>

              <strong>
                {valid
                  ? "Rezervasiya et"
                  : "Seçim edin"}
              </strong>
            </span>

            <i>
              <ArrowRight
                size={18}
                strokeWidth={1.7}
              />
            </i>
          </motion.a>
        </div>

        <div className="home-booking-footer hb-v2-footer">
          <div>
            <ShieldCheck size={14} strokeWidth={1.55} />

            <span>
              Tam kasko
              <b>·</b>
              Şəffaf qiymət
              <b>·</b>
              24/7 dəstək
            </span>
          </div>

          <span className="home-booking-selection">
            {selectedCar ? (
              <>
                <i />
                {selectedCar.title}
                {dailyPrice ? (
                  <>
                    <b>·</b>
                    {dailyPrice} ₼ / gün
                  </>
                ) : null}
              </>
            ) : (
              <>
                <i />
                Avtomobil gözlənilir
              </>
            )}
          </span>
        </div>
      </motion.div>

      <CarPicker
        open={carPickerOpen}
        selectedSlug={carSlug}
        onClose={() => setCarPickerOpen(false)}
        onSelect={setCarSlug}
      />

      <DateRangePicker
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        startDate={startDate}
        endDate={endDate}
        minDate={minStart}
        onChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />
    </section>
  );
}
