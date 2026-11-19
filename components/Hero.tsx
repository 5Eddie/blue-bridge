import { getTranslations } from "next-intl/server";
import HeroControls from "./HeroControls";

export default async function Hero() {
  const t = await getTranslations("hero");
  const tb = await getTranslations("benefits");

  const benefits: string[] = tb.raw("items");

  return (
    <section className="hero" id="top">
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
