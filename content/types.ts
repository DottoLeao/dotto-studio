import type { Locale } from "@/i18n/routing";

/**
 * Record<"pt" | "en", T>. Omitir um idioma é erro de compilação — é isto que
 * impede o site de nascer meio traduzido quando um case novo é adicionado.
 */
export type Localized<T> = Record<Locale, T>;

/**
 * Uma imagem real ou um quadro vazio assumido. Nunca uma imagem de banco.
 * A união discriminada obriga: para virar `image`, o TypeScript exige src,
 * dimensões e alt nos dois idiomas — não dá para trocar pela metade.
 */
export type MediaSlot =
  | {
      kind: "image";
      src: string;
      width: number;
      height: number;
      alt: Localized<string>;
    }
  | {
      kind: "placeholder";
      ratio: `${number}/${number}`;
      label: Localized<string>;
    };

export type CaseMetric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: Localized<string>;
  /**
   * Só é renderizado quando `true`. Número não medido não vai para uma página
   * pública — foi exatamente o erro do site antigo, que chamava dado
   * fabricado de "métrica em tempo real".
   */
  verified: boolean;
  /** De onde o número vem. Obrigatório na prática para publicar. */
  provenance?: Localized<string>;
};

export type CaseStudy = {
  slug: string;
  /** Nome do cliente — nunca traduzido. Só aparece se `clientNameApproved`. */
  client: string;
  /** O cliente autorizou ser nomeado publicamente? */
  clientNameApproved: boolean;
  /** Como o cliente é descrito enquanto o nome não pode ser usado. */
  clientAnonymous: Localized<string>;
  /** Nome do produto — nunca traduzido. */
  title: string;
  sector: Localized<string>;
  lead: Localized<string>;
  narrative: {
    blindSpot: Localized<string>;
    built: Localized<string>;
    changed: Localized<string>;
  };
  metrics: CaseMetric[];
  stack: string[];
  liveUrl?: string;
  media: {
    hero: MediaSlot;
    secondary: [MediaSlot, MediaSlot];
  };
};

export type Service = {
  number: string;
  title: Localized<string>;
  description: Localized<string>;
  /** Terreno técnico do item. Era `engagement`, com prazo e preço — o campo
   *  deixou de vender pacote quando a seção virou competência. */
  stack: Localized<string>;
};

export type ProcessStep = {
  marker: Localized<string>;
  description: Localized<string>;
};

export type Principle = {
  number: string;
  title: Localized<string>;
  description: Localized<string>;
};
