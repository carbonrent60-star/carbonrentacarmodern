"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CarbonLocale = "az" | "en" | "ru";

const VALID_LOCALES: CarbonLocale[] = ["az", "en", "ru"];

type LanguageContextValue = {
  locale: CarbonLocale;
  setLocale: (locale: CarbonLocale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLocale(initialLocale: CarbonLocale): CarbonLocale {
  if (typeof document === "undefined") return initialLocale;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("CARBON_LOCALE="));

  const value = match?.split("=")[1];

  return VALID_LOCALES.includes(value as CarbonLocale)
    ? (value as CarbonLocale)
    : initialLocale;
}

export default function CarbonLanguageProvider({
  children,
  initialLocale = "az",
}: {
  children: React.ReactNode;
  initialLocale?: CarbonLocale;
}) {
  const [locale, setLocaleState] = useState<CarbonLocale>(() =>
    getInitialLocale(initialLocale)
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: CarbonLocale) => {
    document.cookie = `CARBON_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = nextLocale;

    setLocaleState(nextLocale);

    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useCarbonLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useCarbonLanguage must be used inside CarbonLanguageProvider"
    );
  }

  return context;
}
