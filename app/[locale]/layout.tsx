import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

/**
 * `viewportFit: "cover"` libera as `env(safe-area-inset-*)`, que sem isto valem
 * zero. É o que permite ao botão flutuante do menu se afastar da barra inferior
 * do navegador em vez de brigar com ela.
 *
 * `themeColor` na cor Ink faz a moldura do navegador parar de destoar do site:
 * no celular, metade da sensação de "aparece um fundo claro ao rolar" vem da
 * barra do navegador, não da página.
 */
export const viewport: Viewport = {
  themeColor: "#17130f",
  viewportFit: "cover",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return buildMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${archivo.variable} ${plexMono.variable}`}>
      <head>
        {/*
          Síncrono e antes da primeira pintura: marca o documento para o CSS
          esconder o que ainda vai entrar. Sem isto o conteúdo aparece, some e
          reanima (flash visível).

          A rede de segurança é a parte que importa: se o runtime de animação
          não assumir em 2,5s (bundle bloqueado, 404, erro de hidratação), a
          classe cai sozinha e a página volta a ficar inteira visível. Página
          em branco para um lead é o pior resultado possível deste projeto.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement,f=false;${
              // Só em desenvolvimento: ?motion=force permite inspecionar o
              // caminho animado numa máquina que pede reduced-motion.
              // Não existe no bundle de produção.
              process.env.NODE_ENV !== "production"
                ? `try{f=location.search.indexOf('motion=force')>-1}catch(e){}`
                : ""
            }try{if(!f&&matchMedia('(prefers-reduced-motion: reduce)').matches)return}catch(e){if(!f)return}d.classList.add('motion');window.__dottoMotionTimer=setTimeout(function(){d.classList.remove('motion')},3000)})()`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
