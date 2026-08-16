import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  // O público descrito pela marca é RS/Brasil. `/en` continua existindo,
  // então nenhuma URL indexada quebra — só a raiz passa a servir PT.
  defaultLocale: "pt",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
