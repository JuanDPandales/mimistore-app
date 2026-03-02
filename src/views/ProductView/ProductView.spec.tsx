import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductView from './ProductView'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import productReducer from '@/store/slices/productSlide'
import checkoutReducer from '@/store/slices/checkoutSlide'

const renderWithStore = (state: any) => {
    const store = configureStore({
        reducer: {
            products: productReducer,
            checkout: checkoutReducer,
        },
        preloadedState: {
            products: state,
        }
    })
    return render(
        <Provider store={store}>
            <ProductView />
        </Provider>
    )
}

describe('ProductView', () => {
    const initialState = {
        items: [
            { id: '1', name: 'Product 1', price: 10000, category: 'Cat1', description: 'Desc1', imageUrl: 'img1' },
            { id: '2', name: 'Product 2', price: 20000, category: 'Cat2', description: 'Desc2', imageUrl: 'img2' },
        ],
        stock: { '1': 10, '2': 5 },
        isLoading: false,
        error: null,
    }

    it('renders header and products', () => {
        renderWithStore(initialState)
        // Mimi Store appears in header AND footer — use getAllByText
        expect(screen.getAllByText('Mimi Store')[0]).toBeInTheDocument()
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Product 2')).toBeInTheDocument()
    })

    it('renders category filter buttons', () => {
        renderWithStore(initialState)
        // There are category buttons (filter) - use getAllByText to avoid ambiguity
        const cat1Buttons = screen.getAllByText('Cat1')
        expect(cat1Buttons.length).toBeGreaterThan(0)
        // The first one should be the filter button (rendered before products)
        expect(cat1Buttons[0]).toBeInTheDocument()
        expect(screen.getByText('Todos')).toBeInTheDocument()
    })

    it('filters products by category', () => {
        renderWithStore(initialState)

        // Get the category filter button specifically by role
        const catButtons = screen.getAllByRole('button', { name: /Cat1/i })
        // The filter button should be present
        expect(catButtons.length).toBeGreaterThan(0)
        fireEvent.click(catButtons[0])

        expect(screen.getByText('Product 1')).toBeInTheDocument()
        // Product 2 should disappear after filtering
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
    })

    it('shows all products when "Todos" is selected', () => {
        renderWithStore(initialState)
        // First filter by Cat1
        const catButtons = screen.getAllByRole('button', { name: /Cat1/i })
        fireEvent.click(catButtons[0])
        // Then reset to all
        fireEvent.click(screen.getByRole('button', { name: /Todos/i }))
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Product 2')).toBeInTheDocument()
    })

    it('shows skeleton when loading', () => {
        renderWithStore({ ...initialState, isLoading: true })
        const pulses = document.querySelectorAll('.animate-pulse')
        expect(pulses.length).toBeGreaterThan(0)
    })
})
