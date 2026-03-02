import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SummaryView from './SummaryView'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import checkoutReducer from '@/store/slices/checkoutSlide'
import { tokenizeCard, apiClient } from '@/lib/api'

jest.mock('@/lib/api', () => ({
    tokenizeCard: jest.fn(),
    apiClient: {
        post: jest.fn(),
    },
}))

const mockState = {
    selectedProduct: { id: 'p1', name: 'Product 1', price: 10000, description: 'Desc', category: 'Cat', imageUrl: 'img' },
    summary: { productAmount: 10000, baseFee: 3500, deliveryFee: 8000, total: 21500 },
    card: { cardNumber: '4111 1111 1111 1111', expiryMonth: '12', expiryYear: '25', cvv: '123', cardHolder: 'Juan' },
    customer: { email: 'juan@email.com', name: 'Juan', phone: '300123' },
    delivery: { address: 'Calle 1', city: 'Medellín', department: 'Antioquia' },
    isLoading: false,
}

const renderWithStore = (state = mockState) => {
    const store = configureStore({
        reducer: { checkout: checkoutReducer },
        preloadedState: { checkout: { ...state, currentStep: 3 } as any }
    })
    return {
        store,
        ...render(
            <Provider store={store}>
                <SummaryView />
            </Provider>
        )
    }
}

describe('SummaryView', () => {
    it('renders summary information', () => {
        renderWithStore()
        expect(screen.getByText('Confirmar pago')).toBeInTheDocument()
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getAllByText(/21\.500/)[0]).toBeInTheDocument()
    })

    it('redirects to step 1 if state is missing', () => {
        const { store } = renderWithStore({ ...mockState, selectedProduct: null } as any)
        expect(store.getState().checkout.currentStep).toBe(1)
    })

    it('handles successful payment flow', async () => {
        ; (tokenizeCard as jest.Mock).mockResolvedValue({ id: 'tok_123' })
            ; (apiClient.post as jest.Mock).mockResolvedValue({
                data: {
                    data: {
                        transactionId: 'tx_abc',
                        reference: 'REF-001',
                        status: 'APPROVED',
                        gatewayId: 'gw_789',
                        amountInCents: 2150000
                    }
                }
            })

        renderWithStore()

        const payButton = screen.getByText(/Pagar/i)
        fireEvent.click(payButton)

        await waitFor(() => {
            expect(tokenizeCard).toHaveBeenCalled()
            expect(apiClient.post).toHaveBeenCalledWith('/transactions', expect.any(Object), expect.any(Object))
        })
    })

    it('handles payment failure', async () => {
        ; (tokenizeCard as jest.Mock).mockRejectedValue(new Error('Tokenization failed'))

        const { store } = renderWithStore()

        const payButton = screen.getByText(/Pagar/i)
        fireEvent.click(payButton)

        await waitFor(() => {
            expect(store.getState().checkout.transaction?.status).toBe('ERROR')
        })
    })
})
