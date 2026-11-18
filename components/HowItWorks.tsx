import { getTranslations } from "next-intl/server";

export default async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = t.raw("steps") as { title: string; text: string }[];

  return (
    <section className="block how" id="how">
      <div className="wrap">
        <h2 className="section-title">{t("title")}</h2>
        <div className="steps">
          {steps.map((s, i) => (
            <div key={s.title}>
              <span className="step-num" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
