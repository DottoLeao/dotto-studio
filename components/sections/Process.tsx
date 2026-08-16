import { useLocale, useTranslations } from "next-intl";

import { processSteps } from "@/content/process";
import { pick } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function Process() {
  const t = useTranslations("process");
  const locale = useLocale() as Locale;

  return (
    <section
      data-sec
      data-surface="signal"
      aria-labelledby="process-heading"
      className="bg-signal px-gutter py-section text-ink"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Ink cheio sobre Signal: qualquer opacidade aqui reprova AA. */}
        <p className="eyebrow text-ink">{t("eyebrow")}</p>

        {/* O protótipo tinha só um eyebrow aqui — sem heading a seção some do
            sumário de leitores de tela. */}
        <h2 id="process-heading" className="sr-only">
          {t("heading")}
        </h2>

        <p
          data-reveal
          className="display-tight mt-8 max-w-[24ch] text-h2 text-balance"
        >
          {t("lead")}
        </p>

        <ol className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={pick(step.marker, locale)} data-reveal data-reveal-delay={i}>
              <div className="h-px w-full bg-ink/25" />
              <p className="meta-mono mt-5 font-medium text-ink">
                {pick(step.marker, locale)}
              </p>
              <p className="mt-3 max-w-[24ch] leading-[1.5] text-ink/90">
                {pick(step.description, locale)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
