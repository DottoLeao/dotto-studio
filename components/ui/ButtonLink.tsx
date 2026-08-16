"use client";

import type { ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";

type Variant = "signal" | "outlineBone" | "outlineInk" | "ink";

const VARIANTS: Record<Variant, string> = {
  // Signal como preenchimento, texto Ink — o contraste que a marca pede.
  signal: "bg-signal text-ink hover:bg-bone",
  outlineBone: "border border-bone/35 text-bone hover:border-bone hover:bg-bone hover:text-ink",
  outlineInk: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-bone",
  ink: "bg-ink text-bone hover:bg-signal hover:text-ink",
};

/** Os handlers de animação do DOM colidem em nome com os do Motion. */
type Props = Omit<
  ComponentProps<"a">,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd" | "ref" | "style"
> & {
  variant?: Variant;
  external?: boolean;
};

export function ButtonLink({
  variant = "signal",
  external = false,
  className = "",
  children,
  ...rest
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.a
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      // Levantar no hover e ceder no toque. Spring curta e quase sem bounce:
      // o overshoot é o que separa "responde ao dedo" de "brinquedo", e este
      // é um site de estúdio de software.
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { y: 0, scale: 0.975 }}
      transition={{ type: "spring", visualDuration: 0.22, bounce: 0.18 }}
      className={[
        // min-h-12 garante o alvo de toque de 44px+ no mobile
        "inline-flex min-h-12 items-center justify-center px-7 py-3.5",
        "font-mono text-xs font-medium tracking-[0.14em] uppercase",
        "transition-colors duration-200",
        VARIANTS[variant],
        className,
      ].join(" ")}
    >
      {children}
    </motion.a>
  );
}
