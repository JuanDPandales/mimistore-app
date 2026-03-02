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

    it('renders products and categories', () => {
        renderWithStore(initialState)
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Product 2')).toBeInTheDocument()
        expect(screen.getByText('Todos')).toBeInTheDocument()
        expect(screen.getByText('Cat1')).toBeInTheDocument()
    })

    it('filters products by category', () => {
        renderWithStore(initialState)

        const cat1Button = screen.getByText('Cat1')
        fireEvent.click(cat1Button)

        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument()

        const allButton = screen.getByText('Todos')
        fireEvent.click(allButton)
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Product 2')).toBeInTheDocument()
    })

    it('shows skeleton when loading', () => {
        renderWithStore({ ...initialState, isLoading: true })
        // Checks if it renders elements with animate-pulse
        const pulses = document.querySelectorAll('.animate-pulse')
        expect(pulses.length).toBeGreaterThan(0)
    })
})
