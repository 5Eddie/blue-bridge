import { getTranslations } from "next-intl/server";
import type { Herder } from "./temp-data";

export default async function HerdersSection({ herders }: { herders: Herder[] }) {
  const t = await getTranslations("sections");
  const root = await getTranslations();
  const regions = root.raw("regions") as { id: string; label: string }[];

  return (
    <section className="block" id="herders">
      <div className="wrap">
        <h2 className="section-title">{t("herders")}</h2>
        <div className="hgrid">
          {herders.map((h) => {
            const province = regions.find((r) => r.id === h.province)?.label ?? h.province;
            return (
              <div key={h.id} className="herder">
                <span className="ava" aria-hidden="true">
                  {h.avatar}
                </span>
                <div>
                  <b>{h.name}</b>
                  <small>
                    {province}, {h.soum}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
