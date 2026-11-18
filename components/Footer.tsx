import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>{t("text")}</p>
      </div>
    </footer>
  );
}
