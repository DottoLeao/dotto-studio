/**
 * Markup puro — quem move é o MotionRuntime. O valor de repouso é 0
 * (barra vazia), que é honesto quando o JS não chega.
 */
export function ReadingProgress() {
  return (
    <div
      data-progress
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left scale-x-0 bg-signal"
    />
  );
}
