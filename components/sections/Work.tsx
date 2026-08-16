import { useLocale, useTranslations } from "next-intl";

import { cases } from "@/content/cases";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { pick } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function Work() {
  const t = useTranslations("work");
  const locale = useLocale() as Locale;

  return (
    <section
      id="work"
      data-sec
      data-surface="ink"
      className="bg-ink px-gutter pt-section pb-section"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <p data-reveal className="eyebrow text-signal">
          {t("eyebrow")}
        </p>

        {cases.map((c, index) => (
          <article key={c.slug} className="mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-bone/15 pt-6">
              <p className="meta-mono text-bone/60">
                {/* Deriva do array: um case novo atualiza o contador sozinho. */}
                {t("counter", {
                  current: String(index + 1).padStart(2, "0"),
                  total: String(cases.length).padStart(2, "0"),
                })}
              </p>
              <p className="meta-mono text-bone/60">
                {/* O nome só aparece com autorização do cliente. */}
                {c.clientNameApproved
                  ? `${c.client} · ${pick(c.sector, locale)}`
                  : pick(c.clientAnonymous, locale)}
              </p>
            </div>

            <h2 data-reveal className="display-tight mt-8 text-h3">
              {c.title}
            </h2>
            <p
              data-reveal
              data-reveal-delay="1"
              className="mt-5 max-w-[52ch] text-lead leading-[1.3] text-bone/72"
            >
              {pick(c.lead, locale)}
            </p>

            <div data-reveal="scale" className="mt-14">
              <MediaFrame slot={c.media.hero} />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {c.media.secondary.map((slot, i) => (
                <MediaFrame key={i} slot={slot} />
              ))}
            </div>

            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {(
                [
                  ["blindSpotLabel", c.narrative.blindSpot],
                  ["builtLabel", c.narrative.built],
                  ["changedLabel", c.narrative.changed],
                ] as const
              ).map(([labelKey, body], i) => (
                <div key={labelKey} data-reveal data-reveal-delay={i}>
                  <p className="eyebrow text-signal">{t(labelKey)}</p>
                  <p className="mt-4 max-w-[40ch] leading-[1.55] text-bone/78">
                    {pick(body, locale)}
                  </p>
                </div>
              ))}
            </div>

            {/* Métrica não medida não é publicada — o bloco inteiro some. */}
            {c.metrics.some((m) => m.verified) ? (
              <div className="mt-16 grid gap-10 border-t border-bone/15 pt-10 sm:grid-cols-2">
                {c.metrics
                  .filter((m) => m.verified)
                  .map((m) => (
                    <div key={pick(m.label, locale)}>
                      <p
                        data-num
                        className="display-tight text-num text-signal tabular-nums"
                      >
                        {m.prefix}
                        <span data-count={m.value}>{m.value}</span>
                        {m.suffix}
                      </p>
                      <p className="mt-3 max-w-[26ch] text-sm leading-[1.5] text-bone/60">
                        {pick(m.label, locale)}
                      </p>
                      {m.provenance ? (
                        <p className="meta-mono mt-2 text-bone/60">
                          {pick(m.provenance, locale)}
                        </p>
                      ) : null}
                    </div>
                  ))}
              </div>
            ) : null}

            <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {c.stack.map((tech) => (
                  <li key={tech} className="meta-mono text-bone/60">
                    {tech}
                  </li>
                ))}
              </ul>

              {c.liveUrl ? (
                <a
                  href={c.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-mono group ml-auto inline-flex min-h-11 items-center gap-2 text-signal transition-colors hover:text-bone"
                >
                  {t("viewLive")}
                  {/* A seta anda 3px no hover. CSS puro: um transform de
                      3px não justifica um client component. */}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-[3px]"
                  >
                    →
                  </span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
