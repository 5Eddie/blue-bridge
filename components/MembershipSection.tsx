"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  updateDemoUserPlan,
  type DemoPlan,
} from "@/lib/offline-demo";
import { membershipPlanConfig, membershipPlanOrder } from "./membership-config";
import { showToast } from "./toast";
import useDemoUser from "./useDemoUser";
import styles from "./about-membership.module.css";

type ComparisonRow = {
  label: string;
  free: boolean;
  premium: boolean;
  pro: boolean;
};

type Question = { question: string; answer: string };
type Billing = "monthly" | "yearly";

export default function MembershipSection() {
  const t = useTranslations("membership");
  const locale = useLocale();
  const user = useDemoUser();
  const [billing, setBilling] = useState<Billing>("monthly");
  const [error, setError] = useState("");
  const rawRows = t.raw("comparison.rows");
  const rawQuestions = t.raw("faq");
  const rows = Array.isArray(rawRows) ? rawRows as ComparisonRow[] : [];
  const questions = Array.isArray(rawQuestions) ? rawQuestions as Question[] : [];
  const currentPlan = user?.plan ?? "free";
  const priceFormatter = new Intl.NumberFormat(locale === "mn" ? "mn-MN" : "en-US");

  function signupHref(plan: DemoPlan) {
    const role = membershipPlanConfig[plan].role;
    return `/login?mode=signup&plan=${plan}&role=${role}`;
  }

  function choosePlan(plan: DemoPlan) {
    if (!user) return;
    setError("");

    try {
      updateDemoUserPlan(plan);
      showToast(plan === "free" ? t("planUpdated") : t("paymentComingSoon"));
    } catch {
      setError(t("updateFailed"));
    }
  }

  return (
    <section className={styles.membership} id="membership" aria-labelledby="membership-title">
      <div className="wrap">
        <header className={styles.membershipHeader}>
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
          <h2 id="membership-title">{t("title")}</h2>
          <p>{t("intro")}</p>
        </header>

        <div className={styles.billingToggle} role="group" aria-label={t("billingLabel")}>
          <button
            type="button"
            aria-pressed={billing === "monthly"}
            onClick={() => setBilling("monthly")}
          >
            {t("monthly")}
          </button>
          <button
            type="button"
            aria-pressed={billing === "yearly"}
            onClick={() => setBilling("yearly")}
          >
            {t("yearly")}
            <span className={styles.yearlyHint}>{t("twoMonthsFree")}</span>
          </button>
        </div>

        <div className={styles.planGrid}>
          {membershipPlanOrder.map((plan) => {
            const config = membershipPlanConfig[plan];
            const features = t.raw(`plans.${plan}.features`) as string[];
            const price = config[billing === "monthly" ? "monthlyPrice" : "yearlyPrice"];
            const variantClass =
              config.variant === "premium"
                ? styles.planCardPremium
                : config.variant === "pro"
                  ? styles.planCardPro
                  : "";
            const isCurrent = Boolean(user && currentPlan === plan);

            return (
              <article
                className={`${styles.planCard} ${variantClass}`}
                key={plan}
                aria-label={t(`plans.${plan}.title`)}
              >
                {config.featured && (
                  <span className={styles.popularBadge}>{t("mostPopular")}</span>
                )}
                <h3>{t(`plans.${plan}.title`)}</h3>
                <p className={styles.planDescription}>{t(`plans.${plan}.description`)}</p>
                <div className={styles.planPrice}>
                  <strong>{priceFormatter.format(price)} ₮</strong>
                  {plan !== "free" && (
                    <span>{billing === "monthly" ? t("perMonth") : t("perYear")}</span>
                  )}
                </div>
                {plan === "free" && (
                  <span className={styles.pricePeriod}>{t("freeForever")}</span>
                )}
                {billing === "yearly" && plan !== "free" && (
                  <span className={styles.pricePeriod}>{t("yearlySavings")}</span>
                )}
                <ul className={styles.planFeatures}>
                  {features.map((feature) => (
                    <li key={feature}>
                      <span className={styles.check} aria-hidden="true">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {user ? (
                  <button
                    className={styles.planButton}
                    type="button"
                    disabled={isCurrent}
                    aria-label={isCurrent ? t("currentPlan") : `${t("upgrade")} ${t(`plans.${plan}.title`)}`}
                    onClick={() => choosePlan(plan)}
                  >
                    {isCurrent ? t("currentPlan") : t("upgrade")}
                  </button>
                ) : (
                  <Link className={styles.planButton} href={signupHref(plan)}>
                    {t(`plans.${plan}.cta`)}
                  </Link>
                )}
              </article>
            );
          })}
        </div>

        {error && <p className={styles.membershipError} role="alert">{error}</p>}

        <div className={styles.comparison}>
          <h3>{t("comparison.title")}</h3>
          <div className={styles.tableWrap} role="region" aria-label={t("comparison.title")} tabIndex={0}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th scope="col">{t("comparison.feature")}</th>
                  {membershipPlanOrder.map((plan) => (
                    <th scope="col" key={plan}>{t(`plans.${plan}.title`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {membershipPlanOrder.map((plan) => {
                      const included = row[plan];
                      return (
                        <td
                          key={plan}
                          className={included ? styles.comparisonIncluded : styles.comparisonNotIncluded}
                          aria-label={included ? t("comparison.included") : t("comparison.notIncluded")}
                        >
                          {included ? "✓" : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.faq}>
          <h3>{t("faqTitle")}</h3>
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
