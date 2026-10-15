import { describe, expect, it } from 'vitest'
import { normalizeDishText, pickDish } from './pickDish'
import type { DishKind } from './pickDish'

/** Nome do prato decide o desenho, sem depender da categoria. */
const NAME_CASES: Array<[prato: string, kind: DishKind]> = [
  ['Camarão na moranga', 'crustaceos'],
  ['Rodízio de sushi', 'sushi'],
  ['Pizza no forno a lenha', 'pizza'],
  ['Hambúrguer artesanal', 'hamburguer'],
  ['Peixada cearense', 'peixe'],
  ['Tapioca recheada', 'tapioca'],
  ['Sorvete de caju', 'doce'],
  ['Café especial', 'cafe'],
  ['Parmigiana', 'massa'],
  ['Picanha', 'churrasco'],
  ['Carne de sol com macaxeira', 'regional'],
  ['Salada', 'salada'],
]

/** Mesmas palavras-chave com outra caixa e sem acento. */
const NORMALIZATION_CASES: Array<[prato: string, kind: DishKind]> = [
  ['CAMARÃO NA MORANGA', 'crustaceos'],
  ['camarao na moranga', 'crustaceos'],
  ['Rodizio de Sushi', 'sushi'],
  ['HAMBURGUER ARTESANAL', 'hamburguer'],
  ['PIZZA NO FORNO A LENHA', 'pizza'],
  ['cafe especial', 'cafe'],
  ['CARNE DE SOL COM MACAXEIRA', 'regional'],
]

/** Categoria usada só quando o nome não ajuda. */
const CATEGORY_CASES: Array<[categoria: string, kind: DishKind]> = [
  ['frutos do mar', 'crustaceos'],
  ['italiana', 'massa'],
  ['japonesa', 'sushi'],
  ['saudável', 'salada'],
  ['saudavel', 'salada'],
  ['vegetariana', 'salada'],
  ['doces', 'doce'],
  ['café', 'cafe'],
  ['regional', 'regional'],
  ['churrasco', 'churrasco'],
  ['pizza', 'pizza'],
  ['hambúrguer', 'hamburguer'],
  ['contemporânea', 'generico'],
  ['bar', 'generico'],
]

describe('normalizeDishText', () => {
  it('tira acento, baixa a caixa e apara as pontas', () => {
    expect(normalizeDishText('  Camarão À Milanesa  ')).toBe('camarao a milanesa')
  })
})

describe('pickDish — palavras-chave do nome', () => {
  it.each(NAME_CASES)('%s => %s', (prato, kind) => {
    expect(pickDish(prato, [])).toBe(kind)
  })

  it.each(NORMALIZATION_CASES)('%s => %s (sem acento/caixa)', (prato, kind) => {
    expect(pickDish(prato, ['categoria que não deveria importar'])).toBe(kind)
  })

  it('vale a primeira palavra-chave que casar (ordem documentada)', () => {
    // tapioca vem antes de doce na lista de palavras-chave.
    expect(pickDish('Sorvete de tapioca', [])).toBe('tapioca')
  })
})

describe('pickDish — prioridade do nome sobre a categoria', () => {
  it('usa o nome mesmo quando a categoria sugere outro desenho', () => {
    expect(pickDish('Picanha na brasa', ['italiana'])).toBe('churrasco')
    expect(pickDish('Rodízio de sushi', ['churrasco'])).toBe('sushi')
    expect(pickDish('Pizza de calabresa', ['japonesa'])).toBe('pizza')
    expect(pickDish('Camarão na moranga', ['vegetariana'])).toBe('crustaceos')
  })
})

describe('pickDish — fallback por categoria', () => {
  it.each(CATEGORY_CASES)('categoria %s => %s', (categoria, kind) => {
    expect(pickDish('Prato do dia', [categoria])).toBe(kind)
  })

  it('pula categorias desconhecidas e usa a primeira conhecida', () => {
    expect(pickDish('Prato do dia', ['qualquer', 'italiana'])).toBe('massa')
  })
})

describe('pickDish — genérico e bordas', () => {
  it('cai no genérico quando nada casa', () => {
    expect(pickDish('Prato do dia', [])).toBe('generico')
    expect(pickDish('Prato do dia', ['desconhecida'])).toBe('generico')
    expect(pickDish('inventei agora', ['outra coisa'])).toBe('generico')
  })

  it('prato vazio ainda usa a categoria, senão é genérico', () => {
    expect(pickDish('', [])).toBe('generico')
    expect(pickDish('   ', [])).toBe('generico')
    expect(pickDish('', ['italiana'])).toBe('massa')
  })
})
