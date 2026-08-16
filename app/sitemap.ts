import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages: {
        "pt-BR": `${site.url}/pt`,
        en: `${site.url}/en`,
      },
    },
  }));
}
