export const site = {
  name: "Dotto",
  person: "Lorenzo Leão Dotto",
  domain: "lorenzodotto.com.br",
  url: "https://lorenzodotto.com.br",

  email: "dottodeveloper@gmail.com",
  whatsapp: "https://wa.me/61451903630",
  phone: "+61 451 903 630",
  github: "https://github.com/DottoLeao",
  githubUser: "DottoLeao",
  linkedin: "https://www.linkedin.com/in/lorenzo-le%C3%A3o-dotto/",

  /** Um trimestre, não uma string. Ver `availabilityIsCurrent`. */
  availability: { quarter: 4, year: 2026 },

  /**
   * Os slots "CASE 02/03 — RESERVED" do protótipo. O brand guide manda
   * preencher ou remover, nunca deixar como decoração. Um toggle, não um delete,
   * para o dia em que houver intenção de mostrá-los.
   */
  showReservedCases: false,
} as const;

/**
 * Repositórios que ENTRAM na listagem, nesta ordem.
 *
 * Antes isto era `hiddenRepos` — uma blocklist. Blocklist é a estrutura errada
 * quando a conta pública tem dezenas de repositórios e só alguns estão prontos
 * para serem vistos: todo repositório novo entra no site por padrão, e você
 * descobre isso depois de alguém já ter visto.
 *
 * Allowlist inverte o padrão: nada aparece a menos que você decida. A ordem
 * deste array é a ordem na página — não a data do último push, que é acidental.
 *
 * Regra para entrar aqui: o repositório é público, abre, e você defenderia cada
 * linha dele numa entrevista.
 *
 * Estar nesta lista não basta: `fetchPublicRepos` continua filtrando `private`,
 * `fork` e `archived`. Um repositório listado aqui mas ainda privado
 * simplesmente não renderiza — e passa a renderizar sozinho no dia em que
 * virar público, sem precisar mexer no código. É intencional: a lista declara
 * intenção, o filtro garante que a página nunca prometa um link que dá 404.
 */
export const featuredRepos: string[] = [
  // Ainda privado — aparece automaticamente quando for tornado público.
  "clean-app",
  "finradar",
];

/**
 * O badge de disponibilidade não pode virar mentira com data.
 * Passado o trimestre, a página mostra o texto sem o prazo.
 */
export function availabilityIsCurrent(now: Date = new Date()): boolean {
  const { quarter, year } = site.availability;
  const endMonth = quarter * 3; // Q4 -> 12
  // Primeiro instante depois do fim do trimestre.
  const expiresAt = new Date(Date.UTC(year, endMonth, 1));
  return now < expiresAt;
}
