import { useLocale, useTranslations } from "next-intl";

import { SeamLayer } from "@/components/motion/SeamLayer";
import { services } from "@/content/services";
import { pick } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function Services() {
  const t = useTranslations("services");
  const locale = useLocale() as Locale;

  return (
    <section
      id="services"
      data-seam="diagonal"
      data-surface="bone"
      className="relative overflow-hidden bg-bone px-gutter py-section text-ink"
    >
      {/* Folha INK, a cor que sai do Work: bone sobre bone seria invisível. */}
      <SeamLayer tone="ink" />

      <div className="mx-auto w-full max-w-[1280px]">
        <p data-reveal className="eyebrow text-signal-ink">
          {t("eyebrow")}
        </p>
        <h2
          data-reveal
          data-reveal-delay="1"
          className="display-tight mt-7 max-w-[16ch] text-h2"
        >
          {t("heading")}
        </h2>

        <ol className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
          {services.map((s, i) => (
            <li key={s.number} data-reveal data-reveal-delay={i}>
              <div className="h-px w-full bg-ink/15" />
              <p className="meta-mono mt-5 text-signal-ink">{s.number}</p>
              <h3 className="display-tight mt-3 text-3xl tracking-[-0.035em]">
                {pick(s.title, locale)}
              </h3>
              <p className="mt-5 max-w-[38ch] leading-[1.55] text-ink/75">
                {pick(s.description, locale)}
              </p>
              <p className="meta-mono mt-7 text-slate">
                {pick(s.stack, locale)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
