"use client";

import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {Check, ChevronDown} from "lucide-react";
import {
  CarbonLocale,
  useCarbonLanguage,
} from "./CarbonLanguageProvider";

const languages: {
  code: CarbonLocale;
  short: string;
  label: string;
}[] = [
  {
    code: "az",
    short: "AZ",
    label: "Azərbaycan",
  },
  {
    code: "en",
    short: "EN",
    label: "English",
  },
  {
    code: "ru",
    short: "RU",
    label: "Русский",
  },
];

export default function CarbonLanguageSwitcher({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const {locale, setLocale} = useCarbonLanguage();

  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const current =
    languages.find((language) => language.code === locale) ?? languages[0];

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      className={`carbon-language-switcher ${
        mobile ? "carbon-language-switcher-mobile" : ""
      }`}
      ref={wrapperRef}
    >
      <button
        className={mobile ? "carbon-mobile-language" : "language"}
        type="button"
        aria-label="Change language"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {current.short}

        <ChevronDown
          size={mobile ? 12 : 13}
          strokeWidth={1.7}
          className={open ? "is-open" : ""}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="carbon-language-menu"
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -5,
              scale: 0.98,
            }}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {languages.map((language) => {
              const selected = language.code === locale;

              return (
                <button
                  key={language.code}
                  type="button"
                  className={selected ? "is-active" : ""}
                  onClick={() => {
                    setOpen(false);

                    if (!selected) {
                      setLocale(language.code);
                    }
                  }}
                >
                  <span className="carbon-language-code">
                    {language.short}
                  </span>

                  <span className="carbon-language-name">
                    {language.label}
                  </span>

                  {selected && <Check size={13} strokeWidth={2} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
