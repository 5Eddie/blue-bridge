"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { Product, ProductPreview } from "./temp-data";
import { useProvinceLabel } from "./provinces";
import { formatPrice } from "./format";
import { addToCart } from "./cart";
import { showToast } from "./toast";
import useDemoUser from "./useDemoUser";

export default function ProductCard({
  product,
  privateProduct,
}: {
  product: ProductPreview;
  privateProduct?: Product;
}) {
  const router = useRouter();
  const user = useDemoUser();
  const t = useTranslations("cards");
  const tt = useTranslations("toast");
  const access = useTranslations("access");
  const province = useProvinceLabel(product.herder.province);

  function goToLogin() {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.push(`/login?next=${encodeURIComponent(returnTo)}`);
  }

  function onAdd() {
    if (!user) {
      goToLogin();
      return;
    }
    if (!privateProduct) return;
    addToCart({ id: product.id, title: privateProduct.title, price: privateProduct.price });
    showToast(tt("added", { title: privateProduct.title }));
  }

  return (
    <article className="card">
      <div className="media">
        <span className="tag">{province}</span>
        <span className="media-emoji" aria-hidden="true">
          {product.emoji}
        </span>
      </div>
      <div className="card-body">
        {user && privateProduct && (
          <div className="who">
            <span className="ava" aria-hidden="true">
              {privateProduct.herder.avatar}
            </span>
            <span>
              <b>{privateProduct.herder.name}</b>
              <br />
              {privateProduct.herder.soum} {t("soum")}
            </span>
          </div>
        )}
        <h3 className="card-title">{product.title}</h3>
        <p className="desc">{product.description}</p>
        <div className="row">
          {user && privateProduct ? (
            <span className="price">
              {formatPrice(privateProduct.price)} <small>/ {product.unit}</small>
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
            aria-label={`${t("ratingLabel")} ${product.rating.toFixed(1)}`}
          >
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="acts">
          <button type="button" className="btn" onClick={onAdd} disabled={Boolean(user && !privateProduct)}>
            {user && !privateProduct ? access("loading") : t("addToCart")}
          </button>
        </div>
      </div>
    </article>
  );
}
