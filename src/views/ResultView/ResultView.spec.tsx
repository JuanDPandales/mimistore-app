import checkoutReducer from '@/store/slices/checkoutSlide'
import productReducer from '@/store/slices/productSlide'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import ResultView from './ResultView'

const renderWithStore = (checkoutState: any) => {
    const store = configureStore({
        reducer: { checkout: checkoutReducer, products: productReducer },
        preloadedState: { checkout: checkoutState }
    })
    return { store, ...render(<Provider store={store}><ResultView /></Provider>) }
}

const mockProduct = { id: 'p1', name: 'Classic Collar', price: 15000, category: 'Collars', imageUrl: 'img', description: 'Desc' }
const mockSummary = { productAmount: 15000, baseFee: 3500, deliveryFee: 8000, total: 26500 }
const mockTx = { id: 'tx_123', reference: 'REF-456', status: 'APPROVED', amount: 100000 }

describe('ResultView', () => {
    it('redirects to step 1 if no transaction', () => {
        const { store } = renderWithStore({ transaction: null, selectedProduct: mockProduct } as any)
        expect(store.getState().checkout.currentStep).toBe(1)
    })

    it('renders APPROVED state correctly', () => {
        renderWithStore({ transaction: mockTx, selectedProduct: mockProduct, summary: mockSummary, customer: { email: 'a@b.com', city: 'Medellín' } } as any)
        expect(screen.getByText('¡Pago exitoso!')).toBeInTheDocument()
        expect(screen.getByText(/Medellín/)).toBeInTheDocument()
        expect(screen.getByText('Classic Collar')).toBeInTheDocument()
        expect(screen.getByText('REF-456')).toBeInTheDocument()
    })

    it('renders DECLINED state correctly', () => {
        renderWithStore({ transaction: { ...mockTx, status: 'DECLINED' }, selectedProduct: mockProduct, summary: mockSummary } as any)
        expect(screen.getByText('Pago rechazado')).toBeInTheDocument()
        expect(screen.getByText(/Tu tarjeta fue rechazada/)).toBeInTheDocument()
    })

    it('renders ERROR state correctly', () => {
        renderWithStore({ transaction: { ...mockTx, status: 'ERROR' }, selectedProduct: mockProduct, summary: mockSummary } as any)
        expect(screen.getByText('Error en el pago')).toBeInTheDocument()
        expect(screen.getByText(/Ocurrió un error/)).toBeInTheDocument()
    })

    it('resets flow on "Volver a la tienda" click for approved', () => {
        const { store } = renderWithStore({ transaction: mockTx, selectedProduct: mockProduct, summary: mockSummary } as any)
        const btn = screen.getByRole('button', { name: /Volver a la tienda/i })
        fireEvent.click(btn)
        expect(store.getState().checkout.transaction).toBeNull()
    })

    it('resets flow on "Intentar de nuevo" click for declined', () => {
        const { store } = renderWithStore({ transaction: { ...mockTx, status: 'DECLINED' }, selectedProduct: mockProduct, summary: mockSummary } as any)
        const btn = screen.getByRole('button', { name: /Intentar de nuevo/i })
        fireEvent.click(btn)
        expect(store.getState().checkout.transaction).toBeNull()
    })
})
