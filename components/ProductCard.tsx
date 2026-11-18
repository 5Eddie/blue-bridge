"use client";

import { useTranslations } from "next-intl";
import type { Product } from "./temp-data";
import { useProvinceLabel } from "./provinces";
import { formatPrice } from "./format";
import { addToCart } from "./cart";
import { showToast } from "./toast";

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("cards");
  const tt = useTranslations("toast");
  const province = useProvinceLabel(product.herder.province);

  function onAdd() {
    addToCart({ id: product.id, title: product.title, price: product.price });
    showToast(tt("added", { title: product.title }));
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
        <div className="who">
          <span className="ava" aria-hidden="true">
            {product.herder.avatar}
          </span>
          <span>
            <b>{product.herder.name}</b>
            <br />
            {product.herder.soum} {t("soum")}
          </span>
        </div>
        <h3 className="card-title">{product.title}</h3>
        <p className="desc">{product.description}</p>
        <div className="row">
          <span className="price">
            {formatPrice(product.price)} <small>/ {product.unit}</small>
          </span>
          <span
            className="rate"
            role="img"
            aria-label={`${t("ratingLabel")} ${product.rating.toFixed(1)}`}
          >
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="acts">
          <button type="button" className="btn" onClick={onAdd}>
            {t("addToCart")}
          </button>
        </div>
      </div>
    </article>
  );
}
