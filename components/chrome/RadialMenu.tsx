"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

import { LocaleSwitch } from "./LocaleSwitch";

/**
 * A navegação inteira do site, num controle só.
 *
 * Substitui a barra fixa do topo: abaixo de 900px ela escondia os links e
 * sobrava logo + idioma + CTA, o que deixava metade do site sem rota. Aqui os
 * seis destinos existem em qualquer largura, e o controle acompanha a rolagem
 * porque é `fixed` — não porque alguém escuta o scroll.
 *
 * Isto é navegação, não decoração: renderiza e funciona igual em
 * reduced-motion. O que a preferência desliga é o percurso, nunca o destino.
 */

type Item = {
  key: string;
  href: string;
  label: string;
  /** O CTA é o único item Signal — a regra de um Signal por superfície. */
  accent?: boolean;
  icon: React.ReactNode;
};

/* ---------- ícones ----------
   Desenhados aqui, não importados: 20×20, traço 1.6, cantos retos e nenhuma
   curva decorativa — a mesma geometria seca da tipografia da marca. Um pacote
   de ícones traria 400 formas com outra voz para usar cinco. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IconWork = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="1" {...stroke} />
    <path d="M3.2 10.2h17.6" {...stroke} />
  </svg>
);

const IconServices = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <path d="M4 7h16M4 12h11M4 17h7" {...stroke} />
  </svg>
);

const IconCode = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <path d="M9 6 4 12l5 6M15 6l5 6-5 6" {...stroke} />
  </svg>
);

const IconAbout = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <circle cx="12" cy="9" r="3.2" {...stroke} />
    <path d="M5.2 19c1.6-3.2 4-4.8 6.8-4.8s5.2 1.6 6.8 4.8" {...stroke} />
  </svg>
);

const IconContact = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <path d="M7 17 17 7M9.4 7H17v7.6" {...stroke} />
  </svg>
);

/* ---------- geometria do arco ----------
   Seis itens entre 90° (para cima) e 180° (para a esquerda). Esses dois
   extremos são escolha, não estética: o botão vive no canto inferior direito,
   então qualquer ângulo fora desse quadrante joga item para fora da tela. */

const FROM = 90;
const TO = 180;

function seat(index: number, count: number, radius: number) {
  const angle = ((FROM + (index * (TO - FROM)) / (count - 1)) * Math.PI) / 180;
  return { x: Math.cos(angle) * radius, y: -Math.sin(angle) * radius };
}

export function RadialMenu() {
  const t = useTranslations("nav");
  const tLocale = useTranslations("locale");

  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  // O rótulo do item sob o cursor/foco. Um leitor só, ao lado do botão:
  // rótulo preso a cada assento passava por baixo do círculo vizinho.
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);

  // Raio menor no celular: o arco tem que caber entre o polegar e a borda.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const read = () => setCompact(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) toggleRef.current?.focus();
  }, []);

  // Escape volta o foco para o botão; clique fora só fecha. Perder o foco no
  // corpo do documento depois de fechar por teclado é o erro clássico aqui.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close(true);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  // Abriu: o foco vai para o primeiro destino. Sem isto, quem navega por
  // teclado abre o menu e continua com o foco no botão, tendo que tabular
  // para trás no DOM para alcançar o que acabou de pedir.
  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  const items: Item[] = [
    { key: "work", href: "#work", label: t("work"), icon: IconWork },
    { key: "services", href: "#services", label: t("services"), icon: IconServices },
    { key: "code", href: "#code", label: t("code"), icon: IconCode },
    { key: "about", href: "#about", label: t("about"), icon: IconAbout },
    { key: "cta", href: "#contact", label: t("cta"), accent: true, icon: IconContact },
  ];

  const count = items.length + 1; // + o seletor de idioma
  // Seis assentos num arco de 90°: a corda entre vizinhos é 0,31 × raio, e ela
  // precisa ficar maior que o diâmetro do assento. 186 dá ~58px de corda para
  // círculos de 50 — folga real, não encostado.
  const radius = compact ? 152 : 186;
  const size = compact ? "size-11" : "size-[3.125rem]";

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, visualDuration: 0.34, bounce: 0.28 };

  /**
   * A escada é calculada por item, não herdada de `staggerChildren`: a
   * propagação de variants do pai só funciona enquanto o filho NÃO declara
   * `animate`, e aqui cada assento precisa do próprio `custom` para saber em
   * que ângulo senta. Delay explícito é o que sobra — e é mais previsível.
   */
  const seatVariants = {
    closed: (i: number) => ({
      opacity: 0,
      scale: 0.4,
      x: 0,
      y: 0,
      // Recolhe de fora para dentro: o inverso da ordem de abertura.
      transition: { ...spring, delay: reduced ? 0 : (count - 1 - i) * 0.025 },
    }),
    open: (i: number) => ({
      opacity: 1,
      scale: 1,
      ...seat(i, count, radius),
      transition: { ...spring, delay: reduced ? 0 : i * 0.035 },
    }),
  };

  return (
    <div
      ref={rootRef}
      data-surface="ink"
      className="pointer-events-none fixed inset-0 z-70"
    >
      {/* Véu: escurece a página e dá um alvo de clique para fechar. Não é
          backdrop-blur — borrar a página inteira a 60fps num celular médio
          custa mais do que o efeito entrega. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="veil"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: "easeOut" }}
            className="pointer-events-auto absolute inset-0 bg-ink/72"
          />
        ) : null}
      </AnimatePresence>

      <nav
        aria-label={t("menuLabel")}
        className="pointer-events-none absolute right-gutter bottom-gutter"
      >
        <ul className="absolute right-0 bottom-0 list-none">
          <AnimatePresence>
            {open
              ? [...items, null].map((item, index) => {
                  const isLocale = item === null;

                  return (
                    <motion.li
                      key={isLocale ? "locale" : item.key}
                      custom={index}
                      variants={seatVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      // O item nasce no centro do botão; x/y do variant o
                      // levam ao assento. `absolute` com right/bottom zerados
                      // ancora todos no mesmo ponto de partida.
                      className="pointer-events-auto absolute right-0 bottom-0"
                      style={{ width: compact ? 44 : 50, height: compact ? 44 : 50 }}
                      onPointerEnter={() =>
                        setActive(isLocale ? tLocale("switchLabel") : item.label)
                      }
                      onPointerLeave={() => setActive(null)}
                      onFocusCapture={() =>
                        setActive(isLocale ? tLocale("switchLabel") : item.label)
                      }
                      onBlurCapture={() => setActive(null)}
                    >
                      {isLocale ? (
                        <LocaleSwitch
                          onSwitched={() => close(false)}
                          className={[
                            size,
                            "meta-mono flex items-center justify-center rounded-full",
                            "border border-bone/25 bg-ink text-bone/80",
                            "transition-colors hover:border-bone hover:text-bone",
                            "disabled:opacity-50",
                          ].join(" ")}
                        />
                      ) : (
                        <a
                          ref={index === 0 ? firstItemRef : undefined}
                          href={item.href}
                          onClick={() => close(false)}
                          className={[
                            size,
                            "flex items-center justify-center rounded-full transition-colors",
                            item.accent
                              ? "bg-signal text-ink hover:bg-bone"
                              : "border border-bone/25 bg-ink text-bone/80 hover:border-bone hover:text-bone",
                          ].join(" ")}
                        >
                          {item.icon}
                          <span className="sr-only">{item.label}</span>
                        </a>
                      )}

                    </motion.li>
                  );
                })
              : null}
          </AnimatePresence>
        </ul>

        {/* Leitor do item ativo, ABAIXO do botão.
            À esquerda seria o lugar óbvio e é justamente onde não cabe: o
            assento de 180° ocupa aquela mesma linha horizontal, e um rótulo
            longo — "Começar um projeto" — encostaria nele. Abaixo do botão
            nenhum assento alcança, porque o arco inteiro vive acima. */}
        <AnimatePresence>
          {open && active ? (
            <motion.span
              key={active}
              aria-hidden="true"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
              className="meta-mono pointer-events-none absolute top-full right-0 mt-2 whitespace-nowrap text-bone/75 max-sm:hidden"
            >
              {active}
            </motion.span>
          ) : null}
        </AnimatePresence>

        <motion.button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-label={open ? t("menuClose") : t("menuOpen")}
          onClick={() => setOpen((v) => !v)}
          whileHover={reduced ? undefined : { scale: 1.06 }}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          transition={spring}
          className={[
            "pointer-events-auto relative flex items-center justify-center rounded-full",
            "bg-signal text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)]",
            compact ? "size-14" : "size-16",
          ].join(" ")}
        >
          {/* Duas barras que viram X. Rotação e y são transforms
              independentes de propósito: cada barra tem o próprio destino. */}
          <motion.span
            aria-hidden="true"
            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
            transition={spring}
            className="absolute h-[1.6px] w-5 rounded-full bg-ink"
          />
          <motion.span
            aria-hidden="true"
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
            transition={spring}
            className="absolute h-[1.6px] w-5 rounded-full bg-ink"
          />
        </motion.button>
      </nav>
    </div>
  );
}
