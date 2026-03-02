import { render, screen } from '@testing-library/react'
import { StockBadge } from './StockBadge'

describe('StockBadge', () => {
    it('shows "Agotado" when quantity is 0', () => {
        render(<StockBadge quantity={ 0} />)
        expect(screen.getByText('Agotado')).toBeInTheDocument()
    })
    it('shows "Últimas X unidades" when quantity <= 3', () => {
        render(<StockBadge quantity={ 2} />)
        expect(screen.getByText(/Últimas 2 unidades/)).toBeInTheDocument()
    })
    it('shows available count when quantity > 3', () => {
        render(<StockBadge quantity={ 10} />)
        expect(screen.getByText(/10 disponibles/)).toBeInTheDocument()
    })
})