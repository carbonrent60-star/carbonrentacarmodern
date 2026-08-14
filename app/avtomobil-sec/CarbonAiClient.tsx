"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Crown,
  GitCompare,
  Fuel,
  Gauge,
  Luggage,
  MapPin,
  MessageSquareText,
  RotateCcw,
  Search,
  Sparkles,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import type {
  ConciergeIntent,
  ConciergeResponse,
  ConciergeResult,
} from "@/lib/carbon-ai";

import { runCarbonAiAction } from "./actions";

const ease = [0.22, 1, 0.36, 1] as const;

const examples = [
  "4 nəfərik, 5 günlük rahat maşın axtarırıq",
  "Sabah hava limanından Sea Breeze-ə getməliyəm",
  "Toy üçün ağ və premium avtomobil istəyirəm",
  "Ailəmlə Qəbələyə gedəcəyəm, böyük baqaj lazımdır",
];

const chips: Array<{
  label: string;
  message: string;
  index: string;
}> = [
  {
    index: "01",
    label: "Ailə səfəri",
    message: "Ailə üçün geniş və rahat avtomobil istəyirəm",
  },
  {
    index: "02",
    label: "Hava limanı",
    message:
      "Hava limanından transfer lazımdır, maşın sürmək istəmirəm",
  },
  {
    index: "03",
    label: "Toy günü",
    message: "Toy üçün premium ağ avtomobil istəyirəm",
  },
  {
    index: "04",
    label: "Sərfəli seçim",
    message: "Büdcəmə uyğun sərfəli avtomobil axtarıram",
  },
];

function serviceLabel(serviceType?: ConciergeIntent["serviceType"]) {
  switch (serviceType) {
    case "wedding":
      return "Toy";
    case "transfer":
      return "Transfer";
    case "rental_transfer":
      return "İcarə + transfer";
    case "rental":
      return "İcarə";
    default:
      return "Açıq";
  }
}

function IntentSummary({
  intent,
}: {
  intent?: ConciergeIntent;
}) {
  const items = [
    {
      icon: CarFront,
      label: "Xidmət",
      value: serviceLabel(intent?.serviceType),
    },
    {
      icon: Users,
      label: "Sərnişin",
      value: intent?.passengers
        ? `${intent.passengers} nəfər`
        : "Açıq",
    },
    {
      icon: CalendarDays,
      label: "Müddət",
      value: intent?.rentalDays
        ? `${intent.rentalDays} gün`
        : "Açıq",
    },
    {
      icon: MapPin,
      label: "Marşrut",
      value:
        intent?.destination ??
        intent?.pickupLocation ??
        "Seçilməyib",
    },
  ];

  return (
    <div
      className="carbon-ai-intent-strip"
      aria-label="Seçim xülasəsi"
    >
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            className="carbon-ai-intent-cell"
            key={item.label}
          >
            <span className="carbon-ai-intent-index">
              0{index + 1}
            </span>

            <Icon size={17} strokeWidth={1.45} />

            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MatchScore({
  score,
}: {
  score: number;
}) {
  return (
    <div className="carbon-ai-match">
      <span>MATCH</span>

      <strong>
        {score}
        <small>%</small>
      </strong>
    </div>
  );
}

function ResultCard({
  result,
  featured = false,
  index = 0,
}: {
  result: ConciergeResult;
  featured?: boolean;
  index?: number;
}) {
  const baggage = [
    result.car.baggage
      ? `${result.car.baggage} böyük`
      : null,
    result.car.smallBaggage
      ? `${result.car.smallBaggage} kiçik`
      : null,
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <motion.article
      className={`carbon-ai-result ${
        featured ? "is-featured" : ""
      }`}
      initial={{
        opacity: 0,
        y: 48,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.82,
        delay: index * 0.07,
        ease,
      }}
    >
      <div className="carbon-ai-result-media">
        <div className="carbon-ai-result-media-top">
          <span>
            {featured
              ? "CARBON SEÇİMİ"
              : `ALTERNATİV 0${index + 1}`}
          </span>

          <MatchScore score={result.score} />
        </div>

        <Image
          src={result.car.thumbnail}
          alt={result.car.title}
          fill
          sizes={
            featured
              ? "(max-width: 900px) 100vw, 760px"
              : "(max-width: 900px) 100vw, 500px"
          }
        />

        <div className="carbon-ai-result-media-foot">
          <span>{result.car.brand}</span>

          <span>
            {result.car.manufactureYear ?? "CARBON"}
          </span>
        </div>
      </div>

      <div className="carbon-ai-result-body">
        <div className="carbon-ai-result-heading">
          <div>
            <span>{result.level}</span>

            <h2>{result.car.title}</h2>
          </div>

          <span className="carbon-ai-result-category">
            {result.car.category}
          </span>
        </div>

        <div className="carbon-ai-spec-grid">
          <div>
            <Users size={18} strokeWidth={1.45} />
            <span>OTURACAQ</span>
            <strong>
              {result.car.seats ?? "—"} yer
            </strong>
          </div>

          <div>
            <Luggage size={18} strokeWidth={1.45} />
            <span>BAQAJ</span>
            <strong>{baggage || "—"}</strong>
          </div>

          <div>
            <BadgeCheck size={18} strokeWidth={1.45} />
            <span>TRANSMİSSİYA</span>
            <strong>{result.car.transmission}</strong>
          </div>

          <div>
            <Fuel size={18} strokeWidth={1.45} />
            <span>YANACAQ</span>
            <strong>{result.car.fuel || "—"}</strong>
          </div>

          <div>
            <Gauge size={18} strokeWidth={1.45} />
            <span>MÜHƏRRİK</span>
            <strong>{result.car.engine || "—"}</strong>
          </div>

          <div>
            <CalendarDays size={18} strokeWidth={1.45} />
            <span>İL</span>
            <strong>
              {result.car.manufactureYear ?? "—"}
            </strong>
          </div>
        </div>

        <div className="carbon-ai-price-row">
          <div className="carbon-ai-price-copy">
            <span>CARBON QİYMƏTİ</span>
            <small>
              Seçilmiş xidmət və müddətə əsasən
            </small>
          </div>

          <div className="carbon-ai-price-value">
            <i>START</i>
            <strong>{result.priceLabel}</strong>
          </div>
        </div>

        {result.ai ? (
          <div className="carbon-ai-verdict">
            <div className="carbon-ai-verdict-head">
              <div className="carbon-ai-verdict-icon">
                <Sparkles
                  size={18}
                  strokeWidth={1.45}
                />
              </div>

              <div>
                <span>CARBON AI VERDİKTİ</span>
                <strong>{result.ai.bestFor}</strong>
              </div>

              <div className="carbon-ai-verdict-score">
                <small>FIT</small>
                <b>{result.score}%</b>
              </div>
            </div>

            <p className="carbon-ai-verdict-text">
              {result.ai.verdict}
            </p>

            <div className="carbon-ai-insight-grid">
              <div>
                <span>ƏSAS ÜSTÜNLÜK</span>
                <strong>
                  {result.ai.mainAdvantage}
                </strong>
              </div>

              <div>
                <span>BÜDCƏ</span>
                <strong>
                  {result.ai.budgetFit}
                </strong>
              </div>

              <div>
                <span>TUTUM</span>
                <strong>
                  {result.ai.spaceFit}
                </strong>
              </div>

              <div>
                <span>SƏFƏRƏ UYĞUNLUQ</span>
                <strong>
                  {result.ai.tripFit}
                </strong>
              </div>
            </div>

            <div className="carbon-ai-tradeoff">
              <span>NƏZƏRƏ ALIN</span>
              <p>{result.ai.tradeOff}</p>
            </div>
          </div>
        ) : null}

        <div className="carbon-ai-reasons">
          <div className="carbon-ai-mini-heading">
            <span>FAKTİKİ UYĞUNLUQ</span>
            <strong>Carbon sıralamasının səbəbləri</strong>
          </div>

          <div className="carbon-ai-reason-list">
            {result.reasons
              .slice(0, featured ? 4 : 3)
              .map((reason, reasonIndex) => (
                <div key={reason}>
                  <span>
                    0{reasonIndex + 1}
                  </span>

                  <CheckCircle2
                    size={16}
                    strokeWidth={1.6}
                  />

                  <p>{reason}</p>
                </div>
              ))}

            {result.warnings
              .slice(0, 2)
              .map((warning) => (
                <div
                  className="is-warning"
                  key={warning}
                >
                  <span>!</span>
                  <p>{warning}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="carbon-ai-result-actions">
          <Link href={result.detailHref}>
            <span>Ətraflı bax</span>
            <ArrowRight
              size={16}
              strokeWidth={1.45}
            />
          </Link>

          <Link href={result.bookingHref}>
            <span>Rezervasiya et</span>
            <ArrowRight
              size={16}
              strokeWidth={1.45}
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function CompareTable({
  results,
}: {
  results: ConciergeResult[];
}) {
  const items = results.slice(0, 2);

  if (items.length < 2) return null;

  const baggageLabel = (item: ConciergeResult) => {
    const large = item.car.baggage ?? 0;
    const small = item.car.smallBaggage ?? 0;

    if (!large && !small) return "—";

    return [
      large ? `${large} böyük` : null,
      small ? `${small} kiçik` : null,
    ]
      .filter(Boolean)
      .join(" + ");
  };

  const rows = [
    {
      label: "Uyğunluq",
      values: items.map(
        (item) => `${item.score}%`,
      ),
    },
    {
      label: "Qiymət",
      values: items.map(
        (item) => item.priceLabel,
      ),
    },
    {
      label: "Ən uyğun",
      values: items.map(
        (item) =>
          item.ai?.bestFor ?? item.level,
      ),
    },
    {
      label: "Oturacaq",
      values: items.map(
        (item) =>
          item.car.seats
            ? `${item.car.seats} yer`
            : "—",
      ),
    },
    {
      label: "Baqaj",
      values: items.map(baggageLabel),
    },
    {
      label: "Transmissiya",
      values: items.map(
        (item) =>
          item.car.transmission || "—",
      ),
    },
    {
      label: "Yanacaq",
      values: items.map(
        (item) => item.car.fuel || "—",
      ),
    },
    {
      label: "Mühərrik",
      values: items.map(
        (item) => item.car.engine || "—",
      ),
    },
    {
      label: "Buraxılış ili",
      values: items.map(
        (item) =>
          item.car.manufactureYear
            ? String(
                item.car.manufactureYear,
              )
            : "—",
      ),
    },
    {
      label: "AI fərqi",
      values: items.map(
        (item) =>
          item.ai?.comparisonNote ??
          item.reasons[0] ??
          "—",
      ),
    },
  ];

  return (
    <motion.section
      className="carbon-ai-compare carbon-ai-compare-v2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.68,
        ease,
      }}
    >
      <div className="carbon-ai-module-index">
        03
      </div>

      <div className="carbon-ai-compare-head">
        <div>
          <span>CARBON DECISION MATRIX</span>

          <h2>
            Yan-yana bax.
            <br />
            <em>Fərqi gör.</em>
          </h2>
        </div>

        <GitCompare
          size={31}
          strokeWidth={1.15}
        />
      </div>

      <div className="carbon-ai-compare-cars">
        {items.map((item, index) => (
          <article key={item.car.id}>
            <div className="carbon-ai-compare-rank">
              0{index + 1}
            </div>

            <span>
              {item.score}% UYĞUNLUQ
            </span>

            <strong>{item.car.title}</strong>

            <small>
              {item.ai?.bestFor ??
                item.car.category}
            </small>
          </article>
        ))}
      </div>

      <div className="carbon-ai-table-wrap">
        <table>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>

                {row.values.map(
                  (value, index) => (
                    <td
                      key={`${row.label}-${items[index].car.id}`}
                    >
                      {value}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="carbon-ai-compare-verdicts">
        {items.map((item, index) => (
          <article key={item.car.id}>
            <span>
              CARBON AI / 0{index + 1}
            </span>

            <p>
              {item.ai?.verdict ??
                item.reasons[0] ??
                "Uyğun seçimdir."}
            </p>

            <Link href={item.detailHref}>
              Avtomobilə bax
              <ArrowRight
                size={15}
                strokeWidth={1.4}
              />
            </Link>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default function CarbonAiClient() {
  const [message, setMessage] = useState("");
  const [intent, setIntent] =
    useState<ConciergeIntent | undefined>();

  const [response, setResponse] =
    useState<ConciergeResponse | null>(null);

  const [history, setHistory] = useState<
    string[]
  >([]);

  const [isPending, startTransition] =
    useTransition();

  const placeholder = examples[0];

  function run(
    nextMessage?: string,
    patch?: Partial<ConciergeIntent>,
  ) {
    const text = nextMessage ?? message;

    startTransition(async () => {
      const next = await runCarbonAiAction({
        message: text,
        currentIntent: intent,
        patch,
      });

      setIntent(next.intent);
      setResponse(next);

      if (text.trim()) {
        setHistory((items) =>
          [...items, text.trim()].slice(-4),
        );
      }

      setMessage("");
    });
  }

  function reset() {
    setMessage("");
    setIntent(undefined);
    setResponse(null);
    setHistory([]);
  }

  return (
    <main className="carbon-ai-page">
      {/* HERO */}
      <section className="carbon-ai-hero">
        <div className="carbon-ai-shell">
          <div className="carbon-ai-hero-meta">
            <span>
              <i />
              CARBON INTELLIGENCE
            </span>

            <span>AI / CONCIERGE / 001</span>
          </div>

          <div className="carbon-ai-hero-layout">
            <motion.div
              className="carbon-ai-copy"
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.95,
                ease,
              }}
            >
              <span className="carbon-ai-kicker">
                SİZ DEYİN. BİZ TAPAQ.
              </span>

              <h1>
                Səfərinizə
                <br />
                uyğun avtomobil.
                <br />
                <em>Bir neçə saniyədə.</em>
              </h1>

              <p>
                Planınızı sadəcə yazın. Carbon
                real avtomobil parkını, qiymətləri,
                tutumu və xidmət növlərini analiz
                edib sizə ən uyğun variantları
                seçəcək.
              </p>
            </motion.div>

            <motion.div
              className="carbon-ai-hero-side"
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease,
              }}
            >
              <div>
                <span>01</span>
                <strong>Planınızı yazın</strong>
              </div>

              <div>
                <span>02</span>
                <strong>
                  Carbon parkı analiz etsin
                </strong>
              </div>

              <div>
                <span>03</span>
                <strong>
                  Ən uyğun seçimi götürün
                </strong>
              </div>
            </motion.div>
          </div>

          <div className="carbon-ai-proof-bar">
            <span>
              <Crown
                size={16}
                strokeWidth={1.4}
              />
              Premium seçim
            </span>

            <span>
              <SlidersHorizontal
                size={16}
                strokeWidth={1.4}
              />
              Real park
            </span>

            <span>
              <BadgeCheck
                size={16}
                strokeWidth={1.4}
              />
              Real qiymətlər
            </span>
          </div>
        </div>
      </section>

      {/* CONSOLE */}
      <section className="carbon-ai-studio">
        <div className="carbon-ai-shell">
          <div className="carbon-ai-studio-grid">
            <div className="carbon-ai-studio-aside">
              <span className="carbon-ai-section-no">
                01
              </span>

              <p>CARBON CONCIERGE</p>

              <h2>
                Nə
                <br />
                lazımdır?
              </h2>

              <span>
                Detalları adi dildə yazın.
                Sistem qalanını anlayacaq.
              </span>
            </div>

            <motion.section
              className="carbon-ai-console"
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.18,
                ease,
              }}
            >
              <div className="carbon-ai-console-head">
                <div>
                  <MessageSquareText
                    size={18}
                    strokeWidth={1.35}
                  />

                  <span>
                    SİZİN BRİFİNQ
                  </span>
                </div>

                <span>LIVE</span>
              </div>

              <IntentSummary intent={intent} />

              <form
                className="carbon-ai-form"
                onSubmit={(event) => {
                  event.preventDefault();

                  if (message.trim()) {
                    run();
                  }
                }}
              >
                <label>
                  <span>
                    PLANINIZI YAZIN
                  </span>

                  <textarea
                    value={message}
                    placeholder={placeholder}
                    onChange={(event) =>
                      setMessage(
                        event.target.value,
                      )
                    }
                    rows={5}
                  />
                </label>

                <div className="carbon-ai-chip-grid">
                  {chips.map(
                    (chip, index) => (
                      <motion.button
                        key={chip.label}
                        type="button"
                        onClick={() =>
                          run(chip.message)
                        }
                        initial={{
                          opacity: 0,
                          y: 14,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay:
                            0.28 +
                            index * 0.05,
                          ease,
                        }}
                      >
                        <span>
                          {chip.index}
                        </span>

                        <strong>
                          {chip.label}
                        </strong>

                        <ArrowRight
                          size={15}
                          strokeWidth={1.4}
                        />
                      </motion.button>
                    ),
                  )}
                </div>

                <div className="carbon-ai-console-actions">
                  <button
                    type="submit"
                    disabled={
                      isPending ||
                      !message.trim()
                    }
                  >
                    <Search
                      size={17}
                      strokeWidth={1.5}
                    />

                    <span>
                      Uyğun variantı tap
                    </span>

                    <ArrowRight
                      size={17}
                      strokeWidth={1.5}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      run("", {
                        serviceType:
                          "unknown",
                      })
                    }
                    disabled={isPending}
                  >
                    Suallarla seç
                  </button>

                  {response ? (
                    <button
                      type="button"
                      onClick={reset}
                    >
                      <RotateCcw
                        size={15}
                      />
                      Sıfırla
                    </button>
                  ) : null}
                </div>
              </form>

              {history.length ? (
                <div className="carbon-ai-history">
                  <span>SON SORĞULAR</span>

                  <div>
                    {history.map(
                      (item, index) => (
                        <p key={item}>
                          <span>
                            0{index + 1}
                          </span>

                          {item}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              ) : null}
            </motion.section>
          </div>
        </div>
      </section>

      <section className="carbon-ai-workspace">
        <div className="carbon-ai-shell">
          <AnimatePresence mode="popLayout">
            {isPending ? (
              <motion.div
                key="thinking"
                className="carbon-ai-thinking"
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
                  y: -15,
                }}
              >
                <div className="carbon-ai-thinking-index">
                  AI
                </div>

                <div>
                  <span>
                    CARBON ANALİZ EDİR
                  </span>

                  <strong>
                    Sizə uyğun seçimlər
                    hazırlanır.
                  </strong>

                  <p>
                    Real avtomobillər,
                    qiymətlər və ehtiyacınız
                    yoxlanılır.
                  </p>
                </div>

                <div className="carbon-ai-scan">
                  <i />
                </div>
              </motion.div>
            ) : null}

            {response?.question &&
            !isPending ? (
              <motion.section
                key="question"
                className="carbon-ai-question"
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
                  y: -14,
                }}
                transition={{
                  duration: 0.55,
                  ease,
                }}
              >
                <div className="carbon-ai-question-side">
                  <span>02</span>
                  <SlidersHorizontal
                    size={25}
                    strokeWidth={1.2}
                  />
                </div>

                <div className="carbon-ai-question-main">
                  <span>
                    BİR DETAL DAHA
                  </span>

                  <h2>
                    {response.question.text}
                  </h2>

                  <div className="carbon-ai-question-options">
                    {response.question.options.map(
                      (option, index) => (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() =>
                            run(
                              option.label,
                              option.patch,
                            )
                          }
                        >
                          <span>
                            0{index + 1}
                          </span>

                          <strong>
                            {option.label}
                          </strong>

                          <ArrowRight
                            size={15}
                          />
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {response && !isPending ? (
              <motion.section
                key="results"
                className="carbon-ai-results"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <div className="carbon-ai-results-head">
                  <div>
                    <span>
                      02 / NƏTİCƏ
                    </span>

                    <h2>
                      {response.headline}
                    </h2>
                  </div>

                  <p>
                    {response.summary}
                  </p>
                </div>

                {response.transferSuggestion ? (
                  <motion.article
                    className="carbon-ai-combo"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <span>
                      CARBON COMBINATION
                    </span>

                    <strong>
                      {
                        response
                          .transferSuggestion
                          .label
                      }
                    </strong>

                    <p>
                      {
                        response
                          .transferSuggestion
                          .description
                      }
                    </p>

                    <ArrowRight
                      size={20}
                      strokeWidth={1.4}
                    />
                  </motion.article>
                ) : null}

                {response.results[0] ? (
                  <ResultCard
                    result={
                      response.results[0]
                    }
                    featured
                  />
                ) : null}

                {response.results.length >
                1 ? (
                  <section className="carbon-ai-alternatives">
                    <div className="carbon-ai-alternatives-head">
                      <span>
                        02B / ALTERNATİVLƏR
                      </span>

                      <h2>
                        Eyni ehtiyac.
                        <br />
                        <em>
                          Fərqli xarakter.
                        </em>
                      </h2>
                    </div>

                    <div className="carbon-ai-alternative-grid">
                      {response.results
                        .slice(1)
                        .map(
                          (
                            result,
                            index,
                          ) => (
                            <ResultCard
                              key={
                                result.car
                                  .id
                              }
                              result={
                                result
                              }
                              index={
                                index + 1
                              }
                            />
                          ),
                        )}
                    </div>
                  </section>
                ) : null}

                <CompareTable
                  results={
                    response.results
                  }
                />

                <motion.section
                  className="carbon-ai-refine"
                  initial={{
                    opacity: 0,
                    y: 26,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.62,
                    ease,
                  }}
                >
                  <div className="carbon-ai-refine-number">
                    04
                  </div>

                  <div className="carbon-ai-refine-copy">
                    <span>
                      DƏQİQLƏŞDİR
                    </span>

                    <h2>
                      Daha yaxın
                      <br />
                      <em>bir seçim.</em>
                    </h2>

                    <p>
                      “Bir az daha premium
                      olsun”, “Mercedes
                      istəyirəm” və ya “50
                      manatdan aşağı göstər”.
                    </p>
                  </div>

                  <div className="carbon-ai-refine-field">
                    <input
                      value={message}
                      onChange={(event) =>
                        setMessage(
                          event.target
                            .value,
                        )
                      }
                      placeholder="İstəyinizi dəqiqləşdirin..."
                    />

                    <button
                      type="button"
                      onClick={() => run()}
                      disabled={
                        !message.trim() ||
                        isPending
                      }
                    >
                      Yenilə
                      <ArrowRight
                        size={16}
                      />
                    </button>
                  </div>
                </motion.section>
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}