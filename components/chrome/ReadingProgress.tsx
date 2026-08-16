/**
 * Markup puro — quem move é o MotionRuntime. O valor de repouso é 0
 * (barra vazia), que é honesto quando o JS não chega.
 *
 * O estado inicial é `transform` inline, não a utilitária `scale-x-0`: no
 * Tailwind v4 aquela classe compila para a propriedade `scale`, que o
 * `transform` do Motion não sobrescreve — a barra ficaria zerada para sempre.
 */
export function ReadingProgress() {
  return (
    <div
      data-progress
      aria-hidden="true"
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-signal"
    />
  );
}
