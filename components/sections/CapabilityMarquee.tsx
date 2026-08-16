import { useLocale } from "next-intl";

import { capabilities } from "@/content/manifesto";
import type { Locale } from "@/i18n/routing";

export function CapabilityMarquee() {
  const locale = useLocale() as Locale;
  const items = capabilities[locale];

  return (
    <section
      data-surface="ink"
      className="overflow-hidden border-y border-bone/12 bg-ink py-5"
      aria-label={items.join(", ")}
    >
      {/* Duas cópias exatas: a animação percorre -50% e volta ao mesmo frame.
          A segunda é aria-hidden para o leitor de tela não ler duas vezes. */}
      <div className="marquee-track">
        {[0, 1].map((copy) => (
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
      </div>
    </section>
  );
}
