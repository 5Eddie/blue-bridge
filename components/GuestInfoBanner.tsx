"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import useDemoUser from "./useDemoUser";

export default function GuestInfoBanner() {
  const user = useDemoUser();
  const t = useTranslations("access");

  if (user) return null;

  return (
    <aside className="guest-info-banner">
      <p>{t("banner")}</p>
      <div>
        <Link className="btn guest-banner-login" href="/login?next=%2F">
          {t("login")}
        </Link>
        <Link className="guest-banner-signup" href="/login?mode=signup&next=%2F">
          {t("createAccount")}
        </Link>
      </div>
    </aside>
  );
}
