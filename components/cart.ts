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

export function addToCart(item: { id: string; title: string; price: number }): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    let items: { id: string; title: string; price: number }[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) items = parsed;
    }
    items.push(item);
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // ignore storage errors
  }
}
