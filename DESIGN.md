# Decide Aí — direção de design (v2)

Documento para os agentes de front-end. Substitui as "Diretrizes visuais" do AGENTS.md onde houver conflito.

## Conceito: letreiro de barraca de Fortaleza
O app é uma decisão rápida, tomada de fome, na calçada, com sol na tela. O visual vem dos cartazes e letreiros pintados à mão das barracas da Beira-Mar e do Mercado Central, dos azulejos coloniais e da jangada no Mucuripe: **cores chapadas e saturadas, contorno grosso, sombra dura deslocada (nada de sombra difusa), letras grandes e pesadas, alto contraste legível sob luz forte**.
Não é um "app de comida" genérico: tem que parecer cartaz de rua cearense.

O que NÃO fazer (é o que deixava o app com cara de template): fundo creme + terracota, cartões brancos idênticos com sombra suave cinza, bordas arredondadas iguais em tudo, gradientes decorativos, rótulos em CAIXA ALTA espaçada acima de títulos, "→" nos botões, listas de itens com o mesmo peso.

## Paleta (tokens em `@theme` no `src/index.css`)
| Token | Hex | Uso |
|---|---|---|
| `tinta` | `#12294A` | texto, contornos e sombras duras (azul-marinho, substitui o marrom) |
| `sol` | `#FFC933` | fundo de destaque, botão principal, selo "melhor combinação" |
| `mar` | `#1FA6A0` | secundária: selos, ilustrações, estados positivos (texto sobre `mar` só em `tinta`) |
| `pimenta` | `#E8432E` | acento pequeno: ícones, detalhes, "fechado"; NUNCA texto branco sobre ele |
| `cal` | `#FFFBF2` | superfícies (paredes caiadas) |
| `azulejo` | `#DDF0EF` | fundo das telas internas |
Cada tipo de prato ganha um "azulejo" de fundo próprio atrás da ilustração (variações chapadas de `sol`, `mar`, `pimenta` e `azulejo`), para variar sem gradiente.
Contraste: `tinta` sobre `sol` ~9:1; `tinta` sobre `cal` ~14:1; bordas de componentes sempre em `tinta` (>= 3:1). Texto em branco só sobre `tinta`.

## Tipografia
- **Títulos:** `Bowlby One` (pesada, de cartaz). Tamanhos grandes (title 2rem-3rem), frase normal (só a primeira letra maiúscula), `line-height` 1.05, sem negrito extra.
- **Texto:** `Atkinson Hyperlegible Next` (feita para leitura sob luz forte e baixa visão). 16px mínimo, entrelinha 1.5, linhas com menos de 60 caracteres.
- Auto-hospede as fontes (pacotes `@fontsource/...`) para não depender de rede nem do Google em produção. Se um pacote não existir, avise o maestro antes de trocar de fonte.

## Forma
- Contorno `3px solid tinta` em cartões, botões, chips e campos.
- Sombra dura: `box-shadow: 4px 4px 0 tinta` (6px nos elementos de destaque). No `:active` o elemento afunda (`translate(3px,3px)` e sombra 1px). Sem blur.
- Raios variados por papel, não um só: botões e chips `999px`; cartão de destaque `28px`; cartões menores `18px`; ilustração em "azulejo" com `14px`.
- Espaçamento generoso; toque >= 48px.

## Hierarquia (o ponto principal da v2)
- **Resultados:** o 1º lugar é o **cartão de destaque** (largo, azulejo grande com a ilustração em ~140px, selo `sol` "Melhor combinação", botão do Maps em destaque). Os lugares 2 a 5 são **linhas compactas** (ilustração 64px, nome, prato, bairro, distância, preço e link), todos do mesmo tamanho entre si. Em desktop o destaque ocupa a coluna da esquerda e as compactas a da direita.
- **Pergunta:** opções como **azulejos grandes** tocáveis (grade 2 colunas), com ícone e rótulo, em vez de lista de radios; o selecionado inverte para `tinta` com texto `cal` e sombra afundada. Mantenha radios nativos por baixo (acessibilidade e teclado).
- **Progresso:** 5 segmentos (é uma sequência real), os feitos preenchidos de `sol` com contorno `tinta`.

## Momento memorável (gaste a ousadia aqui, o resto fica quieto)
1. **Home:** tela cheia em `sol`, cena SVG grande na parte de baixo (sol com raios, mar em ondas de azulejo, uma jangada com vela pintada), o nome "Decide Aí" no estilo letreiro e UM botão. Animação única ao abrir: o sol sobe e as ondas deslizam devagar em loop (CSS, desligadas com `prefers-reduced-motion`).
2. **Roleta "Decide por mim":** vira um letreiro/slot de barraca, com a janela do giro numa moldura `tinta` com lâmpadas (círculos `sol`) piscando levemente enquanto gira.
Nada de animação de entrada em cada cartão: só a transição entre telas, curta.

## Texto
Frases curtas, voz do dia a dia de Fortaleza sem exagero, verbo de ação nos botões ("Bora decidir", "Abrir no Google Maps", "Sortear de novo"), mesmo nome para a mesma ação em todo o fluxo. Erros e estados vazios dizem o que aconteceu e o que fazer.

## Qualidade mínima (não negociável)
Contraste AA (bordas >= 3:1), foco visível em `pimenta` ou `tinta` com contorno de 3px, `prefers-reduced-motion` respeitado, 360px sem rolagem horizontal, tamanhos de toque >= 48px, acentos corretos, TypeScript estrito sem `any`.
