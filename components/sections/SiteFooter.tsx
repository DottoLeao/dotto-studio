import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/ui/BrandMark";

/**
 * Camada revelada: o rodapé fica `sticky bottom-0` atrás do <main>, que é
 * opaco e desliza por cima. Quem descobre o rodapé é o fim do conteúdo, não
 * uma animação — por isso a geometria é CSS e vale igual em reduced-motion.
 *
 * O runtime só anima a ENTRADA do conteúdo interno conforme ele aparece. Sem
 * JS, `[data-footer-inner]` fica no estado final (visível), como todo o resto
 * do site: o modo de falha é sempre aberto.
 */
export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer
      data-footer-reveal
      // O respiro de baixo não é estética: o botão do menu é `fixed` no canto
      // inferior direito e ocupa a faixa de `gutter` até `gutter + 4rem`.
      // Sem esta reserva ele cobre a última linha do rodapé — que é onde mora
      // o "resposta em até 24 horas".
      className="footer-reveal bg-ink px-gutter pt-14 pb-[calc(var(--spacing-gutter)+5rem)]"
    >
      <div
        data-footer-inner
        className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-6 border-t border-bone/15 pt-10"
      >
        <BrandMark className="text-xl" />
        <p className="meta-mono text-bone/60">{t("location")}</p>
        <p className="meta-mono text-bone/60">
          {t("rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
