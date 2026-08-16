import type messages from "./messages/pt.json";
import type { routing } from "./i18n/routing";

declare global {
  // next-intl lê isto para tipar `useTranslations` / `getTranslations`:
  // uma chave inexistente vira erro de compilação, não MISSING_MESSAGE em runtime.
  interface AppConfig {
    Locale: (typeof routing)["locales"][number];
    Messages: typeof messages;
  }
}
