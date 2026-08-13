import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import {cookies} from "next/headers";
import {NextIntlClientProvider} from "next-intl";
import "./globals.css";
import CarbonFooter from "@/components/CarbonFooter";
import CarbonAutoTranslator from "@/components/CarbonAutoTranslator";
import CarbonLanguageProvider, {
  type CarbonLocale,
} from "@/components/CarbonLanguageProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carbon Rent A Car | Avtomobil İcarəsi",
  description:
    "Bakıda premium və rahat avtomobil icarəsi. Carbon Rent A Car ilə avtomobilinizi asanlıqla seçin.",
};

const locales: CarbonLocale[] = ["az", "en", "ru"];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const requestedLocale = cookieStore.get("CARBON_LOCALE")?.value;

  const locale: CarbonLocale = locales.includes(
    requestedLocale as CarbonLocale
  )
    ? (requestedLocale as CarbonLocale)
    : "az";

  const messages = (
    await import(`../messages/${locale}.json`)
  ).default;

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={poppins.className}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          <CarbonLanguageProvider initialLocale={locale}>
            <CarbonAutoTranslator />
            {children}

            <CarbonFooter />
          </CarbonLanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
