import { apiClient } from '@/lib/api'
import reducer, { fetchProducts, refreshStock, updateStockLocally } from './productSlide'
import { configureStore } from '@reduxjs/toolkit'

jest.mock('@/lib/api', () => ({
    apiClient: {
        get: jest.fn(),
    },
}))

describe('productSlice', () => {
    const initialState = { items: [], stock: {}, isLoading: false, error: null }

    it('should return the initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle updateStockLocally', () => {
        const state = reducer(initialState, updateStockLocally({ productId: '1', quantity: 5 }))
        expect(state.stock['1']).toBe(5)
    })

    describe('fetchProducts', () => {
        it('should handle pending', () => {
            const state = reducer(initialState, fetchProducts.pending('', undefined))
            expect(state.isLoading).toBe(true)
            expect(state.error).toBeNull()
        })

        it('should handle fulfilled', () => {
            const products = [
                { id: '1', name: 'P1', price: 10, stock: 5, category: 'C1', description: 'D1', imageUrl: 'I1' },
            ]
            const state = reducer(initialState, fetchProducts.fulfilled(products, '', undefined))
            expect(state.isLoading).toBe(false)
            expect(state.items).toHaveLength(1)
            expect(state.items[0].name).toBe('P1')
            expect(state.stock['1']).toBe(5)
        })

        it('should handle rejected', () => {
            const error = new Error('Failed')
            const state = reducer(initialState, fetchProducts.rejected(error, '', undefined))
            expect(state.isLoading).toBe(false)
            expect(state.error).toBe('Failed')
        })
    })

    describe('refreshStock', () => {
        it('should handle fulfilled', () => {
            const state = reducer(initialState, refreshStock.fulfilled({ productId: '1', quantity: 10 }, '', '1'))
            expect(state.stock['1']).toBe(10)
        })
    })

    describe('async actions', () => {
        it('fetchProducts thunk works', async () => {
            const products = [{ id: '1', name: 'P1', stock: 5 }]
                ; (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: products } })

            const store = configureStore({ reducer: { products: reducer } })
            await store.dispatch(fetchProducts())

            const state = store.getState().products
            expect(state.items).toHaveLength(1)
            expect(state.stock['1']).toBe(5)
        })

        it('refreshStock thunk works', async () => {
            ; (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: { quantity: 20 } } })

            const store = configureStore({ reducer: { products: reducer } })
            await store.dispatch(refreshStock('1'))

            const state = store.getState().products
            expect(state.stock['1']).toBe(20)
        })
    })
})
