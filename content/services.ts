import type { Service } from "./types";

/**
 * Competências, não pacotes.
 *
 * Antes esta lista vendia projeto — prazo em semanas e preço fechado em cada
 * card. Isso é linguagem de agência, e não é assim que ele opera. Agora cada
 * item declara um terreno técnico que ele domina, e o campo `stack` diz com o
 * que aquilo é feito.
 *
 * Nada entra aqui sem lastro no repositório: offline-first e controle de acesso
 * por linha vêm do Torre Ativa e do Clean App; classificação no browser vem do
 * FinRadar. Competência afirmada é competência que a primeira conversa técnica
 * vai cobrar.
 */
export const services: Service[] = [
  {
    number: "01",
    title: { pt: "Sistemas internos", en: "Internal systems" },
    description: {
      pt: "O software sem glamour que faz a empresa rodar: presença, escala, estoque, aprovações. Construído em volta do processo que você já tem, não do que um SaaS presume.",
      en: "The unglamorous software a company runs on: presence, scheduling, inventory, approvals. Built around the process you already have, not the one a SaaS assumes.",
    },
    stack: {
      pt: "OFFLINE-FIRST · POSTGRES · ACESSO POR LINHA",
      en: "OFFLINE-FIRST · POSTGRES · ROW-LEVEL ACCESS",
    },
  },
  {
    number: "02",
    title: { pt: "Produtos web", en: "Web products" },
    description: {
      pt: "Aplicações e interfaces voltadas ao cliente em React e Node — rápidas, acessíveis e possíveis de manter por quem vier depois de mim.",
      en: "Customer-facing applications and interfaces in React and Node — fast, accessible, and maintainable by whoever comes after me.",
    },
    stack: {
      pt: "NEXT.JS · REACT · ACESSIBILIDADE · PWA",
      en: "NEXT.JS · REACT · ACCESSIBILITY · PWA",
    },
  },
  {
    number: "03",
    title: { pt: "IA aplicada", en: "Applied AI" },
    description: {
      pt: "Modelos, classificação e assistentes onde eles se pagam — e uma resposta honesta quando não se pagam. Normalmente o pipeline de dados é o projeto de verdade.",
      en: "Models, classification and assistants where they pay for themselves — and an honest answer when they don't. Usually the data pipeline is the actual project.",
    },
    stack: {
      pt: "CLASSIFICAÇÃO NO BROWSER · PIPELINE · PYTHON",
      en: "IN-BROWSER CLASSIFICATION · PIPELINES · PYTHON",
    },
  },
];
