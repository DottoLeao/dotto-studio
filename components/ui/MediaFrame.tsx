import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

import type { MediaSlot } from "@/content/types";
import type { Locale } from "@/i18n/routing";

/**
 * Imagem real ou quadro assumido. O placeholder é deliberadamente legível
 * como "asset pendente" — nunca uma foto de banco fingindo ser o produto.
 */
export function MediaFrame({
  slot,
  className = "",
  priority = false,
}: {
  slot: MediaSlot;
  className?: string;
  priority?: boolean;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("media");

  if (slot.kind === "image") {
    return (
      <Image
        src={slot.src}
        alt={slot.alt[locale]}
        width={slot.width}
        height={slot.height}
        priority={priority}
        sizes="(max-width: 900px) 100vw, 60vw"
        className={`h-auto w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`media-hatch flex items-center justify-center ${className}`}
      style={{ aspectRatio: slot.ratio }}
    >
      <div className="hatch-label px-6 text-center">
        <p className="eyebrow">{slot.label[locale]}</p>
        <p className="meta-mono mt-2 opacity-70">{t("pending")}</p>
      </div>
    </div>
  );
}
