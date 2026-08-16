import type { Locale } from "@/i18n/routing";
import type { Localized } from "@/content/types";

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
