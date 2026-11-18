"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "./temp-data";
import ProductCard from "./ProductCard";
import { useRegionOptions } from "./provinces";

export default function DairyBrowser({ products }: { products: Product[] }) {
  const t = useTranslations("listings");
  const tf = useTranslations("filters");
  const te = useTranslations("empty");
  const regions = useRegionOptions();

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [cat, setCat] = useState("all");

  const visible = products.filter((p) => {
    const okCat = cat === "all" || p.category === cat;
    const hay = `${p.title} ${p.description} ${p.herder.name} ${p.herder.soum} ${p.herder.province}`.toLowerCase();
    const okQ = !q || hay.includes(q.trim().toLowerCase());
    const okR = !region || p.herder.province === region;
    return okCat && okQ && okR;
  });

  return (
    <section className="block">
      <div className="wrap">
        <header className="page-head">
          <h1 className="page-title">{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </header>

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
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="empty">{te("products")}</p>
        )}
      </div>
    </section>
  );
}
