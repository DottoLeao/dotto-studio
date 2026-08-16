import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ReadingProgress } from "@/components/chrome/ReadingProgress";
import { SiteNav } from "@/components/chrome/SiteNav";
import { SkipLink } from "@/components/chrome/SkipLink";
import { MotionGate } from "@/components/motion/MotionGate";
import { About } from "@/components/sections/About";
import { CapabilityMarquee } from "@/components/sections/CapabilityMarquee";
import { ChapterCard } from "@/components/sections/ChapterCard";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { OpenSource } from "@/components/sections/OpenSource";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Work } from "@/components/sections/Work";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

// O badge de disponibilidade depende da data; sem isto ele congelaria no build.
export const revalidate = 86400;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  // Apenas dados confirmados. Nenhuma nota de avaliação, nenhum número de clientes.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: t("description"),
    url: `${site.url}/${locale}`,
    email: site.email,
    telephone: site.phone,
    // Sem `address` nem `areaServed`: o estúdio atende remoto e não declara
    // praça. Afirmar região aqui é o tipo de dado que envelhece sozinho.
    founder: {
      "@type": "Person",
      name: site.person,
      sameAs: [site.github, site.linkedin],
    },
    sameAs: [site.github, site.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SkipLink />
      <ReadingProgress />
      <SiteNav />
      <MotionGate />

      <main id="main">
        <Hero />
        <CapabilityMarquee />
        <Manifesto />
        <ChapterCard />
        <Work />
        <Services />
        <OpenSource />
        <Process />
        <About />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
