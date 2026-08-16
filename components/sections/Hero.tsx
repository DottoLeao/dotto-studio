import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/ui/BrandMark";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <header
      id="top"
      data-sec
      data-hero
      data-surface="ink"
      // min-h-svh, não vh: a barra de endereço do celular não estica o hero.
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-gutter pt-28 pb-12"
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-start justify-between gap-6">
        <BrandMark />
        <p className="eyebrow max-w-[9rem] text-right text-bone/55 sm:max-w-none">
          {t("location")}
        </p>
      </div>

      {/* A cena do hero é de ENTRADA/SAÍDA, nunca presa ao scrub: no topo da
          página a rolagem ainda não começou e um scrub nasceria pela metade. */}
      <div data-hero-inner className="mx-auto w-full max-w-[1280px] py-16">
        <p className="eyebrow text-signal">{t("eyebrow")}</p>

        <h1 className="display-tight mt-7 max-w-[19ch] text-h1 text-balance">
          {t("headline")}
        </h1>

        <p className="mt-8 max-w-[54ch] text-lead leading-[1.28] text-bone/72">
          {t("lead")}
        </p>

        <div className="mt-11 flex flex-wrap gap-3">
          <ButtonLink href="#contact" variant="signal">
            {t("ctaPrimary")}
          </ButtonLink>
          <ButtonLink href="#work" variant="outlineBone">
            {t("ctaSecondary")}
          </ButtonLink>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-4">
        <p className="meta-mono text-bone/60">{t("terms")}</p>
        <p className="meta-mono flex items-center gap-2 text-bone/60">
          {t("scrollCue")}
          <span aria-hidden="true">↓</span>
        </p>
      </div>
    </header>
  );
}
