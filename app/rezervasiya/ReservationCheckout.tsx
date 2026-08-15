"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "motion/react";

import {   ArrowLeft,
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
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import CarbonNavbar from "@/components/CarbonNavbar";
import type { Car } from "@/data/cars";
import {useCarbonCopy} from "@/lib/carbon-locale";

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

const reservationCopy = {
  az: {
    backToCar: "Avtomobilə qayıt",
    live: "SORĞU SİSTEMİ AKTİVDİR",
    kicker: "CARBON RESERVATION / 04",
    heroLine1: "Son bir neçə",
    heroLine2: "detal.",
    heroText:
      "Avtomobil artıq seçilib. Səfər məlumatlarını yoxlayın, əlaqə məlumatlarınızı daxil edin və sorğunu Carbon komandasına göndərin.",
    steps: [
      ["01", "Səfər", "Tarix və seçimlər"],
      ["02", "Əlaqə", "Sizin məlumatlar"],
      ["03", "Yoxlama", "Son təsdiq"],
    ],
    tripStep: "01 / SƏFƏR",
    tripHeading: "Səfərinizi yoxlayın.",
    handoverMethod: "TƏHVİL ÜSULU",
    office: "Carbon məntəqəsi",
    officeText: "Avtomobili məntəqədən təhvil alın",
    delivery: "Çatdırılma",
    deliveryText: "Avtomobil seçdiyiniz ünvana gəlsin",
    officePickup: "Məntəqədən təhvil",
    finalStep: "03 / YEKUN",
    finalHeading: "Hər şey hazırdır.",
    carLabel: "AVTOMOBİL",
    tripLabel: "SƏFƏR",
    handoverLabel: "TƏHVİL",
    driverLabel: "SÜRÜCÜ",
    durationLabel: "Müddət",
    day: "gün",
    request: "Sorğu ilə",
    whatsapp: {
      hello: "Salam Carbon 👋",
      title: "Yeni avtomobil rezervasiya sorğusu:",
      car: "Avtomobil",
      category: "Kateqoriya",
      pickup: "Götürmə",
      return: "Qaytarma",
      duration: "Müddət",
      handover: "Təhvil",
      address: "Ünvan",
      driver: "Sürücü",
      extras: "Əlavələr",
      daily: "Günlük qiymət",
      total: "Təxmini məbləğ",
      name: "Ad",
      phone: "Telefon",
      note: "Qeyd",
      confirm: "Mövcudluğu təsdiqləməyinizi xahiş edirəm.",
    },
  },
  en: {
    backToCar: "Back to car",
    live: "REQUEST SYSTEM ACTIVE",
    kicker: "CARBON RESERVATION / 04",
    heroLine1: "A few final",
    heroLine2: "details.",
    heroText:
      "The car is already selected. Check the trip details, enter your contact information and send the request to the Carbon team.",
    steps: [
      ["01", "Trip", "Dates and options"],
      ["02", "Contact", "Your details"],
      ["03", "Review", "Final confirmation"],
    ],
    tripStep: "01 / TRIP",
    tripHeading: "Review your trip.",
    handoverMethod: "HANDOVER METHOD",
    office: "Carbon office",
    officeText: "Pick up the car from our office",
    delivery: "Delivery",
    deliveryText: "Have the car delivered to your address",
    officePickup: "Pick up at office",
    finalStep: "03 / FINAL",
    finalHeading: "Everything is ready.",
    carLabel: "CAR",
    tripLabel: "TRIP",
    handoverLabel: "HANDOVER",
    driverLabel: "DRIVER",
    durationLabel: "Duration",
    day: "day",
    request: "On request",
    whatsapp: {
      hello: "Hello Carbon 👋",
      title: "New car reservation request:",
      car: "Car",
      category: "Category",
      pickup: "Pick-up",
      return: "Return",
      duration: "Duration",
      handover: "Handover",
      address: "Address",
      driver: "Driver",
      extras: "Extras",
      daily: "Daily price",
      total: "Estimated total",
      name: "Name",
      phone: "Phone",
      note: "Note",
      confirm: "Please confirm availability.",
    },
  },
  ru: {
    backToCar: "Вернуться к авто",
    live: "СИСТЕМА ЗАЯВОК АКТИВНА",
    kicker: "CARBON RESERVATION / 04",
    heroLine1: "Несколько последних",
    heroLine2: "деталей.",
    heroText:
      "Автомобиль уже выбран. Проверьте данные поездки, укажите контактную информацию и отправьте заявку команде Carbon.",
    steps: [
      ["01", "Поездка", "Даты и опции"],
      ["02", "Контакты", "Ваши данные"],
      ["03", "Проверка", "Финальное подтверждение"],
    ],
    tripStep: "01 / ПОЕЗДКА",
    tripHeading: "Проверьте поездку.",
    handoverMethod: "СПОСОБ ПЕРЕДАЧИ",
    office: "Офис Carbon",
    officeText: "Получите автомобиль в нашем офисе",
    delivery: "Доставка",
    deliveryText: "Автомобиль приедет на выбранный адрес",
    officePickup: "Получение в офисе",
    finalStep: "03 / ФИНАЛ",
    finalHeading: "Все готово.",
    carLabel: "АВТОМОБИЛЬ",
    tripLabel: "ПОЕЗДКА",
    handoverLabel: "ПЕРЕДАЧА",
    driverLabel: "ВОДИТЕЛЬ",
    durationLabel: "Срок",
    day: "дн.",
    request: "По запросу",
    whatsapp: {
      hello: "Здравствуйте, Carbon 👋",
      title: "Новая заявка на бронирование автомобиля:",
      car: "Автомобиль",
      category: "Категория",
      pickup: "Получение",
      return: "Возврат",
      duration: "Срок",
      handover: "Передача",
      address: "Адрес",
      driver: "Водитель",
      extras: "Дополнительно",
      daily: "Цена за день",
      total: "Примерная сумма",
      name: "Имя",
      phone: "Телефон",
      note: "Заметка",
      confirm: "Пожалуйста, подтвердите доступность.",
    },
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

  return Math.max(
    1,
    Math.ceil(
      (b.getTime() - a.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
}


const checkoutCalendarMonths = [
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

const checkoutCalendarWeekdays = [
  "B.e",
  "Ç.a",
  "Ç",
  "C.a",
  "C",
  "Ş",
  "B",
];

function checkoutIsoToDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0,
  );
}

function checkoutDateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function checkoutStartOfMonth(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    12,
    0,
    0,
  );
}

function checkoutAddMonths(date: Date, amount: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1,
    12,
    0,
    0,
  );
}

function checkoutSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function checkoutDayValue(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
  ).getTime();
}

function formatCheckoutCalendarDate(value: string) {
  if (!value) return "Tarix seçin";

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(checkoutIsoToDate(value));
}

function ReservationCalendarMonth({
  month,
  startDate,
  endDate,
  hoverDate,
  selectingEnd,
  onHover,
  onSelect,
}: {
  month: Date;
  startDate: string;
  endDate: string;
  hoverDate: string | null;
  selectingEnd: boolean;
  onHover: (value: string | null) => void;
  onSelect: (value: string) => void;
}) {
  const first = checkoutStartOfMonth(month);
  const year = first.getFullYear();
  const monthIndex = first.getMonth();

  const mondayOffset = (first.getDay() + 6) % 7;

  const cells: Array<Date | null> = [];

  for (let i = 0; i < mondayOffset; i += 1) {
    cells.push(null);
  }

  const totalDays = new Date(
    year,
    monthIndex + 1,
    0,
  ).getDate();

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(
      new Date(year, monthIndex, day, 12, 0, 0),
    );
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const today = checkoutIsoToDate(isoToday());
  const start = startDate
    ? checkoutIsoToDate(startDate)
    : null;

  const end = endDate
    ? checkoutIsoToDate(endDate)
    : null;

  const hover = hoverDate
    ? checkoutIsoToDate(hoverDate)
    : null;

  const previewEnd =
    selectingEnd &&
    start &&
    hover &&
    checkoutDayValue(hover) >= checkoutDayValue(start)
      ? hover
      : end;

  return (
    <div className="reservation-calendar-month">
      <div className="reservation-calendar-month-title">
        <strong>
          {checkoutCalendarMonths[monthIndex]}
        </strong>

        <span>{year}</span>
      </div>

      <div className="reservation-calendar-week">
        {checkoutCalendarWeekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="reservation-calendar-days">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <span
                className="reservation-calendar-empty"
                key={`empty-${index}`}
              />
            );
          }

          const iso = checkoutDateToIso(date);
          const value = checkoutDayValue(date);

          const disabled =
            value < checkoutDayValue(today);

          const isStart =
            start !== null &&
            checkoutSameDay(date, start);

          const isEnd =
            previewEnd !== null &&
            checkoutSameDay(date, previewEnd);

          const inRange =
            start !== null &&
            previewEnd !== null &&
            value > checkoutDayValue(start) &&
            value < checkoutDayValue(previewEnd);

          const isToday =
            checkoutSameDay(date, today);

          return (
            <button
              type="button"
              key={iso}
              disabled={disabled}
              onMouseEnter={() => {
                if (!disabled && selectingEnd) {
                  onHover(iso);
                }
              }}
              onMouseLeave={() => {
                if (selectingEnd) {
                  onHover(null);
                }
              }}
              onClick={() => onSelect(iso)}
              className={[
                "reservation-calendar-day",
                isStart ? "is-start" : "",
                isEnd ? "is-end" : "",
                inRange ? "is-range" : "",
                isToday ? "is-today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={formatCheckoutCalendarDate(iso)}
            >
              <span>{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReservationDateRangePicker({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);
  const [selectingEnd, setSelectingEnd] =
    useState(false);

  const [hoverDate, setHoverDate] =
    useState<string | null>(null);

  const initialMonth = startDate
    ? checkoutStartOfMonth(
        checkoutIsoToDate(startDate),
      )
    : checkoutStartOfMonth(new Date());

  const [visibleMonth, setVisibleMonth] =
    useState(initialMonth);

  const days = differenceInDays(
    startDate,
    endDate,
  );

  function openForStart() {
    setSelectingEnd(false);
    setHoverDate(null);

    if (startDate) {
      setVisibleMonth(
        checkoutStartOfMonth(
          checkoutIsoToDate(startDate),
        ),
      );
    }

    setOpen(true);
  }

  function openForEnd() {
    setSelectingEnd(true);
    setHoverDate(null);

    if (startDate) {
      setVisibleMonth(
        checkoutStartOfMonth(
          checkoutIsoToDate(startDate),
        ),
      );
    }

    setOpen(true);
  }

  function selectDate(value: string) {
    if (!selectingEnd) {
      const nextStart = value;
      let nextEnd = endDate;

      if (
        !nextEnd ||
        checkoutDayValue(
          checkoutIsoToDate(nextEnd),
        ) <=
          checkoutDayValue(
            checkoutIsoToDate(nextStart),
          )
      ) {
        const date =
          checkoutIsoToDate(nextStart);

        date.setDate(date.getDate() + 1);
        nextEnd = checkoutDateToIso(date);
      }

      onChange(nextStart, nextEnd);
      setSelectingEnd(true);
      setHoverDate(null);
      return;
    }

    if (
      checkoutDayValue(
        checkoutIsoToDate(value),
      ) <=
      checkoutDayValue(
        checkoutIsoToDate(startDate),
      )
    ) {
      const nextStart = value;
      const date =
        checkoutIsoToDate(nextStart);

      date.setDate(date.getDate() + 1);

      onChange(
        nextStart,
        checkoutDateToIso(date),
      );

      setSelectingEnd(true);
      setHoverDate(null);
      return;
    }

    onChange(startDate, value);
    setSelectingEnd(false);
    setHoverDate(null);

    window.setTimeout(() => {
      setOpen(false);
    }, 220);
  }

  function chooseToday() {
    const start = isoToday();
    const date = checkoutIsoToDate(start);

    date.setDate(date.getDate() + 1);

    onChange(
      start,
      checkoutDateToIso(date),
    );

    setVisibleMonth(
      checkoutStartOfMonth(
        checkoutIsoToDate(start),
      ),
    );

    setSelectingEnd(true);
  }

  return (
    <div className="reservation-date-picker">
      <div className="reservation-date-stage">
        <button
          type="button"
          className={[
            "reservation-date-card",
            open && !selectingEnd
              ? "is-active"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={openForStart}
        >
          <span className="reservation-date-card-index">
            01
          </span>

          <span className="reservation-date-card-icon">
            <CalendarDays size={19} />
          </span>

          <span className="reservation-date-card-copy">
            <small>GÖTÜRMƏ TARİXİ</small>

            <strong>
              {formatCheckoutCalendarDate(
                startDate,
              )}
            </strong>

            <em>
              Səfərin başlanğıcı
            </em>
          </span>

          <ChevronDown
            className="reservation-date-chevron"
            size={15}
          />
        </button>

        <div className="reservation-date-journey">
          <span className="reservation-date-journey-line" />

          <div className="reservation-date-duration">
            <Clock3 size={13} />

            <strong>{days}</strong>

            <span>GÜN</span>
          </div>

          <span className="reservation-date-journey-line" />
        </div>

        <button
          type="button"
          className={[
            "reservation-date-card",
            open && selectingEnd
              ? "is-active"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={openForEnd}
        >
          <span className="reservation-date-card-index">
            02
          </span>

          <span className="reservation-date-card-icon">
            <CalendarDays size={19} />
          </span>

          <span className="reservation-date-card-copy">
            <small>QAYTARMA TARİXİ</small>

            <strong>
              {formatCheckoutCalendarDate(
                endDate,
              )}
            </strong>

            <em>
              Səfərin tamamlanması
            </em>
          </span>

          <ChevronDown
            className="reservation-date-chevron"
            size={15}
          />
        </button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Təqvimi bağla"
              className="reservation-calendar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <div className="reservation-calendar-modal-layer">
              <motion.div
                className="reservation-calendar-shell"
                initial={{
                  opacity: 0,
                  y: 18,
                  scale: 0.99,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.995,
                }}
                transition={{
                  duration: 0.28,
                  ease,
                }}
              >
              <div className="reservation-calendar-head">
                <div>
                  <span>
                    {selectingEnd
                      ? "02 / QAYTARMA"
                      : "01 / GÖTÜRMƏ"}
                  </span>

                  <strong>
                    {selectingEnd
                      ? "Qaytarma tarixini seçin."
                      : "Səfərin başlanğıcını seçin."}
                  </strong>

                  <small>
                    Tarix aralığını birbaşa təqvimdən
                    müəyyən edin.
                  </small>
                </div>

                <button
                  type="button"
                  aria-label="Bağla"
                  onClick={() => setOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="reservation-calendar-selection">
                <button
                  type="button"
                  className={
                    !selectingEnd
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectingEnd(false)
                  }
                >
                  <small>GÖTÜRMƏ</small>

                  <strong>
                    {formatCheckoutCalendarDate(
                      startDate,
                    )}
                  </strong>
                </button>

                <div className="reservation-calendar-selection-mid">
                  <ArrowRight size={15} />

                  <span>
                    {days} gün
                  </span>
                </div>

                <button
                  type="button"
                  className={
                    selectingEnd
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectingEnd(true)
                  }
                >
                  <small>QAYTARMA</small>

                  <strong>
                    {formatCheckoutCalendarDate(
                      endDate,
                    )}
                  </strong>
                </button>
              </div>

              <div className="reservation-calendar-nav">
                <button
                  type="button"
                  aria-label="Əvvəlki ay"
                  onClick={() =>
                    setVisibleMonth(
                      (current) =>
                        checkoutAddMonths(
                          current,
                          -1,
                        ),
                    )
                  }
                >
                  <ChevronLeft size={17} />
                </button>

                <div>
                  <span>TƏQVİM</span>

                  <strong>
                    {
                      checkoutCalendarMonths[
                        visibleMonth.getMonth()
                      ]
                    }{" "}
                    {visibleMonth.getFullYear()}
                  </strong>
                </div>

                <button
                  type="button"
                  aria-label="Növbəti ay"
                  onClick={() =>
                    setVisibleMonth(
                      (current) =>
                        checkoutAddMonths(
                          current,
                          1,
                        ),
                    )
                  }
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              <motion.div
                key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                className="reservation-calendar-month-grid"
                initial={{
                  opacity: 0,
                  x: 8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.22,
                  ease,
                }}
              >
                <ReservationCalendarMonth
                  month={visibleMonth}
                  startDate={startDate}
                  endDate={endDate}
                  hoverDate={hoverDate}
                  selectingEnd={selectingEnd}
                  onHover={setHoverDate}
                  onSelect={selectDate}
                />

                <div className="reservation-calendar-second">
                  <ReservationCalendarMonth
                    month={checkoutAddMonths(
                      visibleMonth,
                      1,
                    )}
                    startDate={startDate}
                    endDate={endDate}
                    hoverDate={hoverDate}
                    selectingEnd={selectingEnd}
                    onHover={setHoverDate}
                    onSelect={selectDate}
                  />
                </div>
              </motion.div>

              <div className="reservation-calendar-foot">
                <button
                  type="button"
                  className="reservation-calendar-today"
                  onClick={chooseToday}
                >
                  Bu gün
                </button>

                <div>
                  <span>SEÇİLMİŞ SƏFƏR</span>

                  <strong>
                    {formatCheckoutCalendarDate(
                      startDate,
                    )}
                    <ArrowRight size={12} />
                    {formatCheckoutCalendarDate(
                      endDate,
                    )}
                  </strong>
                </div>

                <button
                  type="button"
                  className="reservation-calendar-ready"
                  onClick={() => setOpen(false)}
                >
                  Hazırdır
                  <Check size={13} />
                </button>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </div>
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
  const {locale} = useCarbonCopy();
  const t = reservationCopy[locale];

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

    const w = t.whatsapp;
    const lines = [
      w.hello,
      "",
      w.title,
      "",
      `${w.car}: ${car.title}`,
      `${w.category}: ${car.category}`,
      `${w.pickup}: ${formatDate(startDate)}`,
      `${w.return}: ${formatDate(endDate)}`,
      `${w.duration}: ${days} ${t.day}`,
      `${w.handover}: ${
        pickup === "delivery"
          ? t.delivery
          : t.office
      }`,
      ...(pickup === "delivery" && deliveryAddress
        ? [`${w.address}: ${deliveryAddress}`]
        : []),
      `${w.driver}: ${drivers}`,
      `${w.extras}: ${extrasText}`,
      `${w.daily}: ${
        dailyRate !== null ? `${dailyRate} ₼` : t.request
      }`,
      `${w.total}: ${
        total !== null ? `${total} ₼` : t.request
      }`,
      "",
      `${w.name}: ${name}`,
      `${w.phone}: ${phone}`,
      ...(note.trim() ? [`${w.note}: ${note.trim()}`] : []),
      "",
      w.confirm,
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
              {t.backToCar}
            </Link>

            <div className="reservation-v4-live">
              <i />
              {t.live}
            </div>
          </div>

          <div className="reservation-v4-heading">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="reservation-v4-kicker">
                {t.kicker}
              </span>

              <h1>
                {t.heroLine1}
                <br />
                <em>{t.heroLine2}</em>
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
              {t.heroText}
            </motion.p>
          </div>

          <div className="reservation-v4-steps">
            {t.steps.map((item, index) => {
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
                        <span>{t.tripStep}</span>
                        <h2>{t.tripHeading}</h2>
                      </div>

                      <CalendarDays size={23} />
                    </div>

                    <ReservationDateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                      }}
                    />

                    <div className="reservation-v4-section-label">
                      {t.handoverMethod}
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
                          <strong>{t.office}</strong>
                          <small>
                            {t.officeText}
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
                          <strong>{t.delivery}</strong>
                          <small>
                            {t.deliveryText}
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
                        <span>{t.finalStep}</span>
                        <h2>{t.finalHeading}</h2>
                      </div>

                      <Sparkles size={23} />
                    </div>

                    <div className="reservation-v4-review">
                      <div>
                        <span>{t.carLabel}</span>
                        <strong>{car.title}</strong>
                        <small>{car.category}</small>
                      </div>

                      <div>
                        <span>{t.tripLabel}</span>
                        <strong>
                          {formatDate(startDate)} →{" "}
                          {formatDate(endDate)}
                        </strong>
                        <small>{days} {t.day}</small>
                      </div>

                      <div>
                        <span>{t.handoverLabel}</span>
                        <strong>
                          {pickup === "delivery"
                            ? t.delivery
                            : t.office}
                        </strong>
                        <small>
                          {pickup === "delivery"
                            ? deliveryAddress
                            : t.officePickup}
                        </small>
                      </div>

                      <div>
                        <span>{t.driverLabel}</span>
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
                  quality={100}
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
                      <small>{t.durationLabel}</small>
                      <strong>{days} {t.day}</strong>
                    </span>
                  </div>

                  <div>
                    <MapPin size={14} />

                    <span>
                      <small>{t.handoverLabel}</small>
                      <strong>
                        {pickup === "delivery"
                          ? t.delivery
                          : t.office}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <Users size={14} />

                    <span>
                      <small>{t.driverLabel}</small>
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
