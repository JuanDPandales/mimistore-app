import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from './App'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import checkoutReducer from '@/store/slices/checkoutSlide'
import productReducer from '@/store/slices/productSlide'

const mockProduct = { id: 'p1', name: 'TestProduct', price: 10000, category: 'Cat1', description: 'Desc', imageUrl: 'img' }

const makeStore = (checkoutState: any, productsState: any = { items: [], stock: {}, isLoading: false, error: null }) =>
    configureStore({
        reducer: { checkout: checkoutReducer, products: productReducer },
        preloadedState: { checkout: checkoutState, products: productsState }
    })

describe('App', () => {
    it('renders ProductView on step 1', () => {
        const store = makeStore({ currentStep: 1 } as any, { items: [mockProduct], stock: { 'p1': 5 }, isLoading: false, error: null })
        render(<Provider store={store}><App /></Provider>)
        // Mimi Store appears in header AND footer
        expect(screen.getAllByText('Mimi Store')[0]).toBeInTheDocument()
        expect(screen.getByText('TestProduct')).toBeInTheDocument()
    })

    it('renders ProductView loading state on step 1', () => {
        const store = makeStore({ currentStep: 1 } as any, { items: [], stock: {}, isLoading: true, error: null })
        render(<Provider store={store}><App /></Provider>)
        // Mimi Store appears in header AND footer
        expect(screen.getAllByText('Mimi Store')[0]).toBeInTheDocument()
    })

    it('renders PaymentView on step 2', () => {
        const store = makeStore({ currentStep: 2, selectedProduct: mockProduct } as any)
        render(<Provider store={store}><App /></Provider>)
        expect(screen.getByText('Datos de pago')).toBeInTheDocument()
    })

    it('renders SummaryView on step 3', () => {
        const store = makeStore({
            currentStep: 3,
            selectedProduct: mockProduct,
            summary: { total: 100, productAmount: 100, baseFee: 0, deliveryFee: 0 },
            card: { cardHolder: 'Juan' },
            customer: { email: 'a@b.com' },
            delivery: { city: 'Medellín' },
        } as any)
        render(<Provider store={store}><App /></Provider>)
        expect(screen.getByText('Confirmar pago')).toBeInTheDocument()
    })

    it('renders ResultView on step 4', () => {
        const store = makeStore({
            currentStep: 4,
            transaction: { id: 'tx1', reference: 'R1', status: 'APPROVED', amount: 100 }
        } as any)
        render(<Provider store={store}><App /></Provider>)
        expect(screen.getByText('¡Pago exitoso!')).toBeInTheDocument()
    })
})
