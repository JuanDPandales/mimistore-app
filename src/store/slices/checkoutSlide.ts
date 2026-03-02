import type { CardInfo, CheckoutStep, Customer, DeliveryInfo, PaymentSummary, Product, Transaction } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const BASE_FEE = 3500   // COP
const DELIVERY_FEE = 8000   // COP

interface CheckoutState {
    currentStep: CheckoutStep
    selectedProduct: Product | null
    customer: Customer | null
    delivery: DeliveryInfo | null
    card: CardInfo | null    // solo en memoria, nunca persiste
    summary: PaymentSummary | null
    transaction: Transaction | null
    isLoading: boolean
    error: string | null
}

const initialState: CheckoutState = {
    currentStep: 1, selectedProduct: null, customer: null,
    delivery: null, card: null, summary: null,
    transaction: null, isLoading: false, error: null,
}

// ─── Persistencia selectiva (sin tarjeta) ────────────────────────────────────
const PERSIST_KEY = 'pawsome_checkout'

export function loadPersistedState(): Partial<CheckoutState> {
    try {
        const raw = localStorage.getItem(PERSIST_KEY)
        if (!raw) return {}
        const p = JSON.parse(raw)
        return {
            currentStep: p.currentStep, selectedProduct: p.selectedProduct,
            customer: p.customer, delivery: p.delivery,
            summary: p.summary, transaction: p.transaction,
        }
    } catch { return {} }
}

export function persistState(state: CheckoutState): void {
    try {
        localStorage.setItem(PERSIST_KEY, JSON.stringify({
            currentStep: state.currentStep, selectedProduct: state.selectedProduct,
            customer: state.customer, delivery: state.delivery,
            summary: state.summary,
            // Solo persiste id + status de la transacción, nunca datos de tarjeta
            transaction: state.transaction
                ? { id: state.transaction.id, reference: state.transaction.reference, status: state.transaction.status, amount: state.transaction.amount }
                : null,
        }))
    } catch { /* silent fail */ }
}

export function clearPersistedState(): void {
    localStorage.removeItem(PERSIST_KEY)
}

// ─── Slice ────────────────────────────────────────────────────────────────────
const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: { ...initialState, ...loadPersistedState() } as CheckoutState,
    reducers: {
        goToStep(state, action: PayloadAction<CheckoutStep>) {
            state.currentStep = action.payload
        },
        nextStep(state) {
            if (state.currentStep < 4) state.currentStep = (state.currentStep + 1) as CheckoutStep
        },
        resetFlow(state) {
            Object.assign(state, initialState)
            clearPersistedState()
        },
        selectProduct(state, action: PayloadAction<Product>) {
            state.selectedProduct = action.payload
            state.currentStep = 2
        },
        setPaymentInfo(state, action: PayloadAction<{ customer: Customer; delivery: DeliveryInfo; card: CardInfo }>) {
            state.customer = action.payload.customer
            state.delivery = action.payload.delivery
            state.card = action.payload.card  // solo en memoria
            if (state.selectedProduct) {
                const productAmount = state.selectedProduct.price
                state.summary = { productAmount, baseFee: BASE_FEE, deliveryFee: DELIVERY_FEE, total: productAmount + BASE_FEE + DELIVERY_FEE }
            }
            state.currentStep = 3
        },
        setTransaction(state, action: PayloadAction<Transaction>) {
            state.transaction = action.payload
        },
        setTransactionResult(state, action: PayloadAction<Transaction>) {
            state.transaction = action.payload
            state.card = null   // limpia tarjeta de memoria después del intento
            state.currentStep = 4
        },
        setLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload },
        setError(state, action: PayloadAction<string | null>) { state.error = action.payload },
    },
})

export const { goToStep, nextStep, resetFlow, selectProduct, setPaymentInfo,
    setTransaction, setTransactionResult, setLoading, setError } = checkoutSlice.actions
export default checkoutSlice.reducer