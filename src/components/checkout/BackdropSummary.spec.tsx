import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { BackdropSummary } from './BackdropSummary'
import { Product, PaymentSummary } from '@/types'

describe('BackdropSummary', () => {
    const product: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Desc',
        price: 10000,
        category: 'Cat',
        imageUrl: 'img'
    }
    const summary: PaymentSummary = {
        productAmount: 10000,
        baseFee: 3500,
        deliveryFee: 8000,
        total: 21500
    }

    it('renders summary details correctly', () => {
        render(<BackdropSummary product={product} summary={summary} isLoading={false} onConfirm={() => { }} onBack={() => { }} />)

        expect(screen.getByText('Resumen del pago')).toBeInTheDocument()
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Cargo base')).toBeInTheDocument()
        expect(screen.getByText(/21.500/)).toBeInTheDocument()
    })

    it('handles confirm click', () => {
        const onConfirmMock = jest.fn()
        render(<BackdropSummary product={product} summary={summary} isLoading={false} onConfirm={onConfirmMock} onBack={() => { }} />)

        const payButton = screen.getByText(/Pagar/i)
        fireEvent.click(payButton)
        expect(onConfirmMock).toHaveBeenCalled()
    })

    it('shows loading state in button', () => {
        render(<BackdropSummary product={product} summary={summary} isLoading={true} onConfirm={() => { }} onBack={() => { }} />)
        expect(screen.getByText(/Procesando pago.../i)).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('calls onBack when clicking overlay', () => {
        const onBackMock = jest.fn()
        render(<BackdropSummary product={product} summary={summary} isLoading={false} onConfirm={() => { }} onBack={onBackMock} />)

        const overlay = screen.getByText(/Toca para editar/i)
        fireEvent.click(overlay)
        expect(onBackMock).toHaveBeenCalled()
    })
})
