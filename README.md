# Dotto — site do estúdio

Site de **Dotto**, estúdio de software independente de Lorenzo Leão Dotto.
Next.js App Router, bilíngue PT/EN, animação GSAP com caminho estático completo.

## Rodar

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` redireciona para `/pt`. Não há variável de ambiente:
todo o conteúdo é versionado no repositório.

| Comando | O quê |
|---|---|
| `pnpm dev` | servidor de desenvolvimento |
| `pnpm build` | build de produção |
| `pnpm start` | serve o build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

## Estrutura

```
app/[locale]/     layout (fontes, metadata, script anti-flash) e página
components/
  sections/       as 10 seções — todas server components
  chrome/         nav, barra de progresso, skip link, troca de idioma
  motion/         ÚNICO lugar com "use client" de animação
  ui/             botão, moldura de mídia, marca
content/          conteúdo tipado e bilíngue (cases, serviços, processo)
messages/         microcopy PT/EN (next-intl)
lib/gsap.ts       único ponto de registro dos plugins
```

### Conteúdo

Dois níveis, de propósito:

- **`messages/{pt,en}.json`** — microcopy: rótulos, títulos de seção, botões.
- **`content/*.ts`** — registros com forma: cases, serviços, processo. São
  tipados com `Localized<T> = Record<"pt" | "en", T>`, então **esquecer uma
  tradução é erro de compilação**, não um buraco em produção.

Adicionar um case: crie `content/cases/<slug>.ts` e inclua no array de
`content/cases/index.ts`. O contador `CASE 01 / 01` deriva do array.

Trocar um placeholder de imagem por uma imagem real: mude `kind: "placeholder"`
para `kind: "image"` — o TypeScript passa a exigir `src`, `width`, `height` e
`alt` nos dois idiomas.

## Marca

| Token | Hex | Uso |
|---|---|---|
| Ink | `#17130F` | base, tipo, superfícies escuras |
| Bone | `#F5F1E9` | papel, superfícies claras |
| Signal | `#FF4D1C` | o ponto, preenchimentos, réguas |
| Signal Ink | `#B3330C` | laranja **como texto sobre fundo claro** |
| Slate | `#6E675E` | tipo secundário |

Archivo (400/500/600/900) + IBM Plex Mono (400/500), via `next/font/google`
— self-hosted no build, zero requisição a terceiros em runtime.

⚠️ **Signal nunca é texto sobre Bone.** Reprova contraste AA. Para laranja
sobre claro, use Signal Ink. Essa regra da marca está fazendo trabalho de
acessibilidade de verdade.

## Animação

GSAP 3 + ScrollTrigger. Registro único em `lib/gsap.ts` (o ESLint bloqueia
importar `gsap` direto em qualquer outro arquivo).

**O contrato que sustenta tudo: o estado final é o padrão do CSS.**

O estado inicial das animações só existe sob `html.motion`, classe posta por um
script inline síncrono no `<head>`. Isso significa que **todo modo de falha
falha aberto**:

| Situação | Resultado |
|---|---|
| Sem JS | página inteira visível, sem animação |
| `prefers-reduced-motion: reduce` | classe nunca é posta; nada é construído |
| Bundle bloqueado / erro de hidratação | timer de 3s remove a classe e devolve tudo |

`components/motion/MotionGate.tsx` só importa o runtime quando a classe existe,
então **quem pede reduced-motion nunca baixa o GSAP** — e para todo mundo ele
entra depois da primeira pintura, nunca bloqueando o LCP.

Toda animação vive dentro de `gsap.matchMedia()`. Abaixo de 901px o `blur` das
seções é desligado (era a coisa mais cara do protótipo) e o chapter card encolhe
de 230vh para 180vh (140vh abaixo de 640px). `will-change` é ligado no
`onToggle` do trigger e desligado ao sair — nunca permanente.

### Inspecionar o caminho animado em dev

Numa máquina configurada com reduced-motion, `?motion=force` liga a animação.
Só existe em desenvolvimento; a cláusula é removida do build de produção.

```
http://localhost:3000/pt?motion=force
```

Em dev, `window.__dotto` expõe `{ gsap, ScrollTrigger }` para permitir
`ScrollTrigger.update()` síncrono em ambientes onde o rAF não roda.

## i18n

next-intl, `localePrefix: "always"`, `defaultLocale: "pt"`. Rotas `/pt` e `/en`;
`/` redireciona conforme o `Accept-Language`. `hreflang` recíproco com
`x-default` apontando para `/en`. `sitemap.xml`, `robots.txt` e JSON-LD
(`ProfessionalService` + `Person`) são gerados — nenhum dado inventado.

## Verificação

Rode no console da página, não confie em screenshot:

```js
document.documentElement.scrollWidth > innerWidth                    // false

[...document.querySelectorAll('a,button')].map(e=>e.getBoundingClientRect())
  .filter(r=>r.width && (r.height<44||r.width<44))                   // vazio

document.documentElement.classList.remove('motion');
[...document.querySelectorAll('[data-reveal]')]
  .filter(e=>+getComputedStyle(e).opacity<.99).length                // 0

performance.getEntriesByType('resource')
  .filter(r=>!r.name.startsWith(location.origin))                    // vazio
```

## Case: o que está publicado e o que não está

O cliente ainda não autorizou ser nomeado e os números não foram medidos.
Enquanto isso, em [`content/cases/torre-ativa.ts`](content/cases/torre-ativa.ts):

| Campo | Estado | Como liberar |
|---|---|---|
| `clientNameApproved` | `false` → página mostra "EMPREITEIRA DE REDE ELÉTRICA" | vire para `true` |
| `metrics[].verified` | `false` → o bloco de números não renderiza | vire para `true` e preencha `provenance` |
| `liveUrl` | comentado | ver abaixo |

⚠️ **O link da demo está fora de propósito.** O domínio é
`app-torre-controle-`**`sirtec`**`-....vercel.app` — o próprio endereço nomeia o
cliente que a anonimização protege. Só reative junto com `clientNameApproved`,
ou atrás de um domínio que não identifique ninguém.

## Repositórios do GitHub

A seção "Código aberto" é puxada ao vivo da API pública do GitHub em
[`lib/github.ts`](lib/github.ts) — sem token, revalidando a cada 24h. Se a API
falhar, a seção simplesmente não renderiza; nunca quebra o build.

Para esconder um repositório, acrescente o nome em `hiddenRepos` de
[`content/site.ts`](content/site.ts). Hoje estão escondidos apenas os dois
repositórios de configuração de perfil e o portfólio antigo.

## Pendências

- **Screenshots do Torre Ativa** (supervisor, app de campo, alertas) — hoje são
  quadros assumidos, marcados como "imagem pendente".
- **Imagem de OG** 1200×630 e favicon.
