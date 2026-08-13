import {getRequestConfig} from "next-intl/server";
import {cookies} from "next/headers";

export const locales = ["az", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "az";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const requestedLocale = cookieStore.get("CARBON_LOCALE")?.value;

  const locale: Locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
