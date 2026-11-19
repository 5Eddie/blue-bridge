"use client";

import { useMemo, useSyncExternalStore } from "react";
import { DEMO_AUTH_EVENT, isDemoPlan, type DemoUser } from "@/lib/offline-demo";

type PublicDemoUser = Omit<DemoUser, "password">;

function subscribe(callback: () => void) {
  window.addEventListener(DEMO_AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DEMO_AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem("currentUser");
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return null;
}

export default function useDemoUser() {
  const savedUser = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    if (!savedUser) return null;
    try {
      const user = JSON.parse(savedUser) as PublicDemoUser;
      if (!user || typeof user.name !== "string" || !["tourist", "buyer", "host"].includes(user.role)) {
        return null;
      }
      return { ...user, plan: isDemoPlan(user.plan) ? user.plan : "free" };
    } catch {
      return null;
    }
  }, [savedUser]);
}
