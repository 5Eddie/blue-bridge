"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CART_EVENT, getCartCount } from "./cart";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getCartCount());
    update();
    window.addEventListener("storage", update);
    window.addEventListener(CART_EVENT, update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener(CART_EVENT, update);
    };
  }, []);

  function switchLocale(next: "mn" | "en") {
    if (next === locale) return;
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  const links = [
    { href: "/#products", label: t("dairy") },
    { href: "/#stays", label: t("stays") },
    { href: "/#how", label: t("how") },
    { href: "/#herders", label: t("herders") },
  ];

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand">
          🐎 {t("brand")}
        </Link>

        <nav className="nav-links" aria-label={t("navLabel")}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="lang-switch" role="group" aria-label={t("langLabel")}>
            <button
              type="button"
              aria-pressed={locale === "mn"}
              onClick={() => switchLocale("mn")}
            >
              MN
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => switchLocale("en")}
            >
              EN
            </button>
          </div>

          <button type="button" className="btn soft" aria-label={t("cart")}>
            <span className="cart-label">{t("cart")}</span>
            <span className="cart-count">{count}</span>
          </button>

          <Link href="/login" className="btn login-btn">
            {t("login")}
          </Link>

          <button
            type="button"
            className="hamburger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t("menuLabel")}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label={t("navLabel")}>
          <div className="mobile-lang" role="group" aria-label={t("langLabel")}>
            <button
              type="button"
              aria-pressed={locale === "mn"}
              onClick={() => switchLocale("mn")}
            >
              MN
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => switchLocale("en")}
            >
              EN
            </button>
          </div>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}>
            {t("login")}
          </Link>
        </nav>
      )}
    </header>
  );
}
