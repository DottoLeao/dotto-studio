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

/**
 * Itens do marquee de capacidades. Duplicados na renderização, não aqui.
 *
 * As duas listas têm de andar na MESMA ordem e no mesmo tamanho: é a mesma
 * faixa em dois idiomas, não duas faixas diferentes.
 *
 * Só entra aqui o que ele de fato construiu e defenderia numa entrevista.
 * Marquee é vitrine, e vitrine que promete o que não existe é o tipo de dívida
 * que aparece na primeira conversa técnica.
 */
export const capabilities = {
  pt: [
    "Ferramentas internas",
    "Painéis de operação",
    "React & Node",
    "IA aplicada",
    "Pipelines de dados",
    "Integrações",
    "Apps de campo, offline-first",
    "TypeScript ponta a ponta",
    "Next.js",
    "PostgreSQL",
    "Supabase",
    "Modelagem de dados",
    "Automação de processo",
    "Saída de planilha",
    "Relatório que ninguém monta à mão",
    "Controle de acesso por linha",
    "Autenticação e permissões",
    "Notificação e web push",
    "PWA instalável",
    "Teste end-to-end",
    "APIs REST",
    "Python para dados",
    "Docker",
    "Deploy e observabilidade",
  ],
  en: [
    "Internal tools",
    "Operations dashboards",
    "React & Node",
    "Applied AI",
    "Data pipelines",
    "Integrations",
    "Field apps, offline-first",
    "TypeScript end to end",
    "Next.js",
    "PostgreSQL",
    "Supabase",
    "Data modelling",
    "Process automation",
    "Getting off spreadsheets",
    "Reports nobody assembles by hand",
    "Row-level access control",
    "Auth and permissions",
    "Notifications and web push",
    "Installable PWA",
    "End-to-end tests",
    "REST APIs",
    "Python for data",
    "Docker",
    "Deploy and observability",
  ],
};
