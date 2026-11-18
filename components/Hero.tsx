import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import HeroControls from "./HeroControls";

export default async function Hero() {
  const t = await getTranslations("hero");
  const tb = await getTranslations("benefits");

  const hasImage = fs.existsSync(
    path.join(process.cwd(), "public", "images", "hero-ger.jpg")
  );

  const benefits: string[] = tb.raw("items");

  return (
    <section className="hero" id="top">
      {hasImage && (
        <Image
          src="/images/hero-ger.jpg"
          alt={t("imageAlt")}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="hero-img"
        />
      )}
      <div className="hero-overlay" aria-hidden="true" />
      <div className="wrap hero-content">
        <h1 className="hero-title">{t("title")}</h1>
        <p className="hero-subtitle">{t("subtitle")}</p>
        <HeroControls />
        <ul className="benefits">
          {benefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
