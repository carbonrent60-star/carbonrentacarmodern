"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CarFront,
  ChevronDown,
  Fuel,
  Gauge,
  Luggage,
  Menu,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { cars, type CarCategory } from "@/data/cars";

import CarbonNavbar from "@/components/CarbonNavbar";
type CategoryFilter = "Hamısı" | CarCategory | "TRANSFER";
type SortType =
  | "recommended"
  | "price-low"
  | "price-high"
  | "name";

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

const brands = Array.from(new Set(cars.map((car) => car.brand))).sort();

function getPrice(car: (typeof cars)[number]) {
  const prices = [
    car.rentalPrices.days1to3,
    car.rentalPrices.days4to7,
    car.rentalPrices.days8to15,
    car.rentalPrices.days16to24,
    car.rentalPrices.days25to30,
    car.rentalPrices.days30plus,
  ].filter((price): price is number => typeof price === "number");

  return prices.length ? Math.min(...prices) : null;
}

function getDisplayPrice(car: (typeof cars)[number]) {
  return (
    car.rentalPrices.days1to3 ??
    car.rentalPrices.days4to7 ??
    car.rentalPrices.days8to15 ??
    car.rentalPrices.days16to24 ??
    car.rentalPrices.days25to30 ??
    car.rentalPrices.days30plus
  );
}

export default function CarsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<CategoryFilter>("Hamısı");
  const [selectedBrand, setSelectedBrand] = useState("Hamısı");
  const [fuel, setFuel] = useState("Hamısı");
  const [transferOnly, setTransferOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortType>("recommended");
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredCars = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("az");

    const result = cars.filter((car) => {
      const matchesSearch =
        !query ||
        car.title.toLocaleLowerCase("az").includes(query) ||
        car.brand.toLocaleLowerCase("az").includes(query) ||
        car.category.toLocaleLowerCase("az").includes(query);

      const matchesCategory =
        category === "Hamısı" ||
        (category === "TRANSFER"
          ? car.transferAvailable
          : car.category === category);

      const matchesBrand =
        selectedBrand === "Hamısı" ||
        car.brand === selectedBrand;

      const matchesFuel =
        fuel === "Hamısı" || car.fuel === fuel;

      const matchesTransfer =
        !transferOnly || car.transferAvailable;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesFuel &&
        matchesTransfer
      );
    });

    return [...result].sort((a, b) => {
      const aPrice = getPrice(a) ?? Number.MAX_SAFE_INTEGER;
      const bPrice = getPrice(b) ?? Number.MAX_SAFE_INTEGER;

      if (sort === "price-low") return aPrice - bPrice;
      if (sort === "price-high") return bPrice - aPrice;

      if (sort === "name") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });
  }, [
    search,
    category,
    selectedBrand,
    fuel,
    transferOnly,
    sort,
  ]);

  const activeFilterCount =
    (selectedBrand !== "Hamısı" ? 1 : 0) +
    (fuel !== "Hamısı" ? 1 : 0) +
    (transferOnly ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setCategory("Hamısı");
    setSelectedBrand("Hamısı");
    setFuel("Hamısı");
    setTransferOnly(false);
    setSort("recommended");
  }

  const sortLabel =
    sort === "price-low"
      ? "Qiymət: aşağıdan"
      : sort === "price-high"
        ? "Qiymət: yuxarıdan"
        : sort === "name"
          ? "Ada görə"
          : "Tövsiyə edilən";

  return (
    <main className="catalog-page catalog-v2">
      <CarbonNavbar light active="cars" />
      

      <section className="catalog-hero catalog-v2-hero">
        <div className="catalog-hero-inner">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link href="/" className="catalog-back">
              <ArrowLeft size={13} />
              Ana səhifəyə qayıt
            </Link>
          </motion.div>

          <div className="catalog-v2-heading">
            <div>
              <motion.span
                className="catalog-kicker"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.12,
                }}
              >
                CARBON COLLECTION
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Sizin üçün
                <span> seçilmiş.</span>
              </motion.h1>
            </div>

            <motion.div
              className="catalog-v2-intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.3,
              }}
            >
              <div className="catalog-intro-icon">
                <Sparkles size={16} strokeWidth={1.5} />
              </div>

              <p>
                Şəhər avtomobillərindən premium modellərə qədər.
                Səyahətinizə uyğun avtomobili rahatlıqla seçin.
              </p>

              <div className="catalog-intro-meta">
                <span>
                  <strong>{cars.length}</strong>
                  avtomobil
                </span>

                <span>
                  <strong>{brands.length}</strong>
                  marka
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="catalog-content catalog-v2-content">
        <motion.div
          className="catalog-control-shell"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="catalog-controls catalog-v2-controls">
            <motion.div
              className="catalog-search catalog-v2-search"
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 28,
              }}
            >
              <Search size={15} strokeWidth={1.6} />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Marka və ya model axtar..."
                aria-label="Avtomobil axtar"
              />

              <AnimatePresence>
                {search && (
                  <motion.button
                    type="button"
                    aria-label="Axtarışı təmizlə"
                    onClick={() => setSearch("")}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            <LayoutGroup id="carbon-categories">
              <div className="category-tabs catalog-v2-tabs">
                {categories.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {category === item && (
                      <motion.span
                        className="category-active-bg"
                        layoutId="category-active"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}

                    <span className="category-label">{item}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>

            <button
              type="button"
              className={`filter-toggle catalog-v2-filter ${
                filtersOpen ? "active" : ""
              }`}
              onClick={() => setFiltersOpen((value) => !value)}
            >
              <SlidersHorizontal size={14} />

              <span>Filtrlər</span>

              {activeFilterCount > 0 && (
                <motion.i
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {activeFilterCount}
                </motion.i>
              )}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                className="filter-panel catalog-v2-panel"
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
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="catalog-filter-inner">
                  <div className="filter-group">
                    <span>Marka</span>

                    <div className="brand-filter">
                      {["Hamısı", ...brands].map((brand) => (
                        <button
                          type="button"
                          key={brand}
                          className={
                            selectedBrand === brand ? "active" : ""
                          }
                          onClick={() => setSelectedBrand(brand)}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="catalog-filter-row">
                    <div className="filter-group">
                      <span>Yanacaq</span>

                      <div className="brand-filter">
                        {["Hamısı", "Benzin", "Dizel"].map(
                          (item) => (
                            <button
                              type="button"
                              key={item}
                              className={
                                fuel === item ? "active" : ""
                              }
                              onClick={() => setFuel(item)}
                            >
                              {item}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="filter-group">
                      <span>Xidmət</span>

                      <button
                        type="button"
                        className={`catalog-transfer-switch ${
                          transferOnly ? "active" : ""
                        }`}
                        onClick={() =>
                          setTransferOnly((value) => !value)
                        }
                      >
                        <span className="switch-track">
                          <motion.i
                            animate={{
                              x: transferOnly ? 17 : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 30,
                            }}
                          />
                        </span>

                        Transfer mövcuddur
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="clear-filters catalog-v2-clear"
                    onClick={clearFilters}
                  >
                    <X size={13} />
                    Bütün filtrləri sıfırla
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="catalog-results-head catalog-v2-results">
          <div className="catalog-result-count">
            <AnimatePresence mode="wait">
              <motion.strong
                key={filteredCars.length}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {String(filteredCars.length).padStart(2, "0")}
              </motion.strong>
            </AnimatePresence>

            <span>avtomobil tapıldı</span>
          </div>

          <div className="catalog-sort">
            <button
              type="button"
              className={sortOpen ? "active" : ""}
              onClick={() => setSortOpen((value) => !value)}
            >
              <ArrowUpDown size={13} />
              <span>{sortLabel}</span>
              <ChevronDown
                size={12}
                className={sortOpen ? "rotate" : ""}
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  className="catalog-sort-menu"
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
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {[
                    ["recommended", "Tövsiyə edilən"],
                    ["price-low", "Qiymət: aşağıdan"],
                    ["price-high", "Qiymət: yuxarıdan"],
                    ["name", "Ada görə"],
                  ].map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={sort === value ? "active" : ""}
                      onClick={() => {
                        setSort(value as SortType);
                        setSortOpen(false);
                      }}
                    >
                      {label}

                      {sort === value && <span>•</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <LayoutGroup>
          <motion.div
            className="catalog-grid catalog-v2-grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car, index) => {
                const price = getDisplayPrice(car);

                return (
                  <motion.article
                    layout
                    key={car.id}
                    className="catalog-card catalog-v2-card"
                    initial={{
                      opacity: 0,
                      y: 34,
                      scale: 0.975,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.12,
                      margin: "0px 0px -40px 0px",
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                      transition: {
                        duration: 0.18,
                      },
                    }}
                    transition={{
                      layout: {
                        type: "spring",
                        stiffness: 240,
                        damping: 28,
                      },
                      opacity: {
                        duration: 0.55,
                        delay: (index % 3) * 0.07,
                      },
                      y: {
                        duration: 0.7,
                        delay: (index % 3) * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      scale: {
                        duration: 0.7,
                        delay: (index % 3) * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                  >
                    <motion.div
                      className="catalog-card-motion"
                      whileHover={{ y: -6 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <Link
                        href={
                          category === "TRANSFER" || transferOnly
                            ? `/transfer/${car.slug}`
                            : `/avtomobiller/${car.slug}`
                        }
                        className="catalog-card-visual catalog-v2-visual"
                      >
                        <div className="catalog-card-badges">
                          <span>{car.category}</span>

                          {car.transferAvailable && (
                            <span className="dark">
                              Transfer
                            </span>
                          )}
                        </div>

                        <motion.div
                          className="catalog-car-image-wrap"
                          whileHover={{
                            scale: 1.035,
                          }}
                          transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Image
                            src={car.thumbnail}
                            alt={car.title}
                            fill
                            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                            className="catalog-v2-car-image"
                          />
                        </motion.div>

                        <motion.span
                          className="catalog-open"
                          whileHover={{
                            scale: 1.08,
                            rotate: -4,
                          }}
                          whileTap={{ scale: 0.94 }}
                        >
                          <ArrowRight size={15} />
                        </motion.span>

                        <div className="catalog-card-number">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </Link>

                      <div className="catalog-card-info">
                        <div className="catalog-card-title">
                          <div>
                            <span>{car.brand}</span>

                            <h2>{car.title}</h2>
                          </div>

                          <div className="catalog-price">
                            {price !== null ? (
                              <>
                                <strong>{price} ₼</strong>
                                <span>/ gün</span>
                              </>
                            ) : (
                              <span>Sorğu ilə</span>
                            )}
                          </div>
                        </div>

                        <div className="catalog-v2-specs">
                          {car.seats !== null && (
                            <span>
                              <Users size={13} strokeWidth={1.5} />
                              {car.seats} nəfər
                            </span>
                          )}

                          <span>
                            <Fuel size={13} strokeWidth={1.5} />
                            {car.fuel}
                          </span>

                          <span>
                            <Settings2
                              size={13}
                              strokeWidth={1.5}
                            />
                            {car.transmission}
                          </span>

                          {car.engine && (
                            <span>
                              <Gauge size={13} strokeWidth={1.5} />
                              {car.engine}
                            </span>
                          )}

                          {car.baggage !== null && (
                            <span>
                              <Luggage size={13} strokeWidth={1.5} />
                              {car.baggage}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <AnimatePresence>
          {filteredCars.length === 0 && (
            <motion.div
              className="catalog-empty catalog-v2-empty"
              initial={{
                opacity: 0,
                y: 20,
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
              <div className="catalog-empty-icon">
                <CarFront size={25} strokeWidth={1.25} />
              </div>

              <span>HEÇ BİR NƏTİCƏ YOXDUR</span>

              <h2>Avtomobil tapılmadı.</h2>

              <p>
                Axtarış sözünü dəyişin və ya aktiv filtrləri
                sıfırlayın.
              </p>

              <motion.button
                type="button"
                onClick={clearFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Bütün avtomobilləri göstər
                <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
