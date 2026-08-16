import { getLocale, getTranslations } from "next-intl/server";

import { site } from "@/content/site";
import { fetchPublicRepos } from "@/lib/github";

export async function OpenSource() {
  const [t, locale, repos] = await Promise.all([
    getTranslations("openSource"),
    getLocale(),
    fetchPublicRepos(),
  ]);

  // Sem repositórios (GitHub fora, limite estourado) a seção não existe.
  if (repos.length === 0) return null;

  const dateFormat = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
  });

  return (
    <section
      id="code"
      data-sec
      data-surface="ink"
      aria-labelledby="code-heading"
      className="bg-ink px-gutter py-section"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <p data-reveal className="eyebrow text-signal">
          {t("eyebrow")}
        </p>

        <h2
          data-reveal
          data-reveal-delay="1"
          id="code-heading"
          className="display-tight mt-7 max-w-[16ch] text-h2"
        >
          {t("heading")}
        </h2>

        <p
          data-reveal
          data-reveal-delay="2"
          className="mt-7 max-w-[54ch] text-lg leading-[1.55] text-bone/72"
        >
          {t("lead", { count: repos.length })}
        </p>

        <ul className="mt-16">
          {repos.map((repo) => (
            <li key={repo.name} className="border-t border-bone/15">
              <div className="grid gap-x-10 gap-y-3 py-7 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)_auto] md:items-baseline">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-display text-xl font-semibold tracking-[-0.03em] text-bone transition-colors hover:text-signal"
                >
                  {repo.name}
                </a>

                <p className="max-w-[52ch] leading-[1.55] text-bone/65">
                  {repo.description ?? (
                    <span className="text-bone/60 italic">
                      {t("noDescription")}
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {repo.language ? (
                    <span className="meta-mono text-bone/60">
                      {repo.language}
                    </span>
                  ) : null}

                  {repo.stars > 0 ? (
                    <span className="meta-mono text-bone/60">
                      {repo.stars}
                      <span aria-hidden="true"> ★</span>
                    </span>
                  ) : null}

                  <span className="meta-mono text-bone/60">
                    {dateFormat.format(new Date(repo.pushedAt))}
                  </span>

                  {repo.homepage ? (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meta-mono inline-flex min-h-11 items-center gap-1.5 text-signal transition-colors hover:text-bone"
                    >
                      {t("demo")}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="meta-mono mt-12 inline-flex min-h-11 items-center gap-2 border-t border-bone/15 pt-10 text-signal transition-colors hover:text-bone"
        >
          {t("viewProfile")}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
