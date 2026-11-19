"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CART_EVENT, getCartCount } from "./cart";
import useDemoUser from "./useDemoUser";
import { clearCurrentUser } from "@/lib/offline-demo";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const access = useTranslations("access");
  const locale = useLocale();
  const user = useDemoUser();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [logoutError, setLogoutError] = useState("");

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

  function logout() {
    try {
      clearCurrentUser();
      setAccountOpen(false);
      setOpen(false);
      setLogoutError("");
    } catch {
      setLogoutError(access("logoutError"));
    }
  }

  if (pathname === "/login") return null;
  const loginHref = `/login?next=${encodeURIComponent(pathname || "/")}`;

  const links = [
    { href: "/#products", label: t("dairy") },
    { href: "/#stays", label: t("stays") },
    { href: "/#how", label: t("how") },
    { href: "/#herders", label: t("herders") },
    { href: "/#about", label: t("about") },
    { href: "/#membership", label: t("membership") },
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

          {user ? (
            <div className="account-menu">
              <button
                type="button"
                className="btn account-trigger"
                aria-label={user.name}
                aria-expanded={accountOpen}
                aria-controls="account-menu"
                onClick={() => setAccountOpen((value) => !value)}
              >
                <span className="account-name">{user.name}</span>
                <span aria-hidden="true">⌄</span>
              </button>
              {accountOpen && (
                <div id="account-menu" className="account-popover">
                  <button type="button" onClick={logout}>
                    {t("logout")}
                  </button>
                  {logoutError && <p role="alert">{logoutError}</p>}
                </div>
              )}
            </div>
          ) : (
            <Link href={loginHref} className="btn login-btn">
              {t("login")}
            </Link>
          )}

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
          {user ? (
            <>
              <p className="mobile-account-label">{user.name}</p>
              <button type="button" className="mobile-logout" onClick={logout}>
                {t("logout")}
              </button>
            </>
          ) : (
            <Link href={loginHref} onClick={() => setOpen(false)}>
              {t("login")}
            </Link>
          )}
          {logoutError && <p className="logout-error" role="alert">{logoutError}</p>}
        </nav>
      )}
    </header>
  );
}
