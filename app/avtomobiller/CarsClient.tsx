"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "motion/react";

import {
  ArrowRight,
  ArrowUpDown,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Fuel,
  Gauge,
  Luggage,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import {
  cars,
  getShortTermPrice,
  type Car,
  type CarCategory,
} from "@/data/cars";
import { fetchPublicCars } from "@/lib/supabase/cars";
import CarbonNavbar from "@/components/CarbonNavbar";
import {
  translateCarValue,
  useCarbonCopy,
} from "@/lib/carbon-locale";

type CategoryFilter = "Hamısı" | CarCategory | "TRANSFER";

type SortType =
  | "recommended"
  | "price-low"
  | "price-high"
  | "name";

type PriceMode = "rental" | "transfer";

const categories: CategoryFilter[] = [
  "Hamısı",
  "Econom",
  "Comfort",
  "Business",
  "SUV",
  "Miniven",
  "Sport",
  "TRANSFER",
];

const ease = [0.22, 1, 0.36, 1] as const;

function getPrice(car: Car, mode: PriceMode = "rental") {
  if (mode === "rental") {
    return getShortTermPrice(car);
  }

  const source =
    mode === "transfer" ? car.transferPrices : car.rentalPrices;
  const prices = Object.values(source).filter(
    (price): price is number => typeof price === "number",
  );

  return prices.length ? Math.min(...prices) : null;
}

function getDisplayPrice(car: Car, mode: PriceMode = "rental") {
  if (mode === "transfer") {
    return (
      car.transferPrices.baku ??
      car.transferPrices.seaBreeze ??
      car.transferPrices.qabala ??
      car.transferPrices.ismayilli ??
      car.transferPrices.quba ??
      car.transferPrices.shamaxi ??
      car.transferPrices.shaki ??
      car.transferPrices.shusha ??
      car.transferPrices.lankaran
    );
  }

  return getShortTermPrice(car);
}

export default function CarsClient() {
  const { copy, locale } = useCarbonCopy();
  const [siteCars, setSiteCars] = useState<Car[]>(cars);
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<CategoryFilter>("Hamısı");

  const [selectedBrand, setSelectedBrand] =
    useState("Hamısı");

  const [fuel, setFuel] = useState("Hamısı");

  const [transmission, setTransmission] = useState("Hamısı");
  const [minSeats, setMinSeats] = useState<number | null>(null);
  const [minBaggage, setMinBaggage] = useState<number | null>(null);
  const [minSmallBaggage, setMinSmallBaggage] = useState<number | null>(null);
  const [engine, setEngine] = useState("Hamısı");

  const [weddingOnly, setWeddingOnly] =
    useState(false);

  const [transferOnly, setTransferOnly] =
    useState(false);

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [sortOpen, setSortOpen] =
    useState(false);

  const [sort, setSort] =
    useState<SortType>("recommended");

  useEffect(() => {
    let mounted = true;

    fetchPublicCars().then((supabaseCars) => {
      if (mounted && supabaseCars?.length) {
        setSiteCars(supabaseCars);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleCars = useMemo(
    () => siteCars.filter((car) => car.rentalVisible !== false),
    [siteCars]
  );

  const brands = useMemo(
    () => Array.from(new Set(visibleCars.map((car) => car.brand))).sort(),
    [visibleCars]
  );

  const transmissions = useMemo(
    () =>
      Array.from(
        new Set(visibleCars.map((car) => car.transmission).filter(Boolean))
      ).sort(),
    [visibleCars]
  );

  const fuels = useMemo(
    () =>
      Array.from(new Set(visibleCars.map((car) => car.fuel).filter(Boolean))).sort(),
    [visibleCars]
  );

  const engines = useMemo(
    () =>
      Array.from(new Set(visibleCars.map((car) => car.engine).filter(Boolean))).sort(),
    [visibleCars]
  );

  const seatOptions = useMemo(
    () =>
      Array.from(
        new Set(
          visibleCars
            .map((car) => car.seats)
            .filter((value): value is number => typeof value === "number")
        )
      ).sort((a, b) => a - b),
    [visibleCars]
  );

  const baggageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          visibleCars
            .map((car) => car.baggage)
            .filter((value): value is number => typeof value === "number")
        )
      ).sort((a, b) => a - b),
    [visibleCars]
  );

  const filteredCars = useMemo(() => {
    const priceMode: PriceMode =
      category === "TRANSFER" || transferOnly ? "transfer" : "rental";
    const query = search
      .trim()
      .toLocaleLowerCase("az");

    const result = visibleCars.filter((car) => {
      const matchesSearch =
        !query ||
        car.title
          .toLocaleLowerCase("az")
          .includes(query) ||
        car.brand
          .toLocaleLowerCase("az")
          .includes(query) ||
        car.category
          .toLocaleLowerCase("az")
          .includes(query);

      const matchesCategory =
        category === "Hamısı" ||
        (category === "TRANSFER"
          ? car.transferAvailable
          : car.category === category);

      const matchesBrand =
        selectedBrand === "Hamısı" ||
        car.brand === selectedBrand;

      const matchesFuel =
        fuel === "Hamısı" ||
        car.fuel === fuel;

      const matchesTransfer =
        !transferOnly ||
        car.transferAvailable;

      const matchesTransmission =
        transmission === "Hamısı" ||
        car.transmission === transmission;

      const matchesSeats =
        minSeats === null ||
        (typeof car.seats === "number" &&
          car.seats >= minSeats);

      const matchesBaggage =
        minBaggage === null ||
        (typeof car.baggage === "number" &&
          car.baggage >= minBaggage);

      const matchesSmallBaggage =
        minSmallBaggage === null ||
        (typeof car.smallBaggage === "number" &&
          car.smallBaggage >= minSmallBaggage);

      const matchesEngine =
        engine === "Hamısı" ||
        car.engine === engine;

      const matchesWedding =
        !weddingOnly ||
        car.weddingAvailable;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesSeats &&
        matchesBaggage &&
        matchesSmallBaggage &&
        matchesEngine &&
        matchesTransfer &&
        matchesWedding
      );
    });

    return [...result].sort((a, b) => {
      const aPrice =
        getPrice(a, priceMode) ??
        Number.MAX_SAFE_INTEGER;

      const bPrice =
        getPrice(b, priceMode) ??
        Number.MAX_SAFE_INTEGER;

      if (sort === "price-low")
        return aPrice - bPrice;

      if (sort === "price-high")
        return bPrice - aPrice;

      if (sort === "name")
        return a.title.localeCompare(b.title);

      return 0;
    });
  }, [
    search,
    category,
    selectedBrand,
    fuel,
    transmission,
    minSeats,
    minBaggage,
    minSmallBaggage,
    engine,
    transferOnly,
    weddingOnly,
    sort,
    visibleCars,
  ]);

  const activeFilterCount =
    (category !== "Hamısı" ? 1 : 0) +
    (selectedBrand !== "Hamısı" ? 1 : 0) +
    (fuel !== "Hamısı" ? 1 : 0) +
    (transmission !== "Hamısı" ? 1 : 0) +
    (minSeats !== null ? 1 : 0) +
    (minBaggage !== null ? 1 : 0) +
    (minSmallBaggage !== null ? 1 : 0) +
    (engine !== "Hamısı" ? 1 : 0) +
    (transferOnly ? 1 : 0) +
    (weddingOnly ? 1 : 0);

  const smallBaggageOptions = Array.from(
    new Set(
      visibleCars
        .map((car) => car.smallBaggage)
        .filter((value): value is number => typeof value === "number"),
    ),
  ).sort((a, b) => a - b);

  const transferCount = visibleCars.filter(
    (car) => car.transferAvailable,
  ).length;

  const categoryCount = new Set(
    visibleCars.map((car) => car.category),
  ).size;

  function clearFilters() {
    setSearch("");
    setCategory("Hamısı");
    setSelectedBrand("Hamısı");
    setFuel("Hamısı");
    setTransmission("Hamısı");
    setMinSeats(null);
    setMinBaggage(null);
    setMinSmallBaggage(null);
    setEngine("Hamısı");
    setTransferOnly(false);
    setWeddingOnly(false);
    setSort("recommended");
  }

  const sortLabel =
    sort === "price-low"
      ? copy.carsPage.sort.low
      : sort === "price-high"
        ? copy.carsPage.sort.high
        : sort === "name"
          ? copy.carsPage.sort.name
          : copy.carsPage.sort.recommended;

  return (
    <main className="fleet-v4">
      <CarbonNavbar light active="cars" />

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="fleet-v4-hero">
        <div className="fleet-v4-hero-grid" />
        <div className="fleet-v4-orb fleet-v4-orb-a" />
        <div className="fleet-v4-orb fleet-v4-orb-b" />

        <div className="fleet-v4-container">
          <div className="fleet-v4-hero-top">
            <motion.div
              className="fleet-v4-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                ease,
              }}
            >
              <span className="fleet-v4-live">
                <i />
                CARBON COLLECTION
              </span>

              <span>BAKU · AZ</span>
            </motion.div>

            <motion.div
              className="fleet-v4-index"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
            >
              <span>FLEET</span>
              <strong>01</strong>
            </motion.div>
          </div>

          <div className="fleet-v4-hero-main">
            <div>
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 45,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.08,
                  ease,
                }}
              >
                {copy.carsPage.heroTitle1}
                <br />
                {copy.carsPage.heroTitle2}
                <span> {copy.carsPage.heroTitle3}</span>
              </motion.h1>
            </div>

            <motion.div
              className="fleet-v4-hero-side"
              initial={{
                opacity: 0,
                y: 28,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.24,
                ease,
              }}
            >
              <Sparkles
                size={18}
                strokeWidth={1.4}
              />

              <p>
                {copy.carsPage.heroIntro}
              </p>

              <a href="#fleet-results">
                {copy.carsPage.explore}
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="fleet-v4-stats"
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.36,
              ease,
            }}
          >
            <div>
              <small>KOLLEKSİYA</small>
              <strong>{cars.length}</strong>
              <span>avtomobil</span>
            </div>

            <div>
              <small>MARKALAR</small>
              <strong>{brands.length}</strong>
              <span>seçilmiş marka</span>
            </div>

            <div>
              <small>SEQMENTLƏR</small>
              <strong>{categoryCount}</strong>
              <span>kateqoriya</span>
            </div>

            <div>
              <small>TRANSFER</small>
              <strong>{transferCount}</strong>
              <span>uyğun model</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          CARBON FINDER
      =================================================== */}

      <section
        className="fleet-v4-finder"
        id="fleet-results"
      >
        <div className="fleet-v4-container">
          <motion.div
            className="fleet-v4-command"
            initial={{
              opacity: 0,
              y: 32,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.75,
              ease,
            }}
          >
            <div className="fleet-v4-command-top">
              <div>
                <span className="fleet-v4-command-label">
                  CARBON FINDER
                </span>

                <strong>
                  {copy.carsPage.finderTitle}
                </strong>
              </div>

              <span className="fleet-v4-command-status">
                <i />
                {filteredCars.length} {copy.carsPage.resultSuffix}
              </span>
            </div>

            <div className="fleet-v4-search-row">
              <label className="fleet-v4-search">
                <Search
                  size={17}
                  strokeWidth={1.5}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Mercedes, BMW, SUV..."
                  aria-label={copy.carsPage.finderTitle}
                />

                <AnimatePresence>
                  {search && (
                    <motion.button
                      type="button"
                      onClick={() => setSearch("")}
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.7,
                      }}
                      aria-label={copy.carsPage.reset}
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </label>

              <button
                type="button"
                className={`fleet-v4-filter-trigger ${
                  filtersOpen ? "active" : ""
                }`}
                onClick={() =>
                  setFiltersOpen((value) => !value)
                }
              >
                <SlidersHorizontal size={15} />

                <span>{copy.carsPage.filters}</span>

                {activeFilterCount > 0 && (
                  <i>{activeFilterCount}</i>
                )}
              </button>
            </div>

            <LayoutGroup id="fleet-v4-categories">
              <div className="fleet-v4-categories">
                {categories.map((item) => {
                  const active =
                    category === item;

                  return (
                    <button
                      type="button"
                      key={item}
                      className={
                        active ? "active" : ""
                      }
                      onClick={() =>
                        setCategory(item)
                      }
                    >
                      {active && (
                        <motion.span
                          className="fleet-v4-category-bg"
                          layoutId="fleet-v4-category-bg"
                          transition={{
                            type: "spring",
                            stiffness: 390,
                            damping: 32,
                          }}
                        />
                      )}

                      <span>
                        {copy.carsPage.categories[item as keyof typeof copy.carsPage.categories] ?? item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <AnimatePresence initial={false}>
              {filtersOpen && (
                <motion.div
                  className="fleet-v4-advanced"
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
                    duration: 0.45,
                    ease,
                  }}
                >
                  <div className="fleet-v4-advanced-inner fleet-v6-filter-panel">

                    <div className="fleet-v6-filter-head">
                      <div>
                      <span>{copy.carsPage.detailedFilters}</span>
                      <strong>
                          {copy.carsPage.chooseByDetails}
                      </strong>
                      </div>

                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          className="fleet-v6-reset-top"
                          onClick={clearFilters}
                        >
                          <X size={13} />
                          {copy.carsPage.reset}
                        </button>
                      )}
                    </div>

                    <div className="fleet-v6-filter-grid">

                      <div className="fleet-v6-filter-card fleet-v6-filter-card-wide">
                        <div className="fleet-v6-filter-title">
                          <span className="fleet-v6-filter-icon">
                            <CarFront size={16} />
                          </span>
                          <div>
                            <small>{copy.carsPage.brand}</small>
                            <strong>{copy.carsPage.manufacturer}</strong>
                          </div>
                        </div>

                        <div className="fleet-v6-pills">
                          {["Hamısı", ...brands].map(
                            (brand) => (
                              <button
                                type="button"
                                key={brand}
                                className={
                                  selectedBrand === brand
                                    ? "active"
                                    : ""
                                }
                                onClick={() =>
                                  setSelectedBrand(brand)
                                }
                              >
                                {selectedBrand === brand && (
                                  <Check size={11} />
                                )}
                                {brand === "Hamısı" ? copy.carsPage.all : brand}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="fleet-v6-filter-card">
                        <div className="fleet-v6-filter-title">
                          <span className="fleet-v6-filter-icon">
                            <Users size={16} />
                          </span>
                          <div>
                            <small>OTURACAQ</small>
                            <strong>{copy.carsPage.seats}</strong>
                          </div>
                        </div>

                        <div className="fleet-v6-pills">
                          <button
                            type="button"
                            className={
                              minSeats === null
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setMinSeats(null)
                            }
                          >
                            {copy.carsPage.all}
                          </button>

                          {seatOptions.map((value) => (
                            <button
                              type="button"
                              key={value}
                              className={
                                minSeats === value
                                  ? "active"
                                  : ""
                              }
                              onClick={() =>
                                setMinSeats(value)
                              }
                            >
                              {value}+
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="fleet-v6-filter-card">
                        <div className="fleet-v6-filter-title">
                          <span className="fleet-v6-filter-icon">
                            <Luggage size={16} />
                          </span>
                          <div>
                            <small>BAQAJ</small>
                            <strong>{copy.carsPage.baggage}</strong>
                          </div>
                        </div>

                        <div className="fleet-v6-pills">
                          <button
                            type="button"
                            className={
                              minBaggage === null
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setMinBaggage(null)
                            }
                          >
                            {copy.carsPage.all}
                          </button>

                          {baggageOptions.map((value) => (
                            <button
                              type="button"
                              key={value}
                              className={
                                minBaggage === value
                                  ? "active"
                                  : ""
                              }
                              onClick={() =>
                                setMinBaggage(value)
                              }
                            >
                              {value}+
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="fleet-v6-filter-card">
                        <div className="fleet-v6-filter-title">
                          <span className="fleet-v6-filter-icon">
                            <Luggage size={16} />
                          </span>

                          <div>
                            <small>{copy.carsPage.baggage}</small>
                            <strong>{copy.carsPage.baggage}</strong>
                          </div>
                        </div>

                        <div className="fleet-v6-pills">
                          <button
                            type="button"
                            className={
                              minSmallBaggage === null
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setMinSmallBaggage(null)
                            }
                          >
                            {copy.carsPage.all}
                          </button>

                          {smallBaggageOptions.map((value) => (
                            <button
                              type="button"
                              key={value}
                              className={
                                minSmallBaggage === value
                                  ? "active"
                                  : ""
                              }
                              onClick={() =>
                                setMinSmallBaggage(value)
                              }
                            >
                              {value}+
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="fleet-v6-filter-card">
                        <div className="fleet-v6-filter-title">
                          <span className="fleet-v6-filter-icon">
                            <Settings2 size={16} />
                          </span>
                          <div>
                            <small>{copy.carsPage.transmission}</small>
                            <strong>{copy.carsPage.transmission}</strong>
                          </div>
                        </div>

                        <div className="fleet-v6-pills">
                          {[
                            "Hamısı",
                            ...transmissions,
                          ].map((item) => (
                            <button
                              type="button"
                              key={item}
                              className={
                                transmission === item
                                  ? "active"
                                  : ""
                              }
                              onClick={() =>
                                setTransmission(item)
                              }
                            >
                              {transmission === item && (
                                <Check size={11} />
                              )}
                              {item === "Hamısı"
                                ? copy.carsPage.all
                                : translateCarValue(item, locale)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="fleet-v6-filter-card">
                        <div className="fleet-v6-filter-title">
                          <span className="fleet-v6-filter-icon">
                            <Fuel size={16} />
                          </span>
                          <div>
                            <small>{copy.carsPage.fuel}</small>
                            <strong>{copy.carsPage.fuel}</strong>
                          </div>
                        </div>

                        <div className="fleet-v6-pills">
                          {["Hamısı", ...fuels].map(
                            (item) => (
                              <button
                                type="button"
                                key={item}
                                className={
                                  fuel === item
                                    ? "active"
                                    : ""
                                }
                                onClick={() =>
                                  setFuel(item)
                                }
                              >
                                {fuel === item && (
                                  <Check size={11} />
                                )}
                                {item === "Hamısı"
                                  ? copy.carsPage.all
                                  : translateCarValue(item, locale)}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="fleet-v6-filter-card">
                        <div className="fleet-v6-filter-title">
                          <span className="fleet-v6-filter-icon">
                            <Gauge size={16} />
                          </span>
                          <div>
                            <small>{copy.carsPage.engine}</small>
                            <strong>{copy.carsPage.engine}</strong>
                          </div>
                        </div>

                        <div className="fleet-v6-pills">
                          {["Hamısı", ...engines].map(
                            (item) => (
                              <button
                                type="button"
                                key={item}
                                className={
                                  engine === item
                                    ? "active"
                                    : ""
                                }
                                onClick={() =>
                                  setEngine(item ?? "")
                                }
                              >
                                {engine === item && (
                                  <Check size={11} />
                                )}
                                {item === "Hamısı" ? copy.carsPage.all : item}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="fleet-v6-service-row">

                      <button
                        type="button"
                        className={`fleet-v6-service ${
                          transferOnly ? "active" : ""
                        }`}
                        onClick={() =>
                          setTransferOnly(
                            (value) => !value,
                          )
                        }
                      >
                        <span className="fleet-v6-service-check">
                          {transferOnly && (
                            <Check size={13} />
                          )}
                        </span>

                        <div>
                          <strong>
                            {copy.car.transfer}
                          </strong>
                          <small>
                            {copy.homeExperience.services[1].text}
                          </small>
                        </div>

                        <ArrowRight size={15} />
                      </button>

                      <button
                        type="button"
                        className={`fleet-v6-service ${
                          weddingOnly ? "active" : ""
                        }`}
                        onClick={() =>
                          setWeddingOnly(
                            (value) => !value,
                          )
                        }
                      >
                        <span className="fleet-v6-service-check">
                          {weddingOnly && (
                            <Check size={13} />
                          )}
                        </span>

                        <div>
                          <strong>
                            {copy.homeExperience.services[0].top.replace("01 / ", "")}
                          </strong>
                          <small>
                            {copy.homeExperience.services[0].eyebrow}
                          </small>
                        </div>

                        <Sparkles size={15} />
                      </button>

                    </div>

                    <div className="fleet-v6-filter-footer">
                      <div>
                        <strong>
                          {filteredCars.length}
                        </strong>
                        <span>
                          {copy.carsPage.resultSuffix}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setFiltersOpen(false)
                        }
                      >
                        {copy.carsPage.results}
                        <ArrowRight size={14} />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RESULTS BAR */}

          <div className="fleet-v4-results-head">
            <div>
              <span>{copy.carsPage.results}</span>

              <AnimatePresence mode="wait">
                <motion.strong
                  key={filteredCars.length}
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
                    y: -10,
                  }}
                >
                  {String(
                    filteredCars.length,
                  ).padStart(2, "0")}
                </motion.strong>
              </AnimatePresence>

              <small>
                {copy.carsPage.shown}
              </small>
            </div>

            <div className="fleet-v4-sort">
              <button
                type="button"
                onClick={() =>
                  setSortOpen((value) => !value)
                }
              >
                <ArrowUpDown size={13} />

                <span>{sortLabel}</span>

                <ChevronDown
                  size={12}
                  className={
                    sortOpen ? "rotate" : ""
                  }
                />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    className="fleet-v4-sort-menu"
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.22,
                      ease,
                    }}
                  >
                    {[
                      [
                        "recommended",
                        copy.carsPage.sort.recommended,
                      ],
                      [
                        "price-low",
                        copy.carsPage.sort.low,
                      ],
                      [
                        "price-high",
                        copy.carsPage.sort.high,
                      ],
                      ["name", copy.carsPage.sort.name],
                    ].map(([value, label]) => (
                      <button
                        type="button"
                        key={value}
                        className={
                          sort === value
                            ? "active"
                            : ""
                        }
                        onClick={() => {
                          setSort(
                            value as SortType,
                          );
                          setSortOpen(false);
                        }}
                      >
                        <span>{label}</span>

                        {sort === value && (
                          <i />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* =================================================
              VEHICLE GRID
          ================================================= */}

          <LayoutGroup>
            <motion.div
              className="fleet-v4-grid"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredCars.map(
                  (car, index) => {
                    const priceMode: PriceMode =
                      category === "TRANSFER" || transferOnly
                        ? "transfer"
                        : "rental";
                    const price =
                      getDisplayPrice(car, priceMode);

                    const href = priceMode === "transfer"
                      ? `/transfer/${car.slug}`
                      : `/avtomobiller/${car.slug}`;

                    return (
                      <motion.article
                        key={car.id}
                        layout
                        className="fleet-v4-card"
                        initial={{
                          opacity: 0,
                          y: 38,
                          scale: 0.98,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        viewport={{
                          once: true,
                          amount: 0.12,
                          margin:
                            "0px 0px -45px 0px",
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.96,
                        }}
                        transition={{
                          layout: {
                            type: "spring",
                            stiffness: 240,
                            damping: 28,
                          },
                          opacity: {
                            duration: 0.55,
                          },
                          y: {
                            duration: 0.7,
                            delay:
                              (index % 3) *
                              0.055,
                            ease,
                          },
                        }}
                      >
                        <Link
                          href={href}
                          className="fleet-v4-card-link"
                        >
                          <div className="fleet-v4-card-visual">
                            <div className="fleet-v4-card-grid" />
                            <div className="fleet-v4-card-glow" />

                            <div className="fleet-v4-card-top">
                              <div>
                                <span>
                                  {copy.carsPage.categories[car.category as keyof typeof copy.carsPage.categories] ?? car.category}
                                </span>

                                {car.transferAvailable && (
                                  <span className="fleet-v4-transfer-badge">
                                    {copy.car.transfer}
                                  </span>
                                )}
                              </div>

                              <small>
                                {String(
                                  index + 1,
                                ).padStart(
                                  2,
                                  "0",
                                )}
                              </small>
                            </div>

                            <motion.div
                              className="fleet-v4-image"
                              whileHover={{
                                scale: 1.045,
                                y: -3,
                              }}
                              transition={{
                                duration: 0.7,
                                ease,
                              }}
                            >
                              <Image
                                src={
                                  car.thumbnail
                                }
                                alt={car.title}
                                fill
                                priority={
                                  index < 3
                                }
                                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                              />
                            </motion.div>

                            <motion.span
                              className="fleet-v4-open"
                              whileHover={{
                                scale: 1.08,
                                rotate: -4,
                              }}
                              whileTap={{
                                scale: 0.94,
                              }}
                            >
                              <ArrowRight
                                size={15}
                              />
                            </motion.span>

                            <div className="fleet-v4-card-watermark">
                              {car.brand}
                            </div>
                          </div>

                          <div className="fleet-v4-card-body">
                            <div className="fleet-v4-card-title">
                              <div>
                                <span>
                                  {car.brand}
                                </span>

                                <h2>
                                  {car.title}
                                </h2>
                              </div>

                              <div className="fleet-v4-price">
                                {price !== null ? (
                                  <>
                                    <strong>
                                      {price} ₼
                                    </strong>
                                    <span>
                                      {priceMode === "transfer"
                                        ? copy.car.transfer
                                        : copy.carsPage.perDay}
                                    </span>
                                  </>
                                ) : (
                                  <strong>
                                    {copy.carsPage.request}
                                  </strong>
                                )}
                              </div>
                            </div>

                            {car.variants?.length ? (
                              <div className="fleet-v4-variants">
                                {car.variants.slice(0, 3).map((variant) => (
                                  <span key={variant.id}>
                                    {[
                                      variant.manufactureYear,
                                      variant.bodyStyle,
                                    ]
                                      .filter(Boolean)
                                      .join(" / ") || variant.label}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            <div className="fleet-v4-specs">
                              {car.seats !==
                                null && (
                                <span>
                                  <Users
                                    size={13}
                                  />
                                  {car.seats} {copy.carsPage.people}
                                </span>
                              )}

                              <span>
                                <Fuel
                                  size={13}
                                />
                                {translateCarValue(car.fuel, locale)}
                              </span>

                              {car.manufactureYear && (
                                <span>
                                  <CalendarDays
                                    size={13}
                                  />
                                  {car.manufactureYear}
                                </span>
                              )}

                              <span>
                                <Settings2
                                  size={13}
                                />
                                {
                                  translateCarValue(car.transmission, locale)
                                }
                              </span>

                              {car.engine && (
                                <span>
                                  <Gauge
                                    size={13}
                                  />
                                  {car.engine}
                                </span>
                              )}

                              {car.baggage !==
                                null && (
                                <span>
                                  <Luggage
                                    size={13}
                                  />
                                  {car.baggage}
                                </span>
                              )}
                            </div>

                            <div className="fleet-v4-card-footer">
                              <span>
                                {copy.carsPage.detail}
                              </span>

                              <span>
                                {copy.carsPage.reserve}
                                <ArrowRight
                                  size={12}
                                />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  },
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          <AnimatePresence>
            {filteredCars.length === 0 && (
              <motion.div
                className="fleet-v4-empty"
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                }}
              >
                <div>
                  <CarFront
                    size={29}
                    strokeWidth={1.2}
                  />
                </div>

                <span>CARBON FINDER</span>

                <h2>
                  {copy.carsPage.emptyTitle}
                </h2>

                <p>
                  {copy.carsPage.emptyText}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  {copy.carsPage.showAll}
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ===================================================
          END EXPERIENCE
      =================================================== */}

      <section className="fleet-v4-tail">
        <div className="fleet-v4-container">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
              ease,
            }}
          >
            <span>
              SEÇİM EDƏ BİLMİRSİNİZ?
            </span>

            <h2>
              Marşrutu deyin.
              <br />
              <em>Avtomobili biz tapaq.</em>
            </h2>

            <Link href="/#contact">
              Carbon ilə əlaqə
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
