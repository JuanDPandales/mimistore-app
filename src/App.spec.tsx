import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from './App'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import checkoutReducer from '@/store/slices/checkoutSlide'
import productReducer from '@/store/slices/productSlide'

const mockProduct = {
    id: '1', name: 'Product 1', price: 10000, category: 'Cat1', description: 'Desc1', imageUrl: 'img1'
}

const renderWithStore = (step = 1) => {
    const store = configureStore({
        reducer: {
            checkout: checkoutReducer,
            products: productReducer,
        },
        preloadedState: {
            checkout: {
                currentStep: step,
                selectedProduct: step >= 2 ? mockProduct : null,
                summary: step >= 3 ? { total: 100, productAmount: 100, baseFee: 0, deliveryFee: 0 } : null,
                card: step >= 3 ? {} : null,
                customer: step >= 3 ? {} : null,
                delivery: step >= 3 ? {} : null,
            } as any,
            products: {
                items: [mockProduct],
                stock: { '1': 10 },
                isLoading: false,
                error: null
            }
        }
    })
    return render(
        <Provider store={store}>
            <App />
        </Provider>
    )
}

describe('App', () => {
    it('renders ProductView for step 1', () => {
        renderWithStore(1)
        expect(screen.getByText(/Mimi Store/i)).toBeInTheDocument()
        expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    it('renders PaymentView for step 2', () => {
        renderWithStore(2)
        expect(screen.getByText(/Datos de pago/i)).toBeInTheDocument()
    })

    it('renders SummaryView for step 3', () => {
        renderWithStore(3)
        expect(screen.getByText(/Confirmar pago/i)).toBeInTheDocument()
    })

    it('renders ResultView for step 4', () => {
        renderWithStore(4)
        expect(screen.getByText(/Pago exitoso!/i)).toBeInTheDocument()
    })
})
