import type { DemoPlan } from "@/lib/offline-demo";

export const membershipPlanConfig: Record<
  DemoPlan,
  {
    monthlyPrice: number;
    yearlyPrice: number;
    role: "tourist" | "host";
    featured: boolean;
    variant: "standard" | "premium" | "pro";
  }
> = {
  free: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    role: "tourist",
    featured: false,
    variant: "standard",
  },
  premium: {
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    role: "tourist",
    featured: true,
    variant: "premium",
  },
  pro: {
    monthlyPrice: 29000,
    yearlyPrice: 290000,
    role: "host",
    featured: false,
    variant: "pro",
  },
};

export const membershipPlanOrder: DemoPlan[] = ["free", "premium", "pro"];
