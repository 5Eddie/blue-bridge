"use client";

import { useTranslations } from "next-intl";

export interface RegionOption {
  id: string;
  label: string;
}

export function useRegionOptions(): RegionOption[] {
  const root = useTranslations();
  return root.raw("regions") as RegionOption[];
}

export function useProvinceLabel(slug: string): string {
  const regions = useRegionOptions();
  return regions.find((r) => r.id === slug)?.label ?? slug;
}
