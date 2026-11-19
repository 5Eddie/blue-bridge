"use client";

import { useEffect, useState } from "react";
import type { Herder, Product, Stay } from "./temp-data";
import useDemoUser from "./useDemoUser";

export type PrivateDemoData = {
  products: Product[];
  stays: Stay[];
  herders: Herder[];
};

export default function usePrivateDemoData() {
  const user = useDemoUser();
  const [result, setResult] = useState<{
    userId: string;
    data: PrivateDemoData | null;
    failed: boolean;
  } | null>(null);

  useEffect(() => {
    let active = true;

    if (!user) return;

    import("./temp-data")
      .then(async ({ getProducts, getStays, getHerders }) => {
        const [products, stays, herders] = await Promise.all([
          getProducts(),
          getStays(),
          getHerders(),
        ]);
        if (active) {
          setResult({
            userId: user.id,
            data: { products, stays, herders },
            failed: false,
          });
        }
      })
      .catch(() => {
        if (active) setResult({ userId: user.id, data: null, failed: true });
      });

    return () => {
      active = false;
    };
  }, [user]);

  const currentResult = result?.userId === user?.id ? result : null;

  return {
    user,
    data: currentResult?.data ?? null,
    failed: currentResult?.failed ?? false,
  };
}
