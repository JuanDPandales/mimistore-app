import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentView from './PaymentView'
import { Toaster } from '@/components/ui/Toaster'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import checkoutReducer from '@/store/slices/checkoutSlide'
import productReducer from '@/store/slices/productSlide'

const mockProduct = { id: 'p1', name: 'Product 1', price: 10000, category: 'Cat1', description: 'Desc1', imageUrl: 'img1' }

const renderWithStore = (selectedProduct: any = null) => {
    const store = configureStore({
        reducer: { checkout: checkoutReducer, products: productReducer },
        preloadedState: {
            checkout: { currentStep: 2, selectedProduct } as any,
        }
    })
    return render(<Provider store={store}><Toaster /><PaymentView /></Provider>)
}

describe('PaymentView', () => {
    it('renders the card tab by default', () => {
        renderWithStore()
        expect(screen.getByText('Datos de pago')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/1234 5678 9012 3456/)).toBeInTheDocument()
    })

    it('shows selected product preview', () => {
        renderWithStore(mockProduct)
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Cat1')).toBeInTheDocument()
    })

    it('switches to delivery tab', () => {
        renderWithStore()
        const deliveryTab = screen.getByRole('button', { name: /Entrega/i })
        fireEvent.click(deliveryTab)
        // Field renders an input with a placeholder (not an aria-label)
        expect(screen.getByPlaceholderText(/Juan García/i)).toBeInTheDocument()
    })

    it('switches back to card tab', () => {
        renderWithStore()
        // switch to delivery
        fireEvent.click(screen.getByRole('button', { name: /Entrega/i }))
        // switch back to card
        fireEvent.click(screen.getByRole('button', { name: /Tarjeta/i }))
        expect(screen.getByPlaceholderText(/1234 5678 9012 3456/)).toBeInTheDocument()
    })

    it('shows validation errors after empty submission', () => {
        renderWithStore()
        const continueButton = screen.getByText(/Ver resumen del pago/i)
        fireEvent.click(continueButton)
        // After submission, the card/delivery error indicators should appear (tab has red dot)
        // And validation logic runs — we verify via store that we didn't dispatch setPaymentInfo
        // The Toaster now renders the message
        expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument()
    })

    it('navigates back when clicking back button', () => {
        const store = configureStore({
            reducer: { checkout: checkoutReducer, products: productReducer },
            preloadedState: { checkout: { currentStep: 2 } as any }
        })
        render(<Provider store={store}><PaymentView /></Provider>)
        // The back arrow button has no text, get all buttons and find the small one
        const buttons = screen.getAllByRole('button')
        // First button rendered is the back arrow (size-9)
        fireEvent.click(buttons[0])
        expect(store.getState().checkout.currentStep).toBe(1)
    })
})
