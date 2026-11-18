"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Stay } from "./temp-data";
import StayCard from "./StayCard";
import { SEARCH_EVENT } from "./HeroControls";

interface SearchDetail {
  q: string;
  region: string;
  mode: string;
}

export default function StaysSection({ stays }: { stays: Stay[] }) {
  const t = useTranslations("sections");
  const te = useTranslations("empty");
  const [query, setQuery] = useState({ q: "", region: "" });

  useEffect(() => {
    function onSearch(e: Event) {
      const detail = (e as CustomEvent<SearchDetail>).detail;
      if (detail.mode === "stay") setQuery({ q: detail.q, region: detail.region });
    }
    window.addEventListener(SEARCH_EVENT, onSearch);
    return () => window.removeEventListener(SEARCH_EVENT, onSearch);
  }, []);

  const visible = stays.filter((s) => {
    const hay = `${s.title} ${s.description} ${s.herder.name} ${s.herder.soum} ${s.herder.province} ${s.activities.join(" ")}`.toLowerCase();
    const okQ = !query.q || hay.includes(query.q.trim().toLowerCase());
    const okR = !query.region || s.herder.province === query.region;
    return okQ && okR;
  });

  return (
    <section className="block" id="stays">
      <div className="wrap">
        <div className="head">
          <div>
            <h2 className="section-title">{t("featuredStays")}</h2>
            <p>{t("featuredStaysSub")}</p>
          </div>
        </div>

        {visible.length ? (
          <div className="grid">
            {visible.map((s) => (
              <StayCard key={s.id} stay={s} />
            ))}
          </div>
        ) : (
          <p className="empty">{te("stays")}</p>
        )}
      </div>
    </section>
  );
}
