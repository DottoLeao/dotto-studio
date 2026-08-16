import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { BrandMark } from "@/components/ui/BrandMark";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-ink px-gutter text-center">
      <BrandMark />
      <h1 className="display-tight max-w-[16ch] text-h3">{t("title")}</h1>
      <p className="max-w-[46ch] text-lg leading-[1.5] text-bone/70">
        {t("lead")}
      </p>
      <ButtonLink href="/" variant="signal">
        {t("cta")}
      </ButtonLink>
    </main>
  );
}
