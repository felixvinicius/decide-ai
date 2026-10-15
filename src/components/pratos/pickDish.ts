/** Ilustrações de prato disponíveis em `src/components/pratos/`. */
export type DishKind =
  | 'sushi'
  | 'pizza'
  | 'hamburguer'
  | 'crustaceos'
  | 'peixe'
  | 'tapioca'
  | 'doce'
  | 'cafe'
  | 'massa'
  | 'churrasco'
  | 'regional'
  | 'salada'
  | 'generico'

/** Deixa em minúsculas e sem acento, para comparar palavras-chave sem susto. */
export function normalizeDishText(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Palavras-chave do NOME do prato. A ordem importa: vale a primeira que casar,
 * então "Sorvete de tapioca" cai em `tapioca` (tapioca vem antes de doce).
 */
const NAME_KEYWORDS: ReadonlyArray<{ kind: DishKind; keywords: readonly string[] }> = [
  { kind: 'sushi', keywords: ['sushi', 'temaki', 'sashimi', 'omakase'] },
  { kind: 'pizza', keywords: ['pizza'] },
  { kind: 'hamburguer', keywords: ['hamburguer', 'burger'] },
  { kind: 'crustaceos', keywords: ['camarao', 'lagosta', 'caranguejo', 'ostra', 'polvo'] },
  { kind: 'peixe', keywords: ['peixe', 'peixada', 'tilapia', 'moqueca'] },
  { kind: 'tapioca', keywords: ['tapioca', 'cuscuz'] },
  { kind: 'doce', keywords: ['sorvete', 'acai', 'bolo', 'doce', 'sobremesa', 'chocolate'] },
  { kind: 'cafe', keywords: ['cafe', 'pao'] },
  { kind: 'massa', keywords: ['massa', 'risoto', 'parmigiana', 'macarrao'] },
  {
    kind: 'churrasco',
    keywords: ['picanha', 'carneiro', 'churrasco', 'rodizio de carnes', 'costela'],
  },
  {
    kind: 'regional',
    keywords: ['carne de sol', 'baiao', 'galinha', 'frango', 'buchada', 'panelada'],
  },
  { kind: 'salada', keywords: ['salada', 'vegano', 'fit', 'organico'] },
]

/** Categorias conhecidas do cadastro, já sem acento. */
const CATEGORY_KINDS: Record<string, DishKind> = {
  'frutos do mar': 'crustaceos',
  regional: 'regional',
  churrasco: 'churrasco',
  italiana: 'massa',
  pizza: 'pizza',
  japonesa: 'sushi',
  hamburguer: 'hamburguer',
  doces: 'doce',
  cafe: 'cafe',
  saudavel: 'salada',
  vegetariana: 'salada',
  contemporanea: 'generico',
  bar: 'generico',
}

/**
 * Escolhe a ilustração de um prato: primeiro pelas palavras-chave do nome,
 * depois pela primeira categoria conhecida e, por fim, o prato genérico.
 */
export function pickDish(prato: string, categorias: string[]): DishKind {
  const nome = normalizeDishText(prato)
  for (const { kind, keywords } of NAME_KEYWORDS) {
    if (keywords.some((keyword) => nome.includes(keyword))) return kind
  }
  for (const categoria of categorias) {
    const byCategory = CATEGORY_KINDS[normalizeDishText(categoria)]
    if (byCategory) return byCategory
  }
  return 'generico'
}
