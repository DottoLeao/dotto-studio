import Image from "next/image";
import { useTranslations } from "next-intl";

import { availabilityIsCurrent, site } from "@/content/site";

const LINKS = [
  { label: "LinkedIn", href: site.linkedin },
  { label: "GitHub", href: site.github },
  { label: site.email, href: `mailto:${site.email}` },
];

export function About() {
  const t = useTranslations("about");
  const current = availabilityIsCurrent();
  const quarter = `Q${site.availability.quarter} ${site.availability.year}`;

  return (
    <section
      id="about"
      data-sec
      data-surface="ink"
      aria-labelledby="about-heading"
      className="bg-ink px-gutter py-section"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-14 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-20">
        <div data-reveal="scale">
          <Image
            src="/lorenzo.png"
            alt={t("portraitAlt")}
            width={600}
            height={750}
            sizes="(max-width: 900px) 70vw, 300px"
            className="w-full max-w-[300px] object-cover grayscale contrast-[1.05]"
          />
        </div>

        <div>
          <p className="eyebrow text-signal">{t("eyebrow")}</p>

          <h2 id="about-heading" className="display-tight mt-7 text-h3">
            {site.person}
          </h2>

          <p className="mt-8 max-w-[52ch] text-lg leading-[1.6] text-bone/78">
            {t("bio1")}
          </p>
          <p className="mt-5 max-w-[52ch] text-lg leading-[1.6] text-bone/78">
            {t("bio2")}
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="meta-mono inline-flex min-h-11 items-center gap-1.5 text-signal transition-colors hover:text-bone"
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="meta-mono mt-12 inline-flex items-center gap-2.5 border border-bone/20 px-4 py-2.5 text-bone/70">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 rounded-full bg-signal"
            />
            {/* Passado o trimestre, o prazo some em vez de virar mentira com data. */}
            {current ? t("availabilityWithQuarter", { quarter }) : t("availability")}
          </p>
        </div>
      </div>
    </section>
  );
}
