/**
 * A folha que faz a emenda entre duas seções.
 *
 * Fica dentro da seção que CHEGA e o runtime resolve o `clip-path` (ou o
 * `transform` dos filhos) conforme a seção entra. Isso existe para nunca
 * precisar animar o `transform` de uma seção: o runtime já documenta que
 * transform numa seção quebra o `position: sticky` de um filho, e o ChapterCard
 * depende disso.
 *
 * Duas leituras, escolhidas por emenda:
 *   - cor da PRÓPRIA seção → a folha esconde o conteúdo e o descobre;
 *   - cor da seção ANTERIOR → a folha é a superfície que está indo embora.
 *
 * `tone` é opcional de propósito. Quando a emenda é feita por peças que se
 * movem (persiana, partição), quem pinta são as peças e a folha é só o
 * contêiner — uma folha pintada por baixo delas cobriria justamente o conteúdo
 * que elas deveriam revelar.
 *
 * Estado padrão: totalmente cortada, isto é, invisível. Só `html.motion` lhe dá
 * o estado que cobre. Sem JS, com JS quebrado ou em reduced-motion nada disto
 * esconde coisa alguma — o modo de falha é sempre aberto, como no resto do site.
 *
 * A marcação NUNCA pode depender de `useReducedMotion()`: aquilo responde
 * `false` no servidor e `true` no cliente de quem pediu menos movimento, e a
 * divergência derruba a hidratação inteira.
 */

const TONE = {
  ink: "bg-ink",
  bone: "bg-bone",
  signal: "bg-signal",
} as const;

type Tone = keyof typeof TONE;

export function SeamLayer({
  tone,
  children,
}: {
  tone?: Tone;
  children?: React.ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      data-seam-layer
      className={`pointer-events-none absolute inset-0 z-10 ${tone ? TONE[tone] : ""}`}
    >
      {children}
    </div>
  );
}

/** Faixa vertical da persiana. Sai por `transform`, não por clip. */
export function SeamBand({
  index,
  of,
  tone,
}: {
  index: number;
  of: number;
  tone: Tone;
}) {
  return (
    <div
      data-seam-band
      className={`absolute inset-y-0 ${TONE[tone]}`}
      style={{ left: `${(index * 100) / of}%`, width: `${100 / of}%` }}
    />
  );
}

/** Metade da partição. As duas se afastam na vertical. */
export function SeamHalf({ side, tone }: { side: "top" | "bottom"; tone: Tone }) {
  return (
    <div
      data-seam-half={side}
      className={`absolute inset-x-0 h-1/2 ${side === "top" ? "top-0" : "bottom-0"} ${TONE[tone]}`}
    />
  );
}

/** Fio-guia de 1px que viaja à frente de uma cortina. */
export function SeamRule({
  axis,
  tone = "signal",
}: {
  axis: "x" | "y";
  tone?: "signal" | "bone";
}) {
  return (
    <div
      aria-hidden="true"
      data-seam-rule
      data-seam-axis={axis}
      className={[
        "pointer-events-none absolute z-20",
        axis === "x" ? "inset-y-0 left-0 w-px" : "inset-x-0 top-0 h-px origin-left",
        tone === "signal" ? "bg-signal" : "bg-bone",
      ].join(" ")}
    />
  );
}
