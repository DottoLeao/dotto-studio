import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/ui/BrandMark";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-ink px-gutter py-14">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-6 border-t border-bone/15 pt-10">
        <BrandMark className="text-xl" />
        <p className="meta-mono text-bone/60">{t("location")}</p>
        <p className="meta-mono text-bone/60">
          {t("rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
