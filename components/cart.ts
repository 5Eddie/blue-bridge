export const CART_KEY = "malchin-cart";
export const CART_EVENT = "malchin-cart-updated";

export function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return 0;
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
}
