import { useLocale, useTranslations } from "next-intl";

import { SeamLayer, SeamRule } from "@/components/motion/SeamLayer";
import { principles } from "@/content/manifesto";
import { pick } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

/**
 * Duas emendas, porque esta seção é fronteira dos dois lados:
 * `curtain-rule` na entrada (cortina lateral vinda do marquee) e `line-empty`
 * na saída — os blocos se esvaziam de baixo para cima, em escada, para o íris
 * do ChapterCard florescer numa tela limpa. Um corta, o outro abre.
 */
export function Manifesto() {
  const t = useTranslations("manifesto");
  const locale = useLocale() as Locale;

  return (
    <section
      data-seam="curtain-rule line-empty"
      data-surface="bone"
      className="relative overflow-hidden bg-bone px-gutter py-section text-ink"
    >
      {/* Folha INK, a cor que vem do marquee: uma folha bone sobre uma seção
          bone cobre e revela exatamente o mesmo tom — a emenda não apareceria. */}
      <SeamLayer tone="ink" />
      <SeamRule axis="x" />

      <div className="mx-auto w-full max-w-[1280px]">
        <p data-reveal data-seam-line className="eyebrow text-signal-ink">
          {t("eyebrow")}
        </p>

        <p
          data-reveal
          data-reveal-delay="1"
          data-seam-line
          className="display-tight mt-8 max-w-[22ch] text-h2 text-balance"
        >
          {t("leadBefore")}
          <span className="text-signal-ink">{t("leadEmphasis")}</span>
          {t("leadAfter")}
        </p>

        <ol className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
          {principles.map((p, i) => (
            <li key={p.number} data-reveal data-reveal-delay={i} data-seam-line>
              <div className="h-px w-full bg-ink/15" />
              <p className="meta-mono mt-5 text-slate">
                {p.number} — {pick(p.title, locale)}
              </p>
              <p className="mt-4 max-w-[38ch] text-lg leading-[1.5] text-ink/80">
                {pick(p.description, locale)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
