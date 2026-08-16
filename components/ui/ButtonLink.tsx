import type { ComponentProps } from "react";

type Variant = "signal" | "outlineBone" | "outlineInk" | "ink";

const VARIANTS: Record<Variant, string> = {
  // Signal como preenchimento, texto Ink — o contraste que a marca pede.
  signal: "bg-signal text-ink hover:bg-bone",
  outlineBone: "border border-bone/35 text-bone hover:border-bone hover:bg-bone hover:text-ink",
  outlineInk: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-bone",
  ink: "bg-ink text-bone hover:bg-signal hover:text-ink",
};

type Props = ComponentProps<"a"> & {
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
  return (
    <a
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
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
    </a>
  );
}
