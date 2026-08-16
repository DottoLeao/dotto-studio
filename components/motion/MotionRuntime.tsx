"use client";

import { useEffect } from "react";
import { animate, inView, scroll } from "motion";

import { EASE, clamp01, easeOut } from "@/lib/motion";

type MotionWindow = Window & { __dottoMotionTimer?: ReturnType<typeof setTimeout> };

/**
 * Único ponto de cliente da coreografia de rolagem. As seções continuam
 * server components e marcam intenção por atributo (`data-reveal`, `data-sec`,
 * `data-count`); quem lê esses atributos é este runtime.
 *
 * Antes isto era GSAP + ScrollTrigger. A troca para Motion mantém o mesmo
 * desenho — atributo declara, runtime interpreta — porque `scroll()` e
 * `inView()` são APIs imperativas, e não exigem transformar oito seções em
 * client components só para animá-las.
 */
export function MotionRuntime() {
  useEffect(() => {
    const html = document.documentElement;

    // O runtime chegou: desarma a rede de segurança do script inline.
    const w = window as MotionWindow;
    if (w.__dottoMotionTimer) {
      clearTimeout(w.__dottoMotionTimer);
      w.__dottoMotionTimer = undefined;
    }

    // Sem a classe, o usuário pediu reduced-motion. Nada é construído — o CSS
    // já entrega todos os estados finais. Não há o que reverter depois.
    if (!html.classList.contains("motion")) return;

    /* ---------- entrada ----------
       Fora do `build()` de propósito: é um disparo único. Se morasse lá
       dentro, uma troca de breakpoint ou o `fonts.ready` reencenariam a
       abertura da página no meio da leitura. */
    document.querySelectorAll<HTMLElement>("[data-enter]").forEach((el, i) => {
      animate(
        el,
        { transform: ["translateY(18px)", "translateY(0px)"], opacity: [0, 1] },
        { duration: 0.9, delay: 0.06 + i * 0.075, ease: EASE.out },
      );
    });

    const desktop = window.matchMedia("(min-width: 901px)");
    let scenes: VoidFunction[] = [];

    const build = () => {
      const isDesktop = desktop.matches;
      const add = (stop: VoidFunction) => scenes.push(stop);

      /** `scroll()` devolve só o descarte do listener; a animação com scrub
       *  precisa parar junto, senão sobra um playback vivo a cada rebuild. */
      const addScrub = (
        controls: ReturnType<typeof animate>,
        options?: Parameters<typeof scroll>[1],
      ) => {
        const stop = scroll(controls, options);
        add(() => {
          stop();
          controls.stop();
        });
      };

      /* ---------- barra de progresso de leitura ---------- */
      const bar = document.querySelector<HTMLElement>("[data-progress]");
      if (bar) {
        addScrub(
          animate(
            bar,
            { transform: ["scaleX(0)", "scaleX(1)"] },
            { ease: "linear" },
          ),
        );
      }

      /* ---------- saída do hero ---------- */
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const heroInner = document.querySelector<HTMLElement>("[data-hero-inner]");
      if (hero && heroInner) {
        addScrub(
          animate(
            heroInner,
            {
              transform: ["translateY(0px)", "translateY(-46px)"],
              opacity: [1, 0],
            },
            { ease: "linear" },
          ),
          // opacidade zera em ~87% da saída, como no protótipo
          { target: hero, offset: ["start start", "87% start"] },
        );
      }

      /* ---------- depth dissolve das seções ----------
         O hero tem a própria saída; o chapter card contém um filho sticky e
         transform nele quebraria o sticky. Ambos ficam de fora. */
      const sections = document.querySelectorAll<HTMLElement>(
        "[data-sec]:not([data-hero])",
      );

      sections.forEach((sec) => {
        // Equivalente ao `end: "+=X"` do ScrollTrigger: a seção sobe exatamente
        // o mesmo tanto que a rolagem, então distância de rolagem e distância
        // percorrida pelo alvo são a mesma medida.
        const span = Math.max(
          sec.offsetHeight * 0.55,
          window.innerHeight * 0.55,
        );

        addScrub(
          animate(
            sec,
            {
              transform: [
                "translateY(0px) scale(1)",
                "translateY(-26px) scale(0.945)",
              ],
              opacity: [1, 0.38],
              // blur é a coisa mais cara do protótipo: repinta a camada
              // inteira a cada frame. Só desktop.
              ...(isDesktop ? { filter: ["blur(0px)", "blur(3.4px)"] } : null),
            },
            { ease: "linear" },
          ),
          { target: sec, offset: ["start start", `${Math.round(span)}px start`] },
        );
      });

      /* ---------- cena assinatura: iris ---------- */
      const chapter = document.querySelector<HTMLElement>("[data-chapter]");
      if (chapter) {
        const signal = chapter.querySelector<HTMLElement>('[data-iris="signal"]');
        const ink = chapter.querySelector<HTMLElement>('[data-iris="ink"]');
        const copy = Array.from(
          chapter.querySelectorAll<HTMLElement>("[data-chapter-copy]"),
        );

        // No celular a janela da copy abre antes e dura mais: 180vh de
        // transição de cor sem payload lê como página travada.
        const copyStart = isDesktop ? 0.5 : 0.42;
        const copySpan = isDesktop ? 0.22 : 0.34;

        // O raio é escrito como inteiro; abaixo de 1px de diferença o estilo
        // não muda de verdade e a escrita seria repintura desperdiçada.
        let lastSignal = -1;
        let lastInk = -1;

        add(
          scroll(
            (progress: number) => {
              const rMax =
                Math.max(window.innerWidth, window.innerHeight) * 1.15;

              if (signal) {
                const r = Math.round(
                  easeOut(clamp01((progress - 0.04) / 0.34)) * rMax,
                );
                if (r !== lastSignal) {
                  lastSignal = r;
                  signal.style.clipPath = `circle(${r}px at 50% 50%)`;
                }
              }
              if (ink) {
                const r = Math.round(
                  easeOut(clamp01((progress - 0.22) / 0.36)) * rMax,
                );
                if (r !== lastInk) {
                  lastInk = r;
                  ink.style.clipPath = `circle(${r}px at 50% 50%)`;
                }
              }

              for (let i = 0; i < copy.length; i++) {
                const t = clamp01((progress - copyStart) / copySpan - i * 0.12);
                const el = copy[i];
                el.style.opacity = t.toFixed(3);
                el.style.transform = `translateY(${((1 - t) * 22).toFixed(1)}px)`;
              }
            },
            { target: chapter, offset: ["start start", "end end"] },
          ),
        );

        // clip-path não é promovido sozinho: will-change só enquanto a cena
        // está em tela, nunca durante a página inteira.
        add(
          inView(chapter, () => {
            if (signal) signal.style.willChange = "clip-path";
            if (ink) ink.style.willChange = "clip-path";
            return () => {
              if (signal) signal.style.willChange = "auto";
              if (ink) ink.style.willChange = "auto";
            };
          }),
        );
      }

      /* ---------- reveals em escada ---------- */
      const revealed = new WeakSet<Element>();
      add(
        inView(
          "[data-reveal]",
          (element) => {
            if (revealed.has(element)) return;
            revealed.add(element);

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
                {
                  transform: ["translateY(26px)", "translateY(0px)"],
                  opacity: [0, 1],
                },
                options,
              );
            }
          },
          { margin: "0px 0px -10% 0px" },
        ),
      );

      /* ---------- contadores ---------- */
      const counted = new WeakSet<Element>();
      add(
        inView(
          "[data-count]",
          (element) => {
            if (counted.has(element)) return;
            counted.add(element);

            const target = Number((element as HTMLElement).dataset.count ?? 0);
            animate(0, target, {
              duration: 1.1,
              ease: EASE.out,
              onUpdate: (value) => {
                element.textContent = String(Math.round(value));
              },
            });
          },
          { margin: "0px 0px -15% 0px" },
        ),
      );

      /* ---------- footer reveal ----------
         A geometria é CSS puro: o rodapé é `sticky bottom-0` atrás do <main>,
         que é opaco e passa por cima. Não há medição, não há custom property
         e não há um frame em que o rodapé apareça no lugar errado.

         Ao JS sobra só a entrada do conteúdo do rodapé, conforme ele é
         descoberto. As duas medidas ficam em cache: lê-las a cada frame
         forçaria reflow dentro do callback de scroll. */
      const footer = document.querySelector<HTMLElement>("[data-footer-reveal]");
      const main = document.getElementById("main");
      const inner = footer?.querySelector<HTMLElement>("[data-footer-inner]");

      if (footer && main && inner) {
        let footerHeight = footer.offsetHeight || 1;
        let mainBottom = main.offsetTop + main.offsetHeight;

        const measure = () => {
          footerHeight = footer.offsetHeight || 1;
          mainBottom = main.offsetTop + main.offsetHeight;
        };

        const ro = new ResizeObserver(measure);
        ro.observe(main);
        ro.observe(footer);
        add(() => ro.disconnect());

        let last = -1;
        add(
          scroll(() => {
            // Quanto do rodapé a borda inferior da tela já descobriu.
            const uncovered =
              window.scrollY + window.innerHeight - mainBottom;
            const p = clamp01(uncovered / footerHeight);

            if (Math.abs(p - last) < 0.004) return;
            last = p;
            inner.style.opacity = p.toFixed(3);
            inner.style.transform = `translateY(${((1 - p) * 28).toFixed(1)}px)`;
          }),
        );
      }
    };

    const teardown = () => {
      for (let i = 0; i < scenes.length; i++) scenes[i]();
      scenes = [];
    };

    const rebuild = () => {
      teardown();
      build();
    };

    build();
    desktop.addEventListener("change", rebuild);

    // Archivo 900 é muito mais larga que a fallback: sem este rebuild, todo
    // offset foi medido contra o layout da fonte errada.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) rebuild();
    });

    /* ---------- âncoras ----------
       Fora do build: navegação por link tem que funcionar em qualquer largura
       e não deve ser desmontada a cada troca de breakpoint. */
    const onClick = (event: MouseEvent) => {
      // Clique com modificador é intenção de abrir em outra aba — não é nosso.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link) return;

      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const dest = document.querySelector<HTMLElement>(id);
      if (!dest) return;

      event.preventDefault();

      const from = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const to = Math.min(dest.getBoundingClientRect().top + from, max);

      animate(from, to, {
        duration: 0.8,
        ease: EASE.inOut,
        onUpdate: (value) => window.scrollTo(0, value),
      });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      desktop.removeEventListener("change", rebuild);
      document.removeEventListener("click", onClick);
      teardown();
    };
  }, []);

  return null;
}
