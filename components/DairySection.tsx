"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ProductPreview } from "./temp-data";
import ProductCard from "./ProductCard";
import { SEARCH_EVENT } from "./HeroControls";
import usePrivateDemoData from "./usePrivateDemoData";

interface SearchDetail {
  q: string;
  region: string;
  mode: string;
}

export default function DairySection({ products }: { products: ProductPreview[] }) {
  const t = useTranslations("sections");
  const tf = useTranslations("filters");
  const te = useTranslations("empty");
  const access = useTranslations("access");
  const { data: privateData, failed } = usePrivateDemoData();

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState({ q: "", region: "" });

  useEffect(() => {
    function onSearch(e: Event) {
      const detail = (e as CustomEvent<SearchDetail>).detail;
      if (detail.mode === "buy") setQuery({ q: detail.q, region: detail.region });
    }
    window.addEventListener(SEARCH_EVENT, onSearch);
    return () => window.removeEventListener(SEARCH_EVENT, onSearch);
  }, []);

  const visible = products.filter((p) => {
    const okCat = cat === "all" || p.category === cat;
    const fullProduct = privateData?.products.find((item) => item.id === p.id);
    const hay = `${p.title} ${p.description} ${fullProduct?.herder.name ?? ""} ${p.herder.soum} ${p.herder.province}`.toLowerCase();
    const okQ = !query.q || hay.includes(query.q.trim().toLowerCase());
    const okR = !query.region || p.herder.province === query.region;
    return okCat && okQ && okR;
  });

  return (
    <section className="block" id="products">
      <div className="wrap">
        <div className="head">
          <div>
            <h2 className="section-title">{t("featuredProducts")}</h2>
            <p>{t("featuredProductsSub")}</p>
          </div>
        </div>

        {failed && <p className="private-data-error" role="alert">{access("privateDataError")}</p>}

        <div className="chips" role="group" aria-label={tf("category")}>
          <button
            type="button"
            className="chip"
            aria-pressed={cat === "all"}
            onClick={() => setCat("all")}
          >
            {tf("all")}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {visible.length ? (
          <div className="grid">
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                privateProduct={privateData?.products.find((item) => item.id === p.id)}
              />
            ))}
          </div>
        ) : (
          <p className="empty">{te("products")}</p>
        )}
      </div>
    </section>
  );
}
