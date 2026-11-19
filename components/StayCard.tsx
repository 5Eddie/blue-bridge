"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { Stay, StayPreview } from "./temp-data";
import { useProvinceLabel } from "./provinces";
import { formatPrice } from "./format";
import { showToast } from "./toast";
import useDemoUser from "./useDemoUser";

export default function StayCard({
  stay,
  privateStay,
}: {
  stay: StayPreview;
  privateStay?: Stay;
}) {
  const router = useRouter();
  const user = useDemoUser();
  const t = useTranslations("cards");
  const tt = useTranslations("toast");
  const access = useTranslations("access");
  const province = useProvinceLabel(stay.herder.province);

  function goToLogin() {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.push(`/login?next=${encodeURIComponent(returnTo)}`);
  }

  function onRequest() {
    if (!user) {
      goToLogin();
      return;
    }
    if (!privateStay) return;
    showToast(tt("requestSent", { title: privateStay.title }));
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
        {user && privateStay ? (
          <div className="who">
            <span className="ava" aria-hidden="true">
              {privateStay.herder.avatar}
            </span>
            <span>
              <b>{privateStay.herder.name}</b>
              <br />
              {privateStay.herder.soum} {t("soum")}
            </span>
          </div>
        ) : (
          <p className="guest-origin">{province}, {stay.herder.soum} {t("soum")}</p>
        )}
        <h3 className="card-title">{stay.title}</h3>
        <p className="desc">
          {privateStay && user ? privateStay.description : access("guestStayTeaser")}
        </p>
        {privateStay && user ? (
          <ul className="todo">
            {privateStay.activities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        ) : user ? (
          <span className="private-loading">{access("loading")}</span>
        ) : (
          <button
            type="button"
            className="lock-badge details-lock"
            aria-label={t("detailsLocked")}
            onClick={goToLogin}
          >
            <span aria-hidden="true">🔒</span> {t("detailsLocked")}
          </button>
        )}
        <div className="row">
          {user && privateStay ? (
            <span className="price">
              {formatPrice(privateStay.price)} <small>{t("perDay")}</small>
            </span>
          ) : user ? (
            <span className="private-loading">{access("loading")}</span>
          ) : (
            <button
              type="button"
              className="lock-badge"
              aria-label={t("priceLocked")}
              onClick={goToLogin}
            >
              <span aria-hidden="true">🔒</span> {t("priceLocked")}
            </button>
          )}
          <span
            className="rate"
            role="img"
            aria-label={`${t("ratingLabel")} ${stay.rating.toFixed(1)}`}
          >
            ★ {stay.rating.toFixed(1)}
          </span>
        </div>
        <div className="acts">
          <button type="button" className="btn" onClick={onRequest} disabled={Boolean(user && !privateStay)}>
            {user && !privateStay ? access("loading") : t("visitRequest")}
          </button>
        </div>
      </div>
    </article>
  );
}
