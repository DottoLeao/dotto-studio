import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { site } from "@/content/site";
import { routing, type Locale } from "@/i18n/routing";

const OG_LOCALE: Record<Locale, string> = { pt: "pt_BR", en: "en_US" };

export async function buildMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    // Sem isto, todo caminho relativo abaixo vira URL quebrada.
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    applicationName: site.name,
    authors: [{ name: site.person, url: site.url }],
    creator: site.person,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pt-BR": "/pt",
        en: "/en",
        // x-default é para quem não casa com nenhum idioma: inglês é a escolha mais segura.
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `/${locale}`,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}
