# Decide Aí — guia para agentes

App web (pt-BR) que ajuda casais e pequenos grupos a decidir onde comer em Fortaleza-CE.
Stack: React 19 + Vite + TypeScript + Tailwind CSS v4 (plugin `@tailwindcss/vite`, `@import "tailwindcss"` em `src/index.css`), Vitest, framer-motion, clsx, lucide-react.

## Regras
- Código e nomes de arquivos em inglês; textos da interface em português do Brasil, tom leve e regional, sem exagero.
- Mobile-first: priorize 360–430px, depois desktop. Alvos de toque >= 44px.
- Sem chaves de API, sem serviços pagos, sem fotos de terceiros. Imagens = ilustrações SVG flat/cartoon próprias.
- NÃO edite `src/lib/recomendacao.ts`, `src/data/restaurantes.json` nem `src/types/index.ts` sem autorização do maestro.
- TypeScript estrito: sem `any`, sem `enum` (usa `erasableSyntaxOnly`), imports de tipo com `import type`.
- Comandos: `npm run dev`, `npm run build`, `npm test`, `npm run lint`. Rode build e lint antes de entregar.
- Acessibilidade: contraste AA, foco visível, navegação por teclado, `aria-label`/`alt` em ícones e SVGs, `prefers-reduced-motion` respeitado nas animações.
- Não faça commits: quem commita é o agente GitHub, a pedido do maestro.

## Estrutura
- `src/components/` componentes reutilizáveis · `src/pages/` telas · `src/lib/` lógica pura · `src/data/` JSON · `src/types/` tipos · `src/assets/pratos/` SVGs dos pratos.
- A lógica de recomendação é independente de UI: `recomendar(respostas, restaurantes, agora, ...)` em `src/lib/recomendacao.ts`.

## Diretrizes visuais
- Identidade quente e apetitosa, regional (sol, mar, cajueiro), nada de cara de template. Paleta com 1 cor de destaque forte (ex.: coral/caju), 1 secundária (ex.: verde-mar), neutros quentes. Defina os tokens em `@theme` no `src/index.css`.
- Tipografia: 1 fonte de título com personalidade + 1 legível para texto (Google Fonts via `<link>` no index.html).
- Cantos arredondados generosos, sombras suaves, ilustrações com contorno grosso e cores chapadas.
- Animações curtas e com propósito (framer-motion); roleta do "Decide por mim" é o momento de destaque.
