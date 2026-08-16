"use client";

import { useRef } from "react";
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "motion/react";
import { useLocale } from "next-intl";

import { capabilities } from "@/content/manifesto";
import { wrap } from "@/lib/motion";
import type { Locale } from "@/i18n/routing";

/** Porcentagem da faixa por segundo. Equivale aos 34s por 50% do CSS antigo. */
const AUTO = 50 / 34;

/** Quanto a faixa desacelera sob o cursor. Zero leria como travamento. */
const HOVER = 0.22;

/** Fração da velocidade de arremesso que sobra a cada segundo após soltar. */
const FLING_DECAY = 0.02;

export function CapabilityMarquee() {
  const locale = useLocale() as Locale;
  const items = capabilities[locale];
  const reduced = useReducedMotion();

  // Posição acumulada, em % da faixa inteira. O wrap acontece só na leitura:
  // guardar o valor já embrulhado faria o arraste saltar na virada.
  const baseX = useMotionValue(0);
  const x = useTransform(() => `${wrap(-50, 0, baseX.get())}%`);

  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pointerX = useRef(0);
  const pointerTime = useRef(0);
  const fling = useRef(0);
  const speed = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced || dragging.current) return;

    // Aba oculta devolve um delta acumulado enorme; sem o teto, a faixa
    // reaparece deslocada como se tivesse pulado.
    const dt = Math.min(delta, 50) / 1000;

    baseX.set(baseX.get() - AUTO * speed.current * dt + fling.current * dt);
    fling.current *= Math.pow(FLING_DECAY, dt);
  });

  const percentPerPixel = () => {
    const width = trackRef.current?.offsetWidth ?? 0;
    return width > 0 ? 100 / width : 0;
  };

  return (
    <section
      data-surface="ink"
      className="overflow-hidden border-y border-bone/12 bg-ink py-5"
      aria-label={items.join(", ")}
    >
      <motion.div
        ref={trackRef}
        style={reduced ? undefined : { x }}
        // pan-y: o arraste horizontal é nosso, o vertical continua sendo da
        // página. Sem isto, pegar a faixa no celular sequestra a rolagem.
        className={[
          "flex w-max touch-pan-y select-none",
          reduced ? "" : "cursor-grab active:cursor-grabbing",
        ].join(" ")}
        onPointerEnter={() => {
          speed.current = HOVER;
        }}
        onPointerLeave={() => {
          speed.current = 1;
        }}
        onPointerDown={(event) => {
          if (reduced) return;
          dragging.current = true;
          fling.current = 0;
          pointerX.current = event.clientX;
          pointerTime.current = event.timeStamp;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;

          const dx = event.clientX - pointerX.current;
          const dt = Math.max((event.timeStamp - pointerTime.current) / 1000, 0.001);
          pointerX.current = event.clientX;
          pointerTime.current = event.timeStamp;

          const step = dx * percentPerPixel();
          baseX.set(baseX.get() + step);

          // Velocidade instantânea em %/s, com teto: um piparote violento
          // manda a faixa para um borrão do qual ela leva segundos para voltar.
          fling.current = Math.max(-60, Math.min(60, step / dt));
        }}
        onPointerUp={(event) => {
          if (!dragging.current) return;
          dragging.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
          fling.current = 0;
        }}
      >
        {/* Duas cópias exatas: a faixa percorre -50% e volta ao mesmo frame.
            A segunda é aria-hidden para o leitor de tela não ler duas vezes.
            Em reduced-motion a duplicata não existe — sem loop, ela seria
            apenas uma lista repetida no meio da página. */}
        {(reduced ? [0] : [0, 1]).map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex shrink-0 items-center font-display text-base whitespace-nowrap text-bone/70"
              >
                {item}
                <span
                  aria-hidden="true"
                  className="mx-6 inline-block size-1.5 rounded-full bg-signal"
                />
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </section>
  );
}
