"use client";

import Link from "next/link";
import { useCarbonCopy } from "@/lib/carbon-locale";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  Building2,
  CarFront,
  Check,
  Gem,
  MapPin,
  Plane,
  Sparkles,
} from "lucide-react";
import {
  type MouseEvent,
  useState,
} from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const journeys = [
  {
    id: "city",
    number: "01",
    label: "ŞƏHƏR",
    title: "Gündəlik şəhər",
    description:
      "Bakı daxilində rahat hərəkət, görüşlər və gündəlik planlar üçün balanslı seçim.",
    recommendation: "Sedan / Economy",
    detail: "Rahat • Praktik • Səmərəli",
    href: "/avtomobiller",
    icon: CarFront,
    from: "ŞƏHƏR",
    to: "CARBON",
  },
  {
    id: "business",
    number: "02",
    label: "BİZNES",
    title: "Biznes səfəri",
    description:
      "Görüşlər, qonaqlar və daha ciddi təqdimat tələb edən səfərlər üçün premium seçim.",
    recommendation: "Business / Premium",
    detail: "Premium • Sakit • Təqdimatlı",
    href: "/avtomobiller",
    icon: Building2,
    from: "GÖRÜŞ",
    to: "MƏRKƏZ",
  },
  {
    id: "wedding",
    number: "03",
    label: "XÜSUSİ GÜN",
    title: "Toy və tədbir",
    description:
      "Xüsusi günün vizual atmosferinə uyğun seçilmiş avtomobillərlə daha fərqli giriş.",
    recommendation: "Wedding Collection",
    detail: "Luxury • Statement • Special",
    href: "/toy-avtomobilleri",
    icon: Gem,
    from: "MƏRASİM",
    to: "MƏKAN",
  },
  {
    id: "airport",
    number: "04",
    label: "AEROPORT",
    title: "Hava limanı",
    description:
      "Uçuş vaxtınıza uyğun rahat qarşılanma və şəhərə problemsiz transfer üçün.",
    recommendation: "Transfer Fleet",
    detail: "Vaxtında • Rahat • Birbaşa",
    href: "/avtomobiller",
    icon: Plane,
    from: "GYD",
    to: "BAKI",
  },
  {
    id: "weekend",
    number: "05",
    label: "WEEKEND",
    title: "Həftəsonu",
    description:
      "Şəhərdən çıxmaq, planı dəyişmək və yolu səfərin bir hissəsinə çevirmək üçün.",
    recommendation: "SUV / Premium",
    detail: "Comfort • Space • Escape",
    href: "/avtomobiller",
    icon: Sparkles,
    from: "BAKI",
    to: "YOL",
  },
];

export default function CarbonSignature() {
  const { copy } = useCarbonCopy();
  const localizedJourneys = journeys.map((journey, index) => ({
    ...journey,
    ...copy.signature.journeys[index],
  }));
  const [active, setActive] = useState(0);
  const item = localizedJourneys[active];
  const Icon = item.icon;

  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const routeX = useTransform(progress, [0, 1], ["0%", "100%"]);

  function handlePointerMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    pointerX.set(
      ((event.clientX - rect.left) / rect.width) * 100
    );

    pointerY.set(
      ((event.clientY - rect.top) / rect.height) * 100
    );
  }

  return (
    <>
      <motion.div
        className="carbon-scroll-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <section
        className="carbon-signature"
        onMouseMove={handlePointerMove}
      >
        <motion.div
          className="carbon-signature-pointer"
          style={{
            left: useTransform(pointerX, (v) => `${v}%`),
            top: useTransform(pointerY, (v) => `${v}%`),
          }}
          aria-hidden="true"
        />

        <div className="carbon-signature-grid" aria-hidden="true" />

        <div className="carbon-signature-inner">
          <motion.div
            className="carbon-signature-head"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease }}
          >
            <div>
              <span className="carbon-signature-kicker">
                {copy.signature.kicker}
              </span>

              <h2>
                {copy.signature.heading1}
                <br />
                <em>{copy.signature.heading2}</em>
              </h2>
            </div>

            <div className="carbon-signature-head-side">
              <span>04</span>

              <p>
                {copy.signature.intro}
              </p>
            </div>
          </motion.div>

          <div className="carbon-concierge">
            <div className="carbon-concierge-nav">
              {localizedJourneys.map((journey, index) => {
                const JourneyIcon = journey.icon;
                const selected = index === active;

                return (
                  <button
                    type="button"
                    key={journey.id}
                    className={selected ? "active" : ""}
                    onClick={() => setActive(index)}
                  >
                    {selected && (
                      <motion.span
                        className="carbon-concierge-active"
                        layoutId="carbon-concierge-active"
                        transition={{
                          type: "spring",
                          stiffness: 360,
                          damping: 34,
                        }}
                      />
                    )}

                    <span className="carbon-concierge-nav-index">
                      {journey.number}
                    </span>

                    <span className="carbon-concierge-nav-main">
                      <JourneyIcon
                        size={18}
                        strokeWidth={1.35}
                      />

                      <strong>{journey.label}</strong>
                    </span>

                    <ArrowRight
                      className="carbon-concierge-nav-arrow"
                      size={15}
                      strokeWidth={1.4}
                    />
                  </button>
                );
              })}
            </div>

            <div className="carbon-concierge-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id}
                  className="carbon-concierge-stage-content"
                  initial={{
                    opacity: 0,
                    y: 18,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -12,
                    filter: "blur(6px)",
                  }}
                  transition={{
                    duration: 0.45,
                    ease,
                  }}
                >
                  <div className="carbon-concierge-stage-top">
                    <span>
                      {copy.signature.selection} / {item.number}
                    </span>

                    <span className="carbon-concierge-status">
                      <i />
                      {copy.signature.match}
                    </span>
                  </div>

                  <div className="carbon-concierge-icon">
                    <Icon size={27} strokeWidth={1.2} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <div className="carbon-concierge-match">
                    <span>{copy.signature.recommended}</span>

                    <strong>{item.recommendation}</strong>

                    <small>
                      <Check size={13} strokeWidth={1.7} />
                      {item.detail}
                    </small>
                  </div>

                  <Link
                    href={item.href}
                    className="carbon-concierge-cta"
                  >
                    {copy.signature.action}

                    <span>
                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                      />
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>

              <div className="carbon-route">
                <div className="carbon-route-meta">
                  <span>
                    <MapPin size={13} strokeWidth={1.4} />
                    {item.from}
                  </span>

                  <span>{item.to}</span>
                </div>

                <div className="carbon-route-track">
                  <motion.div
                    key={`line-${item.id}`}
                    className="carbon-route-line"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 1,
                      delay: 0.1,
                      ease,
                    }}
                  />

                  <motion.div
                    key={`car-${item.id}`}
                    className="carbon-route-car"
                    initial={{ left: "4%" }}
                    animate={{ left: "88%" }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <CarFront size={16} strokeWidth={1.35} />
                  </motion.div>

                  <i className="carbon-route-point carbon-route-point--start" />
                  <i className="carbon-route-point carbon-route-point--end" />
                </div>

                <div className="carbon-route-coordinates">
                  <span>40.4093° N</span>
                  <span>49.8671° E</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="carbon-kinetic" aria-hidden="true">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span>DRIVE</span>
            <i>•</i>
            <span>ARRIVE</span>
            <i>•</i>
            <span>CARBON</span>
            <i>•</i>
            <span>BAKU</span>
            <i>•</i>
            <span>DRIVE</span>
            <i>•</i>
            <span>ARRIVE</span>
            <i>•</i>
            <span>CARBON</span>
            <i>•</i>
            <span>BAKU</span>
            <i>•</i>
          </motion.div>
        </div>

        <motion.div
          className="carbon-page-route"
          style={{ left: routeX }}
          aria-hidden="true"
        />
      </section>
    </>
  );
}
