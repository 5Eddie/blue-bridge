"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations("footer");

  if (pathname === "/login") return null;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>{t("text")}</p>
      </div>
    </footer>
  );
}
