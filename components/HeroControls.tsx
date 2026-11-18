"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRegionOptions } from "./provinces";

export const SEARCH_EVENT = "malchin-search";

export default function HeroControls() {
  const t = useTranslations("hero");
  const regions = useRegionOptions();

  const [mode, setMode] = useState<"buy" | "stay">("buy");
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");

  function selectMode(next: "buy" | "stay") {
    setMode(next);
    const id = next === "buy" ? "products" : "stays";
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = mode === "buy" ? "products" : "stays";
    window.dispatchEvent(
      new CustomEvent(SEARCH_EVENT, { detail: { q, region, mode } })
    );
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div className="switch" role="group" aria-label={t("modeGroupLabel")}>
        <button
          type="button"
          aria-pressed={mode === "buy"}
          onClick={() => selectMode("buy")}
        >
          {t("modeBuy")}
        </button>
        <button
          type="button"
          aria-pressed={mode === "stay"}
          onClick={() => selectMode("stay")}
        >
          {t("modeStay")}
        </button>
      </div>

      <form className="search" onSubmit={onSubmit}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label={t("regionLabel")}
        >
          <option value="">{t("regionAll")}</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn">
          {t("search")}
        </button>
      </form>
    </>
  );
}
