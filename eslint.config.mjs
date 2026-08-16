import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 já exporta flat config; FlatCompat aqui quebra.
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    rules: {
      // GSAP tem um único ponto de registro (lib/gsap.ts). Importar direto do
      // pacote pula o registerPlugin e quebra em produção de forma sutil.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "gsap",
              message: "Importe de @/lib/gsap — lá os plugins são registrados.",
            },
            {
              name: "gsap/ScrollTrigger",
              message: "Importe de @/lib/gsap.",
            },
            {
              name: "gsap/ScrollToPlugin",
              message: "Importe de @/lib/gsap.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
