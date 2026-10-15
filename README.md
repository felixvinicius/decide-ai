# Decide Aí

App web que resolve a indecisão de onde comer em Fortaleza (CE), para casais e pequenos grupos. O usuário responde 5 perguntas e recebe de 3 a 5 sugestões de restaurantes reais, com prato sugerido, bairro, distância aproximada e faixa de preço. Mobile-first.

## Funcionalidades (Fase 1 - MVP)

- Tela inicial
- Questionário de 5 perguntas (o que NÃO querem comer, quanto gastar por pessoa, onde estão via geolocalização ou bairro, ocasião, tipo de lugar) com barra de progresso e voltar
- Motor de recomendação isolado e testado (`src/lib/recomendacao.ts`: exclui categorias rejeitadas, filtra preço, pontua ocasião/ambiente/proximidade/aberto agora, flexibiliza filtros avisando o usuário)
- Cards de resultado com ilustrações SVG próprias e link "Abrir no Google Maps"
- "Decide por mim" com roleta
- Refazer

## Stack

- React 19
- Vite
- TypeScript (strict)
- Tailwind CSS v4
- Vitest + Testing Library
- framer-motion
- lucide-react
- Dados em JSON local
- Distância por Haversine
- Sem APIs pagas

## Como rodar localmente

- Requisitos: Node 20+
- git clone https://github.com/SEU-USUARIO/decide-ai.git
- npm install
- npm run dev
- npm test
- npm run build
- npm run lint

## Estrutura do projeto

```
src/
  components/   componentes reutilizáveis
  pages/        telas (Home, Quiz, Results)
  lib/          lógica pura (recomendacao.ts, testes)
  data/         restaurantes.json
  types/        tipos TypeScript
```

Na raiz: `VALIDAR_RESTAURANTES.md` lista cada lugar para conferência manual.

## Sobre os dados dos restaurantes

Aviso honesto — a lista em `src/data/restaurantes.json` foi montada a partir de guias públicos de Fortaleza. **Todos os itens estão com `verificado=false`** e as coordenadas são aproximadas (nível de rua/bairro). `VALIDAR_RESTAURANTES.md` lista cada lugar para conferência manual. Horários, preços e endereços podem ter mudado.

## Roadmap

- **Fase 1 MVP** (em andamento) — recomendação baseada em filtros e roleta
- **Fase 2 Modo Match** — sessão compartilhada por link, swipe, só o que todos aprovam, card para Stories; Supabase gratuito
- **Fase 3 Retencao** — histórico "Já fomos", lista "Queremos ir", clima, perfil de gosto

## Deploy

Em breve (Vercel).

## Prints

Em breve.

## Licença

MIT. Ver LICENSE.