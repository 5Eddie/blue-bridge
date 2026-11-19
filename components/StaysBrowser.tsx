"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { StayPreview } from "./temp-data";
import StayCard from "./StayCard";
import { useRegionOptions } from "./provinces";
import usePrivateDemoData from "./usePrivateDemoData";

export default function StaysBrowser({ stays }: { stays: StayPreview[] }) {
  const t = useTranslations("stories");
  const tf = useTranslations("filters");
  const te = useTranslations("empty");
  const access = useTranslations("access");
  const regions = useRegionOptions();
  const { data: privateData, failed } = usePrivateDemoData();

  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");

  const visible = stays.filter((s) => {
    const fullStay = privateData?.stays.find((item) => item.id === s.id);
    const hay = `${s.title} ${fullStay?.description ?? ""} ${fullStay?.herder.name ?? ""} ${s.herder.soum} ${s.herder.province} ${fullStay?.activities.join(" ") ?? ""}`.toLowerCase();
    const okQ = !q || hay.includes(q.trim().toLowerCase());
    const okR = !region || s.herder.province === region;
    return okQ && okR;
  });

  return (
    <section className="block">
      <div className="wrap">
        <header className="page-head">
          <h1 className="page-title">{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </header>

        {failed && <p className="private-data-error" role="alert">{access("privateDataError")}</p>}

        <form className="search page-search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tf("searchPlaceholder")}
            aria-label={tf("search")}
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label={tf("region")}
          >
            <option value="">{tf("all")}</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <span className="result-count" aria-live="polite">
            {t("count", { count: visible.length })}
          </span>
        </form>

        {visible.length ? (
          <div className="grid">
            {visible.map((s) => (
              <StayCard
                key={s.id}
                stay={s}
                privateStay={privateData?.stays.find((item) => item.id === s.id)}
              />
            ))}
          </div>
        ) : (
          <p className="empty">{te("stays")}</p>
        )}
      </div>
    </section>
  );
}
