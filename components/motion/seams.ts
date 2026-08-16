import { inView, scroll } from "motion";

import { clamp01, easeOut } from "@/lib/motion";
import { playReveal } from "./reveal";

/**
 * As emendas entre seções — uma por fronteira, nenhuma repetida.
 *
 * A lei: seção que sai NUNCA desbota nem borra. Ela é coberta, cortada ou
 * empurrada. Só geometria. O que existia antes era um dissolve único
 * (`scale + opacity .38 + blur`) aplicado igual a oito fronteiras, o que não é
 * transição nenhuma — é a página envelhecendo uniformemente, e em superfície
 * clara lê como defeito.
 *
 * Cada seção declara `data-seam="<nome>"` (aceita lista separada por espaço,
 * porque o Manifesto tem uma emenda de entrada e outra de saída). O nome resolve
 * para um construtor daqui. Nenhum construtor serve a duas fronteiras.
 */

export type Add = (stop: VoidFunction) => void;
type Seam = (section: HTMLElement, add: Add) => void;

/** O tipo é anotado, não congelado com `as const`: `ScrollOptions` pede um
 *  array mutável, e um literal readonly não serve. */
type ScrollOpts = NonNullable<Parameters<typeof scroll>[1]>;

/** Janela em que o TOPO da seção atravessa a tela: ela está chegando. */
const entering = (section: HTMLElement): ScrollOpts => ({
  target: section,
  offset: ["start end", "start start"],
});

/** Janela em que a BASE da seção atravessa a tela: ela está indo embora. */
const leaving = (section: HTMLElement): ScrollOpts => ({
  target: section,
  offset: ["end end", "end start"],
});

/**
 * Escreve estilo só quando o valor muda de verdade. Dentro de um callback de
 * scroll isso roda a cada frame; reescrever a mesma string é repintura jogada
 * fora.
 */
function writer(el: HTMLElement, prop: "clipPath" | "transform") {
  let last = "";
  return (value: string) => {
    if (value === last) return;
    last = value;
    el.style[prop] = value;
  };
}

/** `will-change` só enquanto a peça está em tela — nunca a página inteira. */
function promote(el: HTMLElement, props: string, add: Add) {
  add(
    inView(el, () => {
      el.style.willChange = props;
      return () => {
        el.style.willChange = "auto";
      };
    }),
  );
}

const layerOf = (section: HTMLElement) =>
  section.querySelector<HTMLElement>("[data-seam-layer]");

const ruleOf = (section: HTMLElement) =>
  section.querySelector<HTMLElement>("[data-seam-rule]");

/**
 * Fração da janela em que TODA emenda tem de estar terminada.
 *
 * Existe para separar dois tempos que antes se atropelavam: a folha limpa a
 * superfície até aqui, e só então o conteúdo entra. Enquanto os dois se
 * sobrepunham, a borda da emenda cruzava a manchete já desenhada e a cortava no
 * meio das palavras — num frame parado aquilo lê como layout quebrado.
 *
 * Os 20% restantes da janela são folga: a seção termina de assentar na tela sem
 * nada se mexendo.
 */
const SEAM_END = 0.8;

/** Progresso da emenda: 0→1 dentro da fatia útil da janela. */
const seamProgress = (p: number) => clamp01(p / SEAM_END);

/** Solta o conteúdo da seção só quando a folha já liberou a superfície. */
function revealAfterSeam(section: HTMLElement, add: Add) {
  const blocks = Array.from(
    section.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  if (blocks.length === 0) return;

  let done = false;
  add(
    scroll((p: number) => {
      if (done || p < SEAM_END) return;
      done = true;
      for (const b of blocks) playReveal(b);
    }, entering(section)),
  );
}

/** Altura da seção em cache: lê-la a cada frame força reflow no callback. */
function trackHeight(section: HTMLElement, add: Add) {
  const box = { h: section.offsetHeight || 1 };
  const ro = new ResizeObserver(() => {
    box.h = section.offsetHeight || 1;
  });
  ro.observe(section);
  add(() => ro.disconnect());
  return box;
}

const SEAMS: Record<string, Seam> = {
  /* A · Hero → Marquee — elevação diferencial.
     O bloco do hero sobe mais rápido que a rolagem e desliza sob a faixa.
     Antes ele sumia por opacidade; agora não degrada, só sai de quadro. */
  "hero-lift": (section, add) => {
    const inner = section.querySelector<HTMLElement>("[data-hero-inner]");
    if (!inner) return;

    promote(inner, "transform", add);
    const write = writer(inner, "transform");

    add(
      scroll(
        (p: number) => {
          write(`translateY(${(-p * window.innerHeight * 0.25).toFixed(1)}px)`);
        },
        { target: section, offset: ["start start", "end start"] },
      ),
    );
  },

  /* B · Marquee → Manifesto — cortina lateral com fio-guia.
     A superfície varre da esquerda para a direita e um fio Signal viaja dois
     por cento à frente dela, marcando a borda. */
  "curtain-rule": (section, add) => {
    const layer = layerOf(section);
    if (!layer) return;

    promote(layer, "clip-path", add);
    const writeLayer = writer(layer, "clipPath");
    const rule = ruleOf(section);
    const writeRule = rule ? writer(rule, "transform") : null;

    revealAfterSeam(section, add);

    add(
      scroll((p: number) => {
        const x = seamProgress(p) * 100;
        writeLayer(`inset(0 0 0 ${x.toFixed(2)}%)`);
        writeRule?.(`translateX(${Math.min(100, x + 2).toFixed(2)}vw)`);
      }, entering(section)),
    );
  },

  /* C · Manifesto → Chapter — esvaziamento por linha.
     A seção não desbota: ela se esvazia. Cada bloco é consumido de baixo para
     cima, em escada, e a tela chega limpa para o íris do Chapter florescer.
     Um corta, o outro abre. */
  "line-empty": (section, add) => {
    const lines = Array.from(
      section.querySelectorAll<HTMLElement>("[data-seam-line]"),
    );
    if (lines.length === 0) return;

    const writes = lines.map((el) => writer(el, "clipPath"));
    for (const el of lines) promote(el, "clip-path", add);

    add(
      scroll((p: number) => {
        for (let i = 0; i < lines.length; i++) {
          const t = clamp01((p - i * 0.11) / 0.42);
          writes[i](`inset(0 0 ${(t * 100).toFixed(2)}% 0)`);
        }
      }, leaving(section)),
    );
  },

  /* D · Chapter → Work — traço-régua, em dois tempos.
     Primeiro a régua risca a tela; depois a superfície desce atrás dela, com o
     fio montado na borda. */
  ruler: (section, add) => {
    const rule = ruleOf(section);
    if (!rule) return;

    promote(rule, "transform", add);
    const write = writer(rule, "transform");
    // O fio é de 1px: translateY em % seria relativo a ELE, não à seção.
    const box = trackHeight(section, add);

    revealAfterSeam(section, add);

    add(
      scroll((p: number) => {
        const s = seamProgress(p);
        // Dois tempos: risca, depois desce.
        const draw = clamp01(s / 0.4);
        const q = clamp01((s - 0.4) / 0.6);
        write(
          `translateY(${(q * box.h).toFixed(1)}px) scaleX(${draw.toFixed(3)})`,
        );
      }, entering(section)),
    );
  },

  /* E · Work → Services — corte diagonal, borda dura, sem fio. */
  diagonal: (section, add) => {
    const layer = layerOf(section);
    if (!layer) return;

    promote(layer, "clip-path", add);
    const write = writer(layer, "clipPath");

    revealAfterSeam(section, add);

    add(
      scroll((p: number) => {
        // Vai de -12 a 112: precisa ultrapassar 100 dos dois lados, senão o
        // canto inferior direito fica coberto no fim do percurso.
        const y = seamProgress(p) * 124 - 12;
        write(
          `polygon(0% ${y.toFixed(2)}%, 100% ${(y - 12).toFixed(2)}%, 100% 100%, 0% 100%)`,
        );
      }, entering(section)),
    );
  },

  /* F · Services → OpenSource — persiana de colunas.
     Quatro faixas sobem em sequência, ecoando a grade da listagem. */
  shutter: (section, add) => {
    const bands = Array.from(
      section.querySelectorAll<HTMLElement>("[data-seam-band]"),
    );
    if (bands.length === 0) return;

    const writes = bands.map((el) => writer(el, "transform"));
    for (const el of bands) promote(el, "transform", add);

    revealAfterSeam(section, add);

    add(
      scroll((p: number) => {
        const s = seamProgress(p);
        for (let i = 0; i < bands.length; i++) {
          const t = clamp01((s - i * 0.12) / 0.64);
          writes[i](`translateY(${(-t * 100).toFixed(2)}%)`);
        }
      }, entering(section)),
    );
  },

  /* G · OpenSource → Process — inundação de cor.
     Aqui a folha é INK, a superfície que está indo embora: quem sobe é o
     Signal novo, então quem tem de se retirar é a cor velha. Silhueta em três
     degraus para a borda não ser mais uma reta. */
  flood: (section, add) => {
    const layer = layerOf(section);
    if (!layer) return;

    promote(layer, "clip-path", add);
    const write = writer(layer, "clipPath");

    revealAfterSeam(section, add);

    add(
      scroll((p: number) => {
        // Degraus de 16%, não de 6%. A 6% o degrau media ~46px — quase
        // exatamente uma entrelinha da manchete, o pior tamanho possível:
        // fatiava o título em três pedaços desalinhados e lia como erro de
        // renderização. Grande o bastante, lê como três painéis.
        const base = 100 - seamProgress(p) * 132;
        const e1 = base.toFixed(2);
        const e2 = (base + 16).toFixed(2);
        const e3 = (base + 32).toFixed(2);
        write(
          `polygon(0% 0%, 100% 0%, 100% ${e3}%, 66.66% ${e3}%, 66.66% ${e2}%, 33.33% ${e2}%, 33.33% ${e1}%, 0% ${e1}%)`,
        );
      }, entering(section)),
    );
  },

  /* H · Process → About — partição.
     A superfície Signal racha ao meio e as duas metades se afastam. */
  split: (section, add) => {
    const top = section.querySelector<HTMLElement>('[data-seam-half="top"]');
    const bottom = section.querySelector<HTMLElement>(
      '[data-seam-half="bottom"]',
    );
    if (!top || !bottom) return;

    promote(top, "transform", add);
    promote(bottom, "transform", add);
    const writeTop = writer(top, "transform");
    const writeBottom = writer(bottom, "transform");

    revealAfterSeam(section, add);

    add(
      scroll((p: number) => {
        const d = (seamProgress(p) * 100).toFixed(2);
        writeTop(`translateY(-${d}%)`);
        writeBottom(`translateY(${d}%)`);
      }, entering(section)),
    );
  },

  /* I · About → Contact — descida presa à grade.
     A borda não desce linear: ela pousa na base de cada bloco de texto do
     Contact e só então segue. O ritmo vem do conteúdo, não do relógio. */
  "grid-drop": (section, add) => {
    const layer = layerOf(section);
    if (!layer) return;

    promote(layer, "clip-path", add);
    const write = writer(layer, "clipPath");

    let stops: number[] = [];
    const measure = () => {
      const blocks = Array.from(
        section.querySelectorAll<HTMLElement>("[data-reveal]"),
      );
      const h = section.offsetHeight || 1;
      stops = blocks.length
        ? blocks.map((b) => clamp01((b.offsetTop + b.offsetHeight) / h))
        : [1 / 3, 2 / 3, 1];
      // O último patamar tem que ser a borda: senão sobra folha cobrindo o pé.
      if (stops[stops.length - 1] < 1) stops.push(1);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(section);
    add(() => ro.disconnect());

    revealAfterSeam(section, add);

    add(
      scroll((p: number) => {
        const s = seamProgress(p);
        const n = stops.length;
        const i = Math.min(n - 1, Math.floor(s * n));
        const local = clamp01(s * n - i);
        const from = i === 0 ? 0 : stops[i - 1];
        const to = stops[i];
        const edge = (from + (to - from) * easeOut(local)) * 100;
        write(`inset(${edge.toFixed(2)}% 0 0 0)`);
      }, entering(section)),
    );
  },
};

/** Constrói todas as emendas declaradas na página. */
export function applySeams(add: Add) {
  document.querySelectorAll<HTMLElement>("[data-seam]").forEach((section) => {
    const names = (section.dataset.seam ?? "").split(/\s+/).filter(Boolean);
    for (const name of names) SEAMS[name]?.(section, add);
  });
}

/** Exposto para o teste afirmar que nenhum mecanismo serve a duas fronteiras. */
export const SEAM_NAMES = Object.keys(SEAMS);
