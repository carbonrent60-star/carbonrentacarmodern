"use client";

import {
  translateCarValue,
  useCarbonCopy,
} from "@/lib/carbon-locale";
import { fetchPublicCars } from "@/lib/supabase/cars";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
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
import { cars, type Car } from "@/data/cars";

const ease = [0.22, 1, 0.36, 1] as const;

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

function formatDate(
  value: string,
  localeCode: string,
  fallback: string
) {
  if (!value) return fallback;

  return new Intl.DateTimeFormat(localeCode, {
    day: "2-digit",
    month: "short",
  }).format(fromISO(value));
}

function getDefaultBookingDates() {
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const returnDate = new Date(today);
  returnDate.setDate(returnDate.getDate() + 4);

  return {
    start: toLocalISO(tomorrow),
    end: toLocalISO(returnDate),
  };
}

function formatLongDate(
  value: string,
  localeCode: string,
  fallback: string
) {
  if (!value) return fallback;

  return new Intl.DateTimeFormat(localeCode, {
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
  months: readonly string[];
  weekdays: readonly string[];
  onSelect: (value: string) => void;
};

function CalendarMonth({
  month,
  startDate,
  endDate,
  minDate,
  months,
  weekdays,
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
  const { copy, localeCode } = useCarbonCopy();
  const [visibleMonth, setVisibleMonth] = useState(() => {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
      12
    );
  });

  const [phase, setPhase] = useState<"start" | "end">("start");
  const [draftStart, setDraftStart] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
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
    setDraftStart(null);
  }, [open, startDate, minDate]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSelect = (value: string) => {
    /*
     * FIRST CLICK:
     * Store pickup locally only.
     * Do NOT invent a return date.
     * Do NOT modify the committed range yet.
     */
    if (phase === "start") {
      setDraftStart(value);
      setPhase("end");
      return;
    }

    /*
     * SECOND CLICK:
     * Use the locally selected pickup when available.
     */
    const activeStart = draftStart ?? startDate;

    if (!activeStart) {
      setDraftStart(value);
      setPhase("end");
      return;
    }

    /*
     * Clicking the pickup day or an earlier date simply
     * moves the pickup. We continue waiting for return.
     */
    if (value <= activeStart) {
      setDraftStart(value);
      setPhase("end");
      return;
    }

    /*
     * Valid second click:
     * commit the complete range and close.
     */
    onChange(activeStart, value);
    setDraftStart(null);
    setPhase("start");
    onClose();
  };

  const calendarStartDate = draftStart ?? startDate;
  const calendarEndDate = draftStart !== null ? "" : endDate;

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="hb-calendar-layer">
          <motion.button
            type="button"
            className="hb-picker-backdrop"
            aria-label={copy.booking.close}
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
                <span>{copy.bookingBar.rentalDates}</span>
                <strong>
                  {phase === "start"
                    ? copy.bookingBar.choosePickup
                    : copy.bookingBar.chooseReturn}
                </strong>
              </div>

              <button
                type="button"
                className="hb-picker-close"
                onClick={onClose}
                aria-label={copy.booking.close}
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
                  <small>{copy.booking.pickup}</small>
                  <strong>
                    {formatLongDate(
                      calendarStartDate,
                      localeCode,
                      copy.booking.chooseDate
                    )}
                  </strong>
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
                  <small>{copy.booking.return}</small>
                  <strong>
                    {draftStart !== null
                      ? copy.booking.chooseDate
                      : formatLongDate(
                          endDate,
                          localeCode,
                          copy.booking.chooseDate
                        )}
                  </strong>
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
                aria-label={copy.booking.from}
              >
                <ChevronLeft size={18} />
              </button>

              <div>
                {copy.booking.months[visibleMonth.getMonth()]}{" "}
                {visibleMonth.getFullYear()}
              </div>

              <button
                type="button"
                onClick={() =>
                  setVisibleMonth((value) =>
                    addMonths(value, 1)
                  )
                }
                aria-label={copy.booking.to}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="hb-calendar-grid">
              <CalendarMonth
                month={visibleMonth}
                startDate={calendarStartDate}
                endDate={calendarEndDate}
                minDate={minDate}
                months={copy.booking.months}
                weekdays={copy.booking.dayNames}
                onSelect={handleSelect}
              />

              <CalendarMonth
                month={addMonths(visibleMonth, 1)}
                startDate={calendarStartDate}
                endDate={calendarEndDate}
                minDate={minDate}
                months={copy.booking.months}
                weekdays={copy.booking.dayNames}
                onSelect={handleSelect}
              />
            </div>

            <div className="hb-calendar-bottom">
              <span>
                <i />
                {copy.bookingBar.selectedRange}
              </span>

              <button
                type="button"
                onClick={onClose}
              >
                {copy.booking.confirm}
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

type CarPickerProps = {
  open: boolean;
  selectedSlug: string;
  availableCars: Car[];
  onClose: () => void;
  onSelect: (slug: string) => void;
  anchorRef: {
    current: HTMLButtonElement | null;
  };
};

function CarPicker({
  open,
  selectedSlug,
  availableCars,
  onClose,
  onSelect,
  anchorRef,
}: CarPickerProps) {
  const { copy, locale } = useCarbonCopy();
  const panelRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Hamısı");

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 470,
    maxHeight: 490,
  });

  const rentalCars = useMemo(
    () => availableCars.filter((car) => car.rentalVisible !== false),
    [availableCars]
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
    const query = search
      .trim()
      .toLocaleLowerCase("az");

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

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;

    setSearch("");

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const mobile = viewportWidth <= 620;

      // Carbon V4:
      // dropdown must be exactly the same width
      // as the Automobil field that opened it.
      const desiredWidth = mobile
        ? Math.min(rect.width, viewportWidth - 28)
        : rect.width;

      const edge = mobile ? 14 : 18;

      let left = mobile
        ? 14
        : rect.left;

      if (left + desiredWidth > viewportWidth - edge) {
        left = viewportWidth - desiredWidth - edge;
      }

      left = Math.max(edge, left);

      const gap = mobile ? 8 : 10;

      const spaceBelow =
        viewportHeight - rect.bottom - gap - edge;

      const spaceAbove =
        rect.top - gap - edge;

      const preferredHeight = mobile ? 455 : 500;

      const openAbove =
        spaceBelow < 300 &&
        spaceAbove > spaceBelow;

      const maxHeight = Math.max(
        260,
        Math.min(
          preferredHeight,
          openAbove ? spaceAbove : spaceBelow
        )
      );

      let top;

      if (openAbove) {
        top = Math.max(
          edge,
          rect.top - gap - maxHeight
        );
      } else {
        top = rect.bottom + gap;
      }

      setPosition({
        top,
        left,
        width: desiredWidth,
        maxHeight,
      });
    };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );
    };
  }, [open, anchorRef]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!open) return;

    const handleOutside = (
      event: PointerEvent
    ) => {
      const target = event.target as Node;

      if (
        panelRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener(
      "pointerdown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutside
      );
    };
  }, [open, onClose, anchorRef]);

  if (
    !open ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        className="hb-car-dropdown"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          maxHeight: position.maxHeight,
        }}
        initial={{
          opacity: 0,
          y: -8,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: -5,
          scale: 0.988,
        }}
        transition={{
          duration: 0.24,
          ease,
        }}
      >
        <div className="hb-car-dropdown-head">
          <div>
            <span>CARBON FLEET</span>
            <strong>{copy.booking.selectCar}</strong>
          </div>

          <button
            type="button"
            className="hb-car-dropdown-close"
            onClick={onClose}
            aria-label={copy.booking.close}
          >
            <X size={15} strokeWidth={1.7} />
          </button>
        </div>

        <label className="hb-car-dropdown-search">
          <Search size={14} strokeWidth={1.7} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={copy.bookingBar.searchPlaceholder}
            autoFocus
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={copy.bookingBar.clearSearch}
            >
              <X size={12} />
            </button>
          )}
        </label>

        <div className="hb-car-dropdown-categories">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={
                category === item
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {copy.carsPage.categories[item as keyof typeof copy.carsPage.categories] ?? item}
            </button>
          ))}
        </div>

        <div className="hb-car-dropdown-count">
          <span>
            {filteredCars.length} {copy.bookingBar.carCount}
          </span>

          <span>
            {copy.bookingBar.dailyPrice}
          </span>
        </div>

        <div className="hb-car-dropdown-list">
          {filteredCars.map((car) => {
            const selected =
              selectedSlug === car.slug;

            const price =
              getDailyPrice(car, 3);

            return (
              <motion.button
                type="button"
                key={car.slug}
                className={`hb-car-dropdown-option ${
                  selected ? "is-selected" : ""
                }`}
                onClick={() => {
                  onSelect(car.slug);
                  onClose();
                }}
                whileHover={{
                  x: 3,
                }}
                transition={{
                  duration: 0.18,
                  ease,
                }}
              >
                <span className="hb-car-dropdown-image">
                  <img
                    src={car.thumbnail}
                    alt={car.title}
                    loading="lazy"
                  />
                </span>

                <span className="hb-car-dropdown-info">
                  <small>
                    {car.brand}
                    <i>·</i>
                    {copy.carsPage.categories[car.category as keyof typeof copy.carsPage.categories] ?? car.category}
                  </small>

                  <strong>
                    {car.title}
                  </strong>

                  <em>
                    {car.seats ?? "—"} {copy.car.seats}
                    <i>·</i>
                    {translateCarValue(car.transmission, locale)}
                    <i>·</i>
                    {translateCarValue(car.fuel, locale)}
                  </em>
                </span>

                <span className="hb-car-dropdown-price">
                  <small>{copy.bookingBar.daily}</small>

                  <strong>
                    {price
                      ? `${price} ₼`
                      : copy.bookingBar.request}
                  </strong>
                </span>

                <span
                  className={`hb-car-dropdown-check ${
                    selected ? "is-visible" : ""
                  }`}
                >
                  <Check
                    size={13}
                    strokeWidth={2.2}
                  />
                </span>
              </motion.button>
            );
          })}

          {filteredCars.length === 0 && (
            <div className="hb-car-dropdown-empty">
              <CarFront
                size={22}
                strokeWidth={1.4}
              />

              <strong>
                {copy.bookingBar.noCar}
              </strong>

              <span>
                {copy.bookingBar.noCarText}
              </span>
            </div>
          )}
        </div>

        <div className="hb-car-dropdown-foot">
          <span>
            <i />
            {copy.bookingBar.fleet}
          </span>

          <span>
            {copy.bookingBar.escClose}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function HomeBookingBar() {
  const { copy, localeCode } = useCarbonCopy();
  const [availableCars, setAvailableCars] = useState<Car[]>(cars);
  const [carSlug, setCarSlug] = useState("");
  const [startDate, setStartDate] = useState(() => getDefaultBookingDates().start);
  const [endDate, setEndDate] = useState(() => getDefaultBookingDates().end);
  const [pickup, setPickup] =
    useState<"office" | "delivery">("office");

  const [ready, setReady] = useState(false);
  const [carPickerOpen, setCarPickerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const carButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let mounted = true;

    fetchPublicCars().then((supabaseCars) => {
      if (mounted && supabaseCars?.length) {
        setAvailableCars(supabaseCars);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const locked = calendarOpen;

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
  }, [calendarOpen]);

  const selectedCar = useMemo(
    () => availableCars.find((car) => car.slug === carSlug),
    [availableCars, carSlug]
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
      aria-label={copy.bookingBar.aria}
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
        <div className="home-booking-heading">
          <div>
            <span className="home-booking-eyebrow">
              <Sparkles size={13} strokeWidth={1.65} />
              {copy.bookingBar.quickChoice}
            </span>

            <h2>
              {copy.bookingBar.heading1}
              <span> {copy.bookingBar.heading2}</span>
            </h2>
          </div>

          <p>{copy.bookingBar.intro}</p>
        </div>

        <div className="hb-v2-command">
          <button
            ref={carButtonRef}
            type="button"
            aria-expanded={carPickerOpen}
            aria-haspopup="listbox"
            className={`hb-v2-field hb-v2-car ${
              selectedCar ? "has-value" : ""
            }`}
            onClick={() => {
              setCalendarOpen(false);
              setCarPickerOpen((value) => !value);
            }}
          >
            <span className="hb-v2-icon">
              <CarFront size={18} strokeWidth={1.55} />
            </span>

            <span className="hb-v2-field-copy">
              <small>{copy.booking.car}</small>

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
                    <em>
                      {copy.carsPage.categories[
                        selectedCar.category as keyof typeof copy.carsPage.categories
                      ] ?? selectedCar.category}
                    </em>
                  </span>
                </span>
              ) : (
                <strong>{copy.booking.selectCar}</strong>
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
              <small>{copy.booking.pickup}</small>
              <strong>
                {formatDate(
                  startDate,
                  localeCode,
                  copy.booking.chooseDate
                )}
              </strong>
              <em>
                {formatLongDate(
                  startDate,
                  localeCode,
                  copy.booking.chooseDate
                )}
              </em>
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
              <small>{copy.booking.return}</small>
              <strong>
                {formatDate(
                  endDate,
                  localeCode,
                  copy.booking.chooseDate
                )}
              </strong>
              <em>
                {formatLongDate(
                  endDate,
                  localeCode,
                  copy.booking.chooseDate
                )}
              </em>
            </span>
          </button>

          <label className="hb-v2-field hb-v2-pickup">
            <span className="hb-v2-icon">
              <MapPin size={18} strokeWidth={1.55} />
            </span>

            <span className="hb-v2-field-copy">
              <small>{copy.bookingBar.pickupMethod}</small>

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
                  aria-label={copy.bookingBar.pickupMethod}
                >
                  <option value="office">
                    {copy.bookingBar.office}
                  </option>

                  <option value="delivery">
                    {copy.bookingBar.delivery}
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
                    ? `${duration} ${copy.bookingBar.days} · ~${estimate} ₼`
                    : `${duration} ${copy.bookingBar.days}`
                  : copy.bookingBar.continue}
              </small>

              <strong>
                {valid
                  ? copy.bookingBar.reserve
                  : copy.bookingBar.choose}
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
              {copy.bookingBar.fullCasco}
              <b>·</b>
              {copy.bookingBar.transparentPrice}
              <b>·</b>
              {copy.bookingBar.support}
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
                    {dailyPrice} ₼ {copy.car.perDay}
                  </>
                ) : null}
              </>
            ) : (
              <>
                <i />
                {copy.bookingBar.waitingCar}
              </>
            )}
          </span>
        </div>

      </motion.div>

      <CarPicker
        open={carPickerOpen}
        selectedSlug={carSlug}
        availableCars={availableCars}
        onClose={() => setCarPickerOpen(false)}
        onSelect={setCarSlug}
        anchorRef={carButtonRef}
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
