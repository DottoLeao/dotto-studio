"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Texto PT / EN, não bandeira. O site antigo representava inglês com a
 * bandeira da Austrália; idioma não é país.
 *
 * A aparência é injetada por quem usa: hoje o único consumidor é o menu
 * radial, onde o controle é um círculo. A troca de idioma em si — rota,
 * transição, estado pendente — continua morando aqui, num lugar só.
 */
export function LocaleSwitch({
  className = "",
  onSwitched,
}: {
  className?: string;
  onSwitched?: () => void;
}) {
  const t = useTranslations("locale");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const next = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={t("switchLabel")}
      onClick={() => {
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
        onSwitched?.();
      }}
      className={
        className ||
        "meta-mono inline-flex min-h-11 min-w-11 items-center justify-center text-bone/72 transition-colors hover:text-bone disabled:opacity-50"
      }
    >
      {t("switchTo")}
    </button>
  );
}
