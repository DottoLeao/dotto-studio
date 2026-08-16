"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/ui/BrandMark";
import { LocaleSwitch } from "./LocaleSwitch";

/**
 * A nav materializa depois de 72% da primeira dobra. Isto é mudança de
 * estado, não animação — vale inclusive em reduced-motion (o CSS só encurta
 * a transição).
 */
export function SiteNav() {
  const t = useTranslations("nav");
  const [stuck, setStuck] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const read = () => {
      frame.current = 0;
      setStuck(window.scrollY > window.innerHeight * 0.72);
    };
    const onScroll = () => {
      // Um rAF por burst de scroll; nada de loop ocioso.
      if (!frame.current) frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label={t("home")}
      data-surface="ink"
      className={[
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6",
        "border-b border-bone/12 bg-ink/86 px-gutter py-4 backdrop-blur-[14px]",
        "transition-transform duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)]",
        stuck ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <a
        href="#top"
        className="flex min-h-11 items-center"
        aria-label={t("home")}
      >
        <BrandMark className="text-xl" />
      </a>

      <div className="flex items-center gap-7">
        {/* Escondidos abaixo de 900px, como no protótipo. */}
        <ul className="hidden items-center gap-7 min-[901px]:flex">
          {(["work", "services", "code", "about"] as const).map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                className="meta-mono inline-flex min-h-11 items-center text-bone/72 transition-colors hover:text-bone"
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        <LocaleSwitch />

        <a
          href="#contact"
          className="meta-mono inline-flex min-h-11 items-center bg-signal px-5 text-ink transition-colors hover:bg-bone"
        >
          {t("cta")}
        </a>
      </div>
    </nav>
  );
}
