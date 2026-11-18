"use client";

import { useTranslations } from "next-intl";
import type { Stay } from "./temp-data";
import { useProvinceLabel } from "./provinces";
import { formatPrice } from "./format";
import { showToast } from "./toast";

export default function StayCard({ stay }: { stay: Stay }) {
  const t = useTranslations("cards");
  const tt = useTranslations("toast");
  const province = useProvinceLabel(stay.herder.province);

  function onRequest() {
    showToast(tt("requestSent", { title: stay.title }));
  }

  return (
    <article className="card">
      <div className="media">
        <span className="tag">{province}</span>
        <span className="media-emoji" aria-hidden="true">
          {stay.emoji}
        </span>
      </div>
      <div className="card-body">
        <div className="who">
          <span className="ava" aria-hidden="true">
            {stay.herder.avatar}
          </span>
          <span>
            <b>{stay.herder.name}</b>
            <br />
            {stay.herder.soum} {t("soum")}
          </span>
        </div>
        <h3 className="card-title">{stay.title}</h3>
        <p className="desc">{stay.description}</p>
        <ul className="todo">
          {stay.activities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <div className="row">
          <span className="price">
            {formatPrice(stay.price)} <small>{t("perDay")}</small>
          </span>
          <span
            className="rate"
            role="img"
            aria-label={`${t("ratingLabel")} ${stay.rating.toFixed(1)}`}
          >
            ★ {stay.rating.toFixed(1)}
          </span>
        </div>
        <div className="acts">
          <button type="button" className="btn" onClick={onRequest}>
            {t("visitRequest")}
          </button>
        </div>
      </div>
    </article>
  );
}
