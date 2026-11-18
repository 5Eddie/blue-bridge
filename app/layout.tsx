import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: ["600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Малчин Шууд – цагаан идээ ба айлын аялал",
  description:
    "Малчнаас шууд цагаан идээ захиалж, малчин айлд зочилж нүүдэлчний ахуйг туулаарай. Дундын худалдаачингүй.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
