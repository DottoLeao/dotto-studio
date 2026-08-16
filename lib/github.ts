import { featuredRepos, site } from "@/content/site";

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  homepage: string | null;
  pushedAt: string;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
};

/**
 * Repositórios públicos, ao vivo da API do GitHub. Sem token: o endpoint é
 * público e o limite não autenticado (60/h por IP) sobra para um build mais
 * uma revalidação diária.
 *
 * Curadoria por allowlist (`featuredRepos`), não por blocklist: só entra o que
 * foi escolhido, na ordem em que foi escolhido. Repositório novo no GitHub não
 * aparece aqui sozinho — aparecer é uma decisão, não um efeito colateral.
 *
 * Falha silenciosa e proposital: se o GitHub estiver fora do ar ou o limite
 * estourar, a seção simplesmente não renderiza. Um site de estúdio não pode
 * quebrar o build por causa de uma listagem de repositório.
 */
export async function fetchPublicRepos(): Promise<Repo[]> {
  if (featuredRepos.length === 0) return [];

  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUser}/repos?per_page=100&type=owner&sort=pushed`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return (data as GitHubRepo[])
      .filter(
        (r) =>
          !r.private &&
          !r.fork &&
          !r.archived &&
          featuredRepos.includes(r.name),
      )
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        url: r.html_url,
        homepage: r.homepage && r.homepage.startsWith("http") ? r.homepage : null,
        pushedAt: r.pushed_at,
      }))
      // A ordem é a de `featuredRepos`, não a do último push: curadoria é
      // decisão, não cronologia.
      .sort(
        (a, b) => featuredRepos.indexOf(a.name) - featuredRepos.indexOf(b.name),
      );
  } catch {
    return [];
  }
}
