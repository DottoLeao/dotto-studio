import { animate } from "motion";

import { EASE } from "@/lib/motion";

/**
 * A entrada em escada de um bloco de conteúdo.
 *
 * Mora aqui, e não dentro do runtime, porque tem dois gatilhos diferentes:
 *
 *  - seções SEM emenda disparam por `inView`, como sempre;
 *  - seções COM emenda esperam a folha da emenda liberar a superfície.
 *
 * O segundo caso não é preciosismo. Enquanto o conteúdo era revelado por
 * `inView`, ele já estava inteiro desenhado quando a borda da emenda passava
 * por cima — e uma borda dura cruzando uma manchete no meio das letras, num
 * frame parado, lê como layout quebrado, não como movimento. A emenda descobre
 * a superfície; o conteúdo entra depois dela.
 */

const played = new WeakSet<Element>();

export function playReveal(element: Element) {
  if (played.has(element)) return;
  played.add(element);

  const el = element as HTMLElement;
  const options = {
    duration: 0.86,
    delay: Number(el.dataset.revealDelay ?? 0) * 0.07,
    ease: EASE.out,
  };

  if (el.dataset.reveal === "clip") {
    animate(
      el,
      {
        clipPath: ["inset(0 0 105% 0)", "inset(0 0 -12% 0)"],
        transform: ["translateY(14px)", "translateY(0px)"],
      },
      options,
    );
  } else if (el.dataset.reveal === "scale") {
    animate(
      el,
      { transform: ["scale(1.06)", "scale(1)"], opacity: [0, 1] },
      options,
    );
  } else {
    animate(
      el,
      { transform: ["translateY(26px)", "translateY(0px)"], opacity: [0, 1] },
      options,
    );
  }
}
