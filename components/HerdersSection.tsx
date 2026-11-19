"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { HerderPreview } from "./temp-data";
import usePrivateDemoData from "./usePrivateDemoData";

type Region = { id: string; label: string };

export default function HerdersSection({ herders }: { herders: HerderPreview[] }) {
  const router = useRouter();
  const t = useTranslations("sections");
  const cards = useTranslations("cards");
  const access = useTranslations("access");
  const regions = useTranslations().raw("regions") as Region[];
  const { user, data: privateData, failed } = usePrivateDemoData();

  function goToLogin() {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.push(`/login?next=${encodeURIComponent(returnTo)}`);
  }

  return (
    <section className="block" id="herders">
      <div className="wrap">
        <h2 className="section-title">{t("herders")}</h2>
        {failed && <p className="private-data-error" role="alert">{access("privateDataError")}</p>}
        <div className="hgrid">
          {herders.map((herder) => {
            const province =
              regions.find((region) => region.id === herder.province)?.label ??
              herder.province;
            const fullHerder = privateData?.herders.find((item) => item.id === herder.id);

            return (
              <div key={herder.id} className="herder">
                {user && fullHerder ? (
                  <>
                    <span className="ava" aria-hidden="true">
                      {fullHerder.avatar}
                    </span>
                    <div>
                      <b>{fullHerder.name}</b>
                      <small>
                        {province}, {fullHerder.soum}
                      </small>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="herder-location-icon" aria-hidden="true">⌖</span>
                    <div className="herder-location">
                      <b>{province}</b>
                      <small>{herder.soum}</small>
                    </div>
                    {user ? (
                      <span className="private-loading">{access("loading")}</span>
                    ) : (
                      <button
                        type="button"
                        className="lock-badge"
                        aria-label={cards("detailsLocked")}
                        onClick={goToLogin}
                      >
                        <span aria-hidden="true">🔒</span> {cards("detailsLocked")}
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
