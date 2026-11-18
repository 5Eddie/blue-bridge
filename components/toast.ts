"use client";

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string): void {
  if (typeof document === "undefined") return;

  let el = document.getElementById("app-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "app-toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }

  el.textContent = message;
  el.classList.add("on");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 2200);
}
