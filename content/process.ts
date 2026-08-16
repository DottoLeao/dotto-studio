import type { ProcessStep } from "./types";

/**
 * Método, não cronograma comercial.
 *
 * Os marcadores eram "SEMANA 0 / SEMANA 1 / 2 — 6 / DEPOIS", que é a proposta
 * de uma agência, com prazo contratado. Agora dizem a ORDEM em que ele trabalha,
 * que é verdadeira tanto para um cliente quanto para um time que o contrate —
 * e não promete calendário que nenhum dos dois casos garante.
 */
export const processSteps: ProcessStep[] = [
  {
    marker: { pt: "PRIMEIRO", en: "FIRST" },
    description: {
      pt: "Entender o processo — no local ou em call",
      en: "Understand the process — on site or on call",
    },
  },
  {
    marker: { pt: "ANTES DO CÓDIGO", en: "BEFORE ANY CODE" },
    description: {
      pt: "Modelo de dados e limites de segurança, por escrito",
      en: "Data model and security boundaries, in writing",
    },
  },
  {
    marker: { pt: "TODA SEMANA", en: "EVERY WEEK" },
    description: {
      pt: "Alguma coisa funcionando para você olhar",
      en: "Something working for you to look at",
    },
  },
  {
    marker: { pt: "NO FIM", en: "AT THE END" },
    description: {
      pt: "Em produção, documentado, entregue rodando",
      en: "Deployed, documented, handed over running",
    },
  },
];
