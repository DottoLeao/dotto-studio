import type { CaseStudy } from "../types";

export const torreAtiva: CaseStudy = {
  slug: "torre-ativa",

  // O cliente ainda NÃO autorizou ser nomeado publicamente. Enquanto
  // `clientNameApproved` for false, a página mostra `clientAnonymous`.
  client: "SIRTEC",
  clientNameApproved: false,
  clientAnonymous: {
    pt: "EMPREITEIRA DE REDE ELÉTRICA",
    en: "ELECTRICAL GRID CONTRACTOR",
  },

  title: "Torre Ativa",
  sector: { pt: "REDE ELÉTRICA", en: "ELECTRICAL GRID" },
  lead: {
    pt: "Inteligência de presença para as equipes de campo que constroem e mantêm redes elétricas.",
    en: "Presence intelligence for the field crews building and maintaining electrical networks.",
  },
  narrative: {
    blindSpot: {
      pt: "Ninguém sabia onde as equipes estavam até o dia acabar. Supervisores gerenciavam por ligação e memória — reagindo a ontem, nunca ao agora.",
      en: "Nobody knew where the crews were until the day was over. Supervisors managed by phone call and memory — reacting to yesterday, never to now.",
    },
    built: {
      pt: "Um app de presença offline-first para o campo — dois toques, sem treinamento — alimentando uma visão ao vivo do supervisor, com alertas. Gestão proativa no lugar do post-mortem diário.",
      en: "An offline-first presence app for the field — two taps, no training — feeding a live supervisor view with alerts. Proactive management replacing the daily post-mortem.",
    },
    changed: {
      pt: "Visibilidade operacional em tempo real, decisões mais rápidas, segurança preventiva — e uma base de dados que nunca havia existido, hoje a base do planejamento.",
      en: "Real-time operational visibility, faster decisions, preventive safety — and a dataset that had never existed before, now the basis for planning.",
    },
  },

  // Nenhum número foi medido e confirmado ainda, então nenhum é publicado.
  // Ao ter o dado: preencha `provenance` e vire `verified` para true.
  metrics: [
    {
      value: 41,
      prefix: "−",
      suffix: "%",
      verified: false,
      label: {
        pt: "evento em campo → decisão do supervisor, na sexta semana",
        en: "field event → supervisor decision, by week six",
      },
    },
    {
      value: 42,
      verified: false,
      label: {
        pt: "equipes no sistema, todo dia",
        en: "crews live on the system, daily",
      },
    },
  ],

  stack: ["NEXT.JS", "TYPESCRIPT", "SUPABASE", "POSTGRESQL", "VERCEL"],

  // A demo fica fora enquanto o nome do cliente não estiver liberado: o
  // domínio é `app-torre-controle-sirtec-...`, ou seja, o próprio link
  // identifica quem a anonimização acima está protegendo.
  // liveUrl: "https://app-torre-controle-sirtec-fawn.vercel.app/torre",

  media: {
    hero: {
      kind: "placeholder",
      ratio: "16/10",
      label: {
        pt: "TORRE ATIVA — VISÃO DO SUPERVISOR",
        en: "TORRE ATIVA — SUPERVISOR VIEW",
      },
    },
    secondary: [
      {
        kind: "placeholder",
        ratio: "4/3",
        label: { pt: "APP DE CAMPO", en: "FIELD APP" },
      },
      {
        kind: "placeholder",
        ratio: "4/3",
        label: { pt: "ALERTAS", en: "ALERTS" },
      },
    ],
  },
};
