import reducer, { goToStep, nextStep, resetFlow, selectProduct, setPaymentInfo, setTransaction, setTransactionResult, setLoading, setError } from './checkoutSlide'
import { Product, Transaction } from '@/types'

describe('checkoutSlice', () => {
    const initialState = {
        currentStep: 1, selectedProduct: null, customer: null,
        delivery: null, card: null, summary: null,
        transaction: null, isLoading: false, error: null,
    }

    it('should return the initial state', () => {
        const state = reducer(undefined, { type: 'unknown' })
        expect(state.currentStep).toBe(1)
    })

    it('should handle goToStep', () => {
        const state = reducer(initialState as any, goToStep(2))
        expect(state.currentStep).toBe(2)
    })

    it('should handle nextStep', () => {
        let state = reducer(initialState as any, nextStep())
        expect(state.currentStep).toBe(2)
        state = reducer(state as any, nextStep())
        expect(state.currentStep).toBe(3)
        state = reducer(state as any, nextStep())
        expect(state.currentStep).toBe(4)
        state = reducer(state as any, nextStep())
        expect(state.currentStep).toBe(4) // Cap at 4
    })

    it('should handle resetFlow', () => {
        const modifiedState = reducer(initialState as any, goToStep(3))
        const state = reducer(modifiedState as any, resetFlow())
        expect(state).toEqual(initialState)
    })

    it('should handle selectProduct', () => {
        const product: Product = { id: '1', name: 'P1', price: 100, description: 'D1', category: 'C1', imageUrl: 'I1' }
        const state = reducer(initialState as any, selectProduct(product))
        expect(state.selectedProduct).toEqual(product)
        expect(state.currentStep).toBe(2)
    })

    it('should handle setPaymentInfo', () => {
        const product: Product = { id: '1', name: 'P1', price: 100, description: 'D1', category: 'C1', imageUrl: 'I1' }
        const stateWithProduct = reducer(initialState as any, selectProduct(product))

        const info = {
            customer: { email: 'e', name: 'n', phone: 'p' },
            delivery: { address: 'a', city: 'c', department: 'd' },
            card: { token: 't' } as any
        }
        const state = reducer(stateWithProduct as any, setPaymentInfo(info))
        expect(state.customer).toEqual(info.customer)
        expect(state.delivery).toEqual(info.delivery)
        expect(state.card).toEqual(info.card)
        expect(state.summary).not.toBeNull()
        expect(state.summary?.total).toBe(100 + 3500 + 8000)
        expect(state.currentStep).toBe(3)
    })

    it('should handle setTransaction', () => {
        const tx: Transaction = { id: '1', reference: 'r', status: 'PENDING', amount: 100 }
        const state = reducer(initialState as any, setTransaction(tx))
        expect(state.transaction).toEqual(tx)
    })

    it('should handle setTransactionResult', () => {
        const tx: Transaction = { id: '1', reference: 'r', status: 'APPROVED', amount: 100 }
        const state = reducer(initialState as any, setTransactionResult(tx))
        expect(state.transaction).toEqual(tx)
        expect(state.card).toBeNull()
        expect(state.currentStep).toBe(4)
    })

    it('should handle setLoading and setError', () => {
        let state = reducer(initialState as any, setLoading(true))
        expect(state.isLoading).toBe(true)
        state = reducer(state as any, setError('err'))
        expect(state.error).toBe('err')
    })
})
