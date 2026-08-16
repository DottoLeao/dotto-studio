import type { Principle } from "./types";

export const principles: Principle[] = [
  {
    number: "01",
    title: {
      pt: "Começamos pelo processo",
      en: "We start with the process",
    },
    description: {
      pt: "Dois dias no local ou em call, observando como o trabalho acontece de verdade. O software vem depois.",
      en: "Two days on site or on call, watching how the work actually happens. The software comes after.",
    },
  },
  {
    number: "02",
    title: {
      pt: "Entregamos a parte chata primeiro",
      en: "Ship the boring part first",
    },
    description: {
      pt: "Captura de dados antes de dashboard. Um ponto de entrada limpo resolve metade do que chamam de problema de IA.",
      en: "Data capture before dashboards. A clean entry point solves half of what people call an AI problem.",
    },
  },
  {
    number: "03",
    title: {
      pt: "Entregamos rodando",
      en: "Hand it over running",
    },
    description: {
      pt: "Documentado, em produção, e simples o bastante para a equipe continuar usando no sexto mês.",
      en: "Documented, deployed, and simple enough that the team keeps using it in month six.",
    },
  },
];

/** Itens do marquee de capacidades. Duplicados na renderização, não aqui. */
export const capabilities = {
  pt: [
    "Ferramentas internas",
    "Painéis de operação",
    "React & Node",
    "IA aplicada",
    "Pipelines de dados",
    "Integrações",
    "Apps de campo, offline-first",
  ],
  en: [
    "Internal tools",
    "Operations dashboards",
    "React & Node",
    "Applied AI",
    "Data pipelines",
    "Integrations",
    "Field apps, offline-first",
  ],
};
