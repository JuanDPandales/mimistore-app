import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from './ProductCard'
import { Product } from '@/types'

describe('ProductCard', () => {
    const product: Product = {
        id: '1',
        name: 'Classic Leather Collar',
        description: 'Durable brown leather collar.',
        price: 15000,
        category: 'Collars',
        imageUrl: 'https://via.placeholder.com/150'
    }

    it('renders product information correctly', () => {
        render(<ProductCard product={product} stock={10} onBuy={() => { }} />)

        expect(screen.getByText(product.name)).toBeInTheDocument()
        expect(screen.getByText(product.description)).toBeInTheDocument()
        expect(screen.getByText(product.category)).toBeInTheDocument()
        // 15.000 (standard COP format)
        expect(screen.getByText(/15.000/)).toBeInTheDocument()
    })

    it('handles "Buy" button click', () => {
        const onBuyMock = jest.fn()
        render(<ProductCard product={product} stock={10} onBuy={onBuyMock} />)

        const buyButton = screen.getByRole('button', { name: /Comprar/i })
        fireEvent.click(buyButton)

        expect(onBuyMock).toHaveBeenCalledWith(product)
    })

    it('disables "Buy" button when out of stock', () => {
        const onBuyMock = jest.fn()
        render(<ProductCard product={product} stock={0} onBuy={onBuyMock} />)

        const buyButton = screen.getByRole('button', { name: /Comprar/i })
        expect(buyButton).toBeDisabled()
        expect(screen.getByText('Agotado')).toBeInTheDocument()

        fireEvent.click(buyButton)
        expect(onBuyMock).not.toHaveBeenCalled()
    })
})
