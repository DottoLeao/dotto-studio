/**
 * Utilitários do runtime de movimento. Funções puras, sem estado e sem
 * side effect — servem tanto ao runtime imperativo quanto aos componentes
 * cliente que usam `motion/react`.
 */

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** easeOutCubic. Usada onde a curva precisa ser aplicada à mão, dentro de um
 *  callback de scroll — ali não há transição, só progresso cru. */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * `wrap` existe em `motion-utils`, que é dependência TRANSITIVA do `motion` e
 * não está declarada no nosso package.json. Importar de lá seria depender de
 * um pacote que o gerenciador pode mover ou remover sem aviso, e a versão não
 * está sob nosso controle. São três linhas — vale reescrever.
 */
export const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/**
 * As curvas do site em um lugar só. Bézier em vez de spring onde o movimento
 * é de leitura (entrada de texto, saída de seção): spring com overshoot num
 * site de estúdio de software lê como brinquedo. Spring fica reservada ao que
 * responde ao dedo — menu radial e marquee.
 */
type Bezier = [number, number, number, number];

export const EASE: Record<"out" | "inOut", Bezier> = {
  /** Saída longa, chegada calma. Equivale ao power3.out que o site usava. */
  out: [0.16, 1, 0.3, 1],
  /** Simétrica, para navegação por âncora. */
  inOut: [0.65, 0, 0.35, 1],
};
