"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ease = [0.22, 1, 0.36, 1] as const;


function differenceInDays(start: string, end: string) {
  if (!start || !end) return 0;

  const a = new Date(`${start}T12:00:00`);
  const b = new Date(`${end}T12:00:00`);

  return Math.max(
    0,
    Math.ceil(
      (b.getTime() - a.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}


function isoToday(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

const carbonMonths = [
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

const carbonWeekdays = ["B.e", "Ç.a", "Ç", "C.a", "C", "Ş", "B"];

function dateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isoToDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function startOfCalendarMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
}

function addCalendarMonths(date: Date, amount: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1,
    12,
    0,
    0,
  );
}

function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function calendarDayValue(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
  ).getTime();
}

function formatCarbonDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  const months = [
    "yan",
    "fev",
    "mar",
    "apr",
    "may",
    "iyn",
    "iyl",
    "avq",
    "sen",
    "okt",
    "noy",
    "dek",
  ];

  if (!year || !month || !day) {
    return value;
  }

  return `${day} ${months[month - 1]} ${year}`;
}

function CarbonCalendarMonth({
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
  const first = startOfCalendarMonth(month);
  const year = first.getFullYear();
  const monthIndex = first.getMonth();

  // JS Sunday=0. Convert calendar to Monday-first.
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
    cells.push(new Date(year, monthIndex, day, 12, 0, 0));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const today = isoToDate(isoToday());
  const start = startDate ? isoToDate(startDate) : null;
  const end = endDate ? isoToDate(endDate) : null;
  const hover = hoverDate ? isoToDate(hoverDate) : null;

  const previewEnd =
    selectingEnd && start && hover && calendarDayValue(hover) >= calendarDayValue(start)
      ? hover
      : end;

  return (
    <div className="carbon-calendar-month">
      <div className="carbon-calendar-month-title">
        <strong>{carbonMonths[monthIndex]}</strong>
        <span>{year}</span>
      </div>

      <div className="carbon-calendar-week">
        {carbonWeekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="carbon-calendar-days">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <span
                className="carbon-calendar-empty"
                key={`empty-${index}`}
              />
            );
          }

          const iso = dateToIso(date);
          const value = calendarDayValue(date);

          const disabled =
            value < calendarDayValue(today);

          const isStart =
            start !== null && sameCalendarDay(date, start);

          const isEnd =
            previewEnd !== null &&
            sameCalendarDay(date, previewEnd);

          const inRange =
            start !== null &&
            previewEnd !== null &&
            value > calendarDayValue(start) &&
            value < calendarDayValue(previewEnd);

          const isToday = sameCalendarDay(date, today);

          return (
            <button
              type="button"
              key={iso}
              disabled={disabled}
              onMouseEnter={() => {
                if (!disabled && selectingEnd) onHover(iso);
              }}
              onMouseLeave={() => {
                if (selectingEnd) onHover(null);
              }}
              onClick={() => onSelect(iso)}
              className={[
                "carbon-calendar-day",
                isStart ? "is-start" : "",
                isEnd ? "is-end" : "",
                inRange ? "is-range" : "",
                isToday ? "is-today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={formatCarbonDate(iso)}
            >
              <span>{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CarbonDateRangePicker({
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
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  /*
   * Draft range:
   *
   * null = display committed parent dates.
   * string = user clicked a NEW pickup and we are waiting for return.
   *
   * We deliberately DO NOT call onChange after the first click.
   */
  const [draftStart, setDraftStart] = useState<string | null>(null);

  const initialMonth = startDate
    ? startOfCalendarMonth(isoToDate(startDate))
    : startOfCalendarMonth(new Date());

  const [visibleMonth, setVisibleMonth] = useState(initialMonth);

  const displayStart = draftStart ?? startDate;

  /*
   * Critical fix:
   * Once a fresh pickup has been clicked there is NO selected end yet.
   * Therefore the old committed end must not be passed into the calendar.
   */
  const displayEnd = draftStart !== null ? "" : endDate;

  const days =
    draftStart !== null
      ? hoverDate &&
        calendarDayValue(isoToDate(hoverDate)) >
          calendarDayValue(isoToDate(draftStart))
        ? differenceInDays(draftStart, hoverDate)
        : 0
      : differenceInDays(startDate, endDate);

  function openForStart() {
    setDraftStart(null);
    setSelectingEnd(false);
    setHoverDate(null);

    if (startDate) {
      setVisibleMonth(
        startOfCalendarMonth(isoToDate(startDate)),
      );
    }

    setOpen(true);
  }

  function openForEnd() {
    /*
     * Explicitly clicking QAYTARMA means edit only the existing
     * return date. In that case the committed start remains valid.
     */
    setDraftStart(null);
    setSelectingEnd(true);
    setHoverDate(null);

    if (startDate) {
      setVisibleMonth(
        startOfCalendarMonth(isoToDate(startDate)),
      );
    }

    setOpen(true);
  }

  function selectDate(value: string) {
    /*
     * MODE 1:
     * User is choosing pickup.
     *
     * First click ONLY creates a draft pickup.
     * No end date is generated.
     * No parent state is changed.
     */
    if (!selectingEnd) {
      setDraftStart(value);
      setHoverDate(null);
      setSelectingEnd(true);
      return;
    }

    /*
     * MODE 2A:
     * We have a draft pickup, therefore this is the second click
     * of a brand-new range.
     */
    if (draftStart !== null) {
      const clicked =
        calendarDayValue(isoToDate(value));

      const pickup =
        calendarDayValue(isoToDate(draftStart));

      /*
       * Clicking the same day or an earlier day does NOT create
       * an end date. It simply moves the pickup to that day and
       * continues waiting for the second click.
       */
      if (clicked <= pickup) {
        setDraftStart(value);
        setHoverDate(null);
        return;
      }

      /*
       * Valid second click:
       * commit BOTH dates at the same time.
       */
      onChange(draftStart, value);

      setDraftStart(null);
      setSelectingEnd(false);
      setHoverDate(null);

      window.setTimeout(() => {
        setOpen(false);
      }, 180);

      return;
    }

    /*
     * MODE 2B:
     * User explicitly opened the QAYTARMA field.
     * Keep the existing pickup and replace only the return date.
     */
    if (
      !startDate ||
      calendarDayValue(isoToDate(value)) <=
        calendarDayValue(isoToDate(startDate))
    ) {
      /*
       * Earlier click becomes a fresh pickup instead.
       */
      setDraftStart(value);
      setSelectingEnd(true);
      setHoverDate(null);
      return;
    }

    onChange(startDate, value);

    setSelectingEnd(false);
    setHoverDate(null);

    window.setTimeout(() => {
      setOpen(false);
    }, 180);
  }

  function chooseToday() {
    const start = isoToday();
    const date = isoToDate(start);
    date.setDate(date.getDate() + 1);

    onChange(start, dateToIso(date));
    setVisibleMonth(startOfCalendarMonth(isoToDate(start)));
    setSelectingEnd(true);
  }

  return (
    <div className="carbon-date-picker">
      <div className="carbon-date-trigger-grid">
        <button
          type="button"
          className={`carbon-date-trigger ${
            open && !selectingEnd ? "is-active" : ""
          }`}
          onClick={openForStart}
        >
          <span className="carbon-date-trigger-icon">
            <CalendarDays size={17} />
          </span>

          <span className="carbon-date-trigger-copy">
            <small>GÖTÜRMƏ</small>
            <strong>{formatCarbonDate(displayStart)}</strong>
          </span>

          <ChevronDown size={14} />
        </button>

        <div className="carbon-date-duration">
          <span className="carbon-date-duration-line" />

          <span className="carbon-date-duration-pill">
            <Clock3 size={11} />
            {days} gün
          </span>

          <span className="carbon-date-duration-line" />
        </div>

        <button
          type="button"
          className={`carbon-date-trigger ${
            open && selectingEnd ? "is-active" : ""
          }`}
          onClick={openForEnd}
        >
          <span className="carbon-date-trigger-icon">
            <CalendarDays size={17} />
          </span>

          <span className="carbon-date-trigger-copy">
            <small>QAYTARMA</small>
            <strong>
                      {draftStart !== null
                        ? hoverDate &&
                          calendarDayValue(isoToDate(hoverDate)) >
                            calendarDayValue(isoToDate(draftStart))
                          ? formatCarbonDate(hoverDate)
                          : "Tarix seçin"
                        : formatCarbonDate(endDate)}
                    </strong>
          </span>

          <ChevronDown size={14} />
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
              className="carbon-calendar-dismiss"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <div className="carbon-calendar-modal-layer">
              <motion.div
                className="carbon-calendar-popover"
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
                  y: 8,
                  scale: 0.99,
                }}
                transition={{
                  duration: 0.28,
                  ease,
                }}
              >
              <div className="carbon-calendar-top">
                <div>
                  <span>
                    {selectingEnd
                      ? "QAYTARMA TARİXİ"
                      : "GÖTÜRMƏ TARİXİ"}
                  </span>

                  <strong>
                    {selectingEnd
                      ? "Səfərin son gününü seçin"
                      : "Səfəriniz nə vaxt başlayır?"}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Bağla"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="carbon-calendar-selected">
                <button
                  type="button"
                  className={!selectingEnd ? "active" : ""}
                  onClick={() => setSelectingEnd(false)}
                >
                  <small>GÖTÜRMƏ</small>
                  <strong>{formatCarbonDate(startDate)}</strong>
                </button>

                <span>
                  <ArrowRight size={14} />
                </span>

                <button
                  type="button"
                  className={selectingEnd ? "active" : ""}
                  onClick={() => setSelectingEnd(true)}
                >
                  <small>QAYTARMA</small>
                  <strong>{formatCarbonDate(endDate)}</strong>
                </button>
              </div>

              <div className="carbon-calendar-nav">
                <button
                  type="button"
                  aria-label="Əvvəlki ay"
                  onClick={() =>
                    setVisibleMonth((current) =>
                      addCalendarMonths(current, -1),
                    )
                  }
                >
                  <ChevronLeft size={16} />
                </button>

                <span>
                  {carbonMonths[visibleMonth.getMonth()]}{" "}
                  {visibleMonth.getFullYear()}
                </span>

                <button
                  type="button"
                  aria-label="Növbəti ay"
                  onClick={() =>
                    setVisibleMonth((current) =>
                      addCalendarMonths(current, 1),
                    )
                  }
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <motion.div
                key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                className="carbon-calendar-months"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24, ease }}
              >
                <CarbonCalendarMonth
                  month={visibleMonth}
                  startDate={displayStart}
                  endDate={displayEnd}
                  hoverDate={hoverDate}
                  selectingEnd={selectingEnd}
                  onHover={setHoverDate}
                  onSelect={selectDate}
                />

                <div className="carbon-calendar-second-month">
                  <CarbonCalendarMonth
                    month={addCalendarMonths(visibleMonth, 1)}
                    startDate={displayStart}
                    endDate={displayEnd}
                    hoverDate={hoverDate}
                    selectingEnd={selectingEnd}
                    onHover={setHoverDate}
                    onSelect={selectDate}
                  />
                </div>
              </motion.div>

              <div className="carbon-calendar-footer">
                <button
                  type="button"
                  onClick={chooseToday}
                >
                  Bu gün
                </button>

                <div>
                  <span>SEÇİLMİŞ MÜDDƏT</span>
                  <strong>{days} gün</strong>
                </div>

                <button
                  type="button"
                  className="carbon-calendar-done"
                  onClick={() => setOpen(false)}
                >
                  Hazırdır
                  <Check size={12} />
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
