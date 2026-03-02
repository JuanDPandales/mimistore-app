import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import checkoutReducer, { persistState } from './slices/checkoutSlide'
import productsReducer from './slices/productSlide'

export const store = configureStore({
    reducer: {
        checkout: checkoutReducer,
        products: productsReducer,
    },
})

// Persiste checkout en cada cambio — nunca incluye datos de tarjeta
store.subscribe(() => { persistState(store.getState().checkout) })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector