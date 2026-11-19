"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { StayPreview } from "./temp-data";
import StayCard from "./StayCard";
import { SEARCH_EVENT } from "./HeroControls";
import usePrivateDemoData from "./usePrivateDemoData";

interface SearchDetail {
  q: string;
  region: string;
  mode: string;
}

export default function StaysSection({ stays }: { stays: StayPreview[] }) {
  const t = useTranslations("sections");
  const te = useTranslations("empty");
  const access = useTranslations("access");
  const { data: privateData, failed } = usePrivateDemoData();
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
    const fullStay = privateData?.stays.find((item) => item.id === s.id);
    const hay = `${s.title} ${fullStay?.description ?? ""} ${fullStay?.herder.name ?? ""} ${s.herder.soum} ${s.herder.province} ${fullStay?.activities.join(" ") ?? ""}`.toLowerCase();
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

        {failed && <p className="private-data-error" role="alert">{access("privateDataError")}</p>}

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
