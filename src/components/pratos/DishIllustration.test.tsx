import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DishIllustration } from './DishIllustration'

describe('DishIllustration', () => {
  it('expõe role=img com aria-label "Ilustração de <prato>"', () => {
    render(<DishIllustration prato="Camarão na moranga" categorias={['frutos do mar']} />)

    const imagem = screen.getByRole('img', { name: 'Ilustração de Camarão na moranga' })
    expect(imagem).toBeInTheDocument()
    expect(imagem).toHaveAttribute('aria-label', 'Ilustração de Camarão na moranga')
  })

  it('usa o nome do prato no rótulo (outro tipo de prato)', () => {
    render(<DishIllustration prato="Picanha na brasa" categorias={['churrasco']} />)

    expect(
      screen.getByRole('img', { name: 'Ilustração de Picanha na brasa' }),
    ).toBeInTheDocument()
  })

  it('com decorative fica aria-hidden e sem role=img', () => {
    const { container } = render(
      <DishIllustration prato="Salada do mar" categorias={['saudável']} decorative />,
    )

    expect(screen.queryByRole('img')).toBeNull()
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
  })
})
