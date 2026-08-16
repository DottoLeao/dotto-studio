"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type MotionWindow = Window & { __dottoMotionTimer?: ReturnType<typeof setTimeout> };

/**
 * Único ponto de cliente do site. As seções continuam server components e
 * marcam intenção por atributo (`data-reveal`, `data-sec`, `data-count`);
 * quem lê esses atributos é este runtime.
 */
export function MotionRuntime() {
  useGSAP(() => {
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

    if (process.env.NODE_ENV !== "production") {
      // Handle de inspeção: permite forçar ScrollTrigger.update() de forma
      // síncrona em ambientes onde o requestAnimationFrame não roda
      // (aba oculta, painel headless). Não existe em produção.
      (window as unknown as Record<string, unknown>).__dotto = {
        gsap,
        ScrollTrigger,
      };
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 901px)",
        isMobile: "(max-width: 900px)",
      },
      (ctx) => {
        const { isDesktop } = ctx.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        /* ---------- barra de progresso de leitura ---------- */
        const bar = document.querySelector<HTMLElement>("[data-progress]");
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        /* ---------- saída do hero ---------- */
        const heroInner = document.querySelector<HTMLElement>("[data-hero-inner]");
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        if (heroInner && hero) {
          gsap.to(heroInner, {
            y: -46,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              // opacidade zera em ~87% da saída, como no protótipo
              end: "87% top",
              scrub: true,
              invalidateOnRefresh: true,
              onToggle: (self) => {
                heroInner.style.willChange = self.isActive
                  ? "transform, opacity"
                  : "auto";
              },
            },
          });
        }

        /* ---------- depth dissolve das seções ----------
           O hero tem a própria saída; o chapter card contém um filho sticky e
           transform nele quebraria o sticky. Ambos ficam de fora. */
        const sections = gsap.utils.toArray<HTMLElement>(
          "[data-sec]:not([data-hero])",
        );

        sections.forEach((sec) => {
          gsap.to(sec, {
            scale: 0.945,
            y: -26,
            opacity: 0.38,
            // blur é a coisa mais cara do protótipo: repinta a camada inteira
            // a cada frame. Só desktop.
            ...(isDesktop ? { filter: "blur(3.4px)" } : null),
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top top",
              end: () =>
                `+=${Math.max(sec.offsetHeight * 0.55, window.innerHeight * 0.55)}`,
              scrub: true,
              invalidateOnRefresh: true,
              onToggle: (self) => {
                // will-change só enquanto anima. Deixar ligado em 8 seções de
                // tela cheia estoura a memória de GPU de celular mediano.
                sec.style.willChange = self.isActive
                  ? "transform, opacity"
                  : "auto";
              },
            },
          });
        });

        /* ---------- cena assinatura: iris ---------- */
        const chapter = document.querySelector<HTMLElement>("[data-chapter]");
        if (chapter) {
          const signal = chapter.querySelector<HTMLElement>('[data-iris="signal"]');
          const ink = chapter.querySelector<HTMLElement>('[data-iris="ink"]');
          const copy = gsap.utils.toArray<HTMLElement>(
            "[data-chapter-copy]",
            chapter,
          );

          // No celular a janela da copy abre antes e dura mais: 180vh de
          // transição de cor sem payload lê como página travada.
          const copyStart = isDesktop ? 0.5 : 0.42;
          const copySpan = isDesktop ? 0.22 : 0.34;

          ScrollTrigger.create({
            trigger: chapter,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const rMax =
                Math.max(window.innerWidth, window.innerHeight) * 1.15;

              if (signal) {
                const r = easeOut(clamp01((p - 0.04) / 0.34)) * rMax;
                signal.style.clipPath = `circle(${r.toFixed(0)}px at 50% 50%)`;
              }
              if (ink) {
                const r = easeOut(clamp01((p - 0.22) / 0.36)) * rMax;
                ink.style.clipPath = `circle(${r.toFixed(0)}px at 50% 50%)`;
              }
              copy.forEach((el, i) => {
                const t = clamp01((p - copyStart) / copySpan - i * 0.12);
                el.style.opacity = String(t.toFixed(3));
                el.style.transform = `translateY(${((1 - t) * 22).toFixed(1)}px)`;
              });
            },
            onToggle: (self) => {
              const v = self.isActive ? "clip-path" : "auto";
              if (signal) signal.style.willChange = v;
              if (ink) ink.style.willChange = v;
            },
          });
        }

        /* ---------- reveals em escada ---------- */
        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        if (reveals.length) {
          ScrollTrigger.batch(reveals, {
            start: "top 90%",
            once: true,
            onEnter: (batch) => {
              batch.forEach((el) => {
                const delay =
                  Number((el as HTMLElement).dataset.revealDelay ?? 0) * 0.07;
                const variant = (el as HTMLElement).dataset.reveal;

                const to: gsap.TweenVars = {
                  duration: 0.86,
                  delay,
                  ease: "power3.out",
                  clearProps: "willChange",
                };

                if (variant === "clip") {
                  Object.assign(to, { clipPath: "inset(0 0 -12% 0)", y: 0 });
                } else if (variant === "scale") {
                  Object.assign(to, { scale: 1, opacity: 1 });
                } else {
                  Object.assign(to, { y: 0, opacity: 1 });
                }

                gsap.to(el, to);
              });
            },
          });
        }

        /* ---------- contadores ---------- */
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count ?? 0);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });
      },
    );

    /* ---------- âncoras ----------
       Fora do matchMedia: navegação por link tem que funcionar em qualquer
       largura, e este handler não é animação de rolagem. */
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const dest = document.querySelector(id);
      if (!dest) return;

      event.preventDefault();
      gsap.to(window, {
        duration: 0.8,
        ease: "power2.inOut",
        scrollTo: { y: dest, autoKill: true },
      });
    };
    document.addEventListener("click", onClick);

    // Archivo 900 é muito mais larga que a fallback: sem este refresh, todo
    // start/end foi calculado contra o layout da fonte errada.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      mm.revert();
    };
  }, []);

  return null;
}
