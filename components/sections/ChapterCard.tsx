import { useTranslations } from "next-intl";

/**
 * A cena assinatura: o ponto Signal floresce, o Ink o engole, o título
 * aterrissa. O estado final (Ink cheio) é o padrão do CSS — que é também o
 * estado de reduced-motion. A animação se acopla por cima, nunca no lugar.
 *
 * `position: sticky` de propósito, não `pin` do ScrollTrigger: sticky é
 * resolvido pelo compositor, sem trabalho de layout em JS e sem pin-spacer
 * injetado no DOM.
 */
export function ChapterCard() {
  const t = useTranslations("chapter");

  return (
    <section
      data-chapter
      data-surface="ink"
      aria-labelledby="chapter-01-title"
      className="relative bg-bone"
      style={{ height: "var(--chapter-h)" }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-iris="signal" className="absolute inset-0 bg-signal" />
        <div data-iris="ink" className="absolute inset-0 bg-ink" />

        <div className="relative flex h-full items-center justify-center px-gutter">
          <div className="mx-auto w-full max-w-[1280px] text-center">
            <p data-chapter-copy className="eyebrow text-signal">
              {t("label")}
            </p>

            <h2
              id="chapter-01-title"
              data-chapter-copy
              data-chapter-title
              className="display-tight mt-6 text-chapter"
            >
              {t("title")}
            </h2>

            <p
              data-chapter-copy
              className="mx-auto mt-7 max-w-[46ch] text-lg leading-[1.5] text-bone/70"
            >
              {t("lead")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
