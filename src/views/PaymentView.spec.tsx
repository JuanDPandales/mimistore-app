import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentView from './PaymentView'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import checkoutReducer from '@/store/slices/checkoutSlide'

const renderWithStore = () => {
    const store = configureStore({
        reducer: { checkout: checkoutReducer },
        preloadedState: {
            checkout: {
                currentStep: 2,
                selectedProduct: { id: 'p1', name: 'Product 1', price: 10000 }
            } as any
        }
    })
    return render(
        <Provider store={store}>
            <PaymentView />
        </Provider>
    )
}

describe('PaymentView', () => {
    it('renders correctly with initial tab', () => {
        renderWithStore()
        expect(screen.getByText('Datos de pago')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/0000 0000 0000 0000/)).toBeInTheDocument()
    })

    it('switches between tabs', () => {
        renderWithStore()

        const deliveryTab = screen.getByRole('button', { name: /Entrega/i })
        fireEvent.click(deliveryTab)

        expect(screen.getByPlaceholderText(/Nombre completo/)).toBeInTheDocument()

        const cardTab = screen.getByRole('button', { name: /Tarjeta/i })
        fireEvent.click(cardTab)
        expect(screen.getByPlaceholderText(/0000 0000 0000 0000/)).toBeInTheDocument()
    })

    it('shows errors on invalid form submission', () => {
        renderWithStore()

        const continueButton = screen.getByText(/Ver resumen del pago/i)
        fireEvent.click(continueButton)

        expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument()
    })
})
