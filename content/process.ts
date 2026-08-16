import type { ProcessStep } from "./types";

export const processSteps: ProcessStep[] = [
  {
    marker: { pt: "SEMANA 0", en: "WEEK 0" },
    description: {
      pt: "Leitura do processo — no local ou em call",
      en: "Process read — on site or on call",
    },
  },
  {
    marker: { pt: "SEMANA 1", en: "WEEK 1" },
    description: {
      pt: "Escopo, preço e datas — por escrito",
      en: "Scope, price and dates — in writing",
    },
  },
  {
    marker: { pt: "2 — 6", en: "2 — 6" },
    description: {
      pt: "Build, demo semanal, ajuste",
      en: "Build, weekly demo, adjust",
    },
  },
  {
    marker: { pt: "DEPOIS", en: "AFTER" },
    description: {
      pt: "Em produção, documentado, entregue rodando",
      en: "Deployed, documented, handed over running",
    },
  },
];
