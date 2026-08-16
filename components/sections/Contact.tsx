import { useTranslations } from "next-intl";

import { SeamLayer } from "@/components/motion/SeamLayer";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/content/site";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section
      id="contact"
      data-seam="grid-drop"
      data-surface="bone"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-bone px-gutter py-section text-ink"
    >
      {/* Folha INK que desce em patamares, pousando na base de cada bloco. */}
      <SeamLayer tone="ink" />

      <div className="mx-auto w-full max-w-[1280px]">
        <h2
          id="contact-heading"
          data-reveal
          className="display-tight max-w-[18ch] text-h2 text-balance"
        >
          {t("heading")}
        </h2>

        <p
          data-reveal
          data-reveal-delay="1"
          className="mt-8 max-w-[56ch] text-lg leading-[1.6] text-ink/75"
        >
          {t("lead")}
        </p>

        <div data-reveal data-reveal-delay="2" className="mt-12 flex flex-wrap gap-3">
          {/* O rótulo diz WhatsApp porque o destino é o WhatsApp.
              "Agendar uma conversa" abrindo um chat é promessa trocada. */}
          <ButtonLink href={site.whatsapp} variant="ink" external>
            {t("whatsapp")}
          </ButtonLink>
          <ButtonLink href={`mailto:${site.email}`} variant="outlineInk">
            {t("email")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
