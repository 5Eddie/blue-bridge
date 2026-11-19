"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import useDemoUser from "./useDemoUser";
import styles from "./about-membership.module.css";

type Feature = { icon: string; title: string; text: string };
type Step = { title: string; text: string };
type Stat = { value: string; label: string };

export default function AboutSection() {
  const t = useTranslations("about");
  const user = useDemoUser();
  const rawFeatures = t.raw("features");
  const rawSteps = t.raw("steps");
  const rawStats = t.raw("stats");
  const features = Array.isArray(rawFeatures) ? rawFeatures as Feature[] : [];
  const steps = Array.isArray(rawSteps) ? rawSteps as Step[] : [];
  const stats = Array.isArray(rawStats) ? rawStats as Stat[] : [];
  const dairyHref = user ? "/listings" : "/login?mode=signup&plan=free&role=buyer";
  const staysHref = user ? "/stories" : "/login?mode=signup&plan=free&role=tourist";

  return (
    <section className={styles.about} id="about" aria-labelledby="about-title">
      <div className="wrap">
        <header className={styles.aboutHeader}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h2 id="about-title">{t("title")}</h2>
          <p>{t("intro")}</p>
        </header>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <span className={styles.featureIcon} aria-hidden="true">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>

        <section className={styles.process} id="how" aria-labelledby="how-title">
          <div className={styles.processHeading}>
            <span className={styles.eyebrow}>{t("processEyebrow")}</span>
            <h3 id="how-title">{t("processTitle")}</h3>
          </div>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li className={styles.step} key={step.title}>
                <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className={styles.stats} aria-label={t("statsLabel")}>
          {stats.map((stat) => (
            <div className={styles.stat} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.aboutCta}>
          <p>{t("ctaText")}</p>
          <div className={styles.ctaButtons}>
            <Link className={styles.primaryCta} href={dairyHref}>{t("dairyCta")}</Link>
            <Link className={styles.secondaryCta} href={staysHref}>{t("staysCta")}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
