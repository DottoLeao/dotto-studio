import type { Service } from "./types";

export const services: Service[] = [
  {
    number: "01",
    title: { pt: "Sistemas internos", en: "Internal systems" },
    description: {
      pt: "O software sem glamour que faz a empresa rodar: presença, escala, estoque, aprovações. Construído em volta do processo que você já tem, não do que um SaaS presume.",
      en: "The unglamorous software a company runs on: presence, scheduling, inventory, approvals. Built around the process you already have, not the one a SaaS assumes.",
    },
    engagement: {
      pt: "PROJETO TÍPICO — 6 A 10 SEMANAS · PREÇO FECHADO",
      en: "TYPICAL ENGAGEMENT — 6 TO 10 WEEKS · FIXED PRICE",
    },
  },
  {
    number: "02",
    title: { pt: "Produtos web", en: "Web products" },
    description: {
      pt: "Aplicações e interfaces voltadas ao cliente em React e Node — rápidas, acessíveis e possíveis de manter por quem vier depois de nós.",
      en: "Customer-facing applications and interfaces in React and Node — fast, accessible, and maintainable by whoever comes after us.",
    },
    engagement: {
      pt: "PROJETO TÍPICO — 4 A 8 SEMANAS · PREÇO FECHADO",
      en: "TYPICAL ENGAGEMENT — 4 TO 8 WEEKS · FIXED PRICE",
    },
  },
  {
    number: "03",
    title: { pt: "IA aplicada", en: "Applied AI" },
    description: {
      pt: "Modelos, classificação e assistentes onde eles se pagam — e uma resposta honesta quando não se pagam. Normalmente o pipeline de dados é o projeto de verdade.",
      en: "Models, classification and assistants where they pay for themselves — and an honest answer when they don't. Usually the data pipeline is the actual project.",
    },
    engagement: {
      pt: "COMEÇA COM UMA LEITURA DE VIABILIDADE DE 1 SEMANA",
      en: "STARTS WITH A 1-WEEK FEASIBILITY READ",
    },
  },
];
