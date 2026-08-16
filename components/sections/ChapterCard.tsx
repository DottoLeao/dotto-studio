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
      // Fundo INK, não bone: este fundo só aparece em vão — abaixo do painel
      // fixo — e vão tem de mostrar o estado FINAL da cena, que é ink, a mesma
      // cor do Work que vem a seguir. Enquanto era bone, qualquer vão virava
      // uma faixa clara no meio da rolagem.
      className="relative bg-ink"
      style={{ height: "var(--chapter-h)" }}
    >
      {/* `h-lvh`, a altura MÁXIMA da viewport, e fundo próprio.
          Com `h-svh` o painel tinha a altura da tela COM a barra do navegador
          aberta; quando ela recolhia, a tela crescia, o painel não, e sobrava
          uma faixa mostrando o fundo da seção. Com `lvh` o painel sempre cobre
          e o excedente sai de quadro — sem o reflow por frame que `dvh` traria.

          O bone saiu da seção e veio para cá porque é o primeiro estado da
          íris, não a cor de fundo do bloco. */}
      <div className="sticky top-0 h-lvh overflow-hidden bg-bone">
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
