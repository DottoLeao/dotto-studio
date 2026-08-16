import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("nav");

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-signal focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:tracking-[0.14em] focus:text-ink focus:uppercase"
    >
      {t("skipToContent")}
    </a>
  );
}
