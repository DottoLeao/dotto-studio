/**
 * "Dotto" + o ponto Signal. A regra da marca: um elemento Signal por
 * superfície, e ele é sempre a última coisa que se lê.
 */
export function BrandMark({
  className = "",
  tone = "bone",
}: {
  className?: string;
  tone?: "bone" | "ink";
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-display text-2xl font-black tracking-[-0.05em] ${
        tone === "bone" ? "text-bone" : "text-ink"
      } ${className}`}
    >
      Dotto
      <span
        aria-hidden="true"
        className="inline-block size-2 rounded-full bg-signal"
      />
    </span>
  );
}
