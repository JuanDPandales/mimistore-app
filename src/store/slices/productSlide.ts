import { apiClient } from '@/lib/api'
import type { Product } from '@/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProductsState {
  items:     Product[]
  stock:     Record<string, number>  // productId → quantity
  isLoading: boolean
  error:     string | null
}

const initialState: ProductsState = { items: [], stock: {}, isLoading: false, error: null }

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const { data } = await apiClient.get<{ data: (Product & { stock: number })[] }>('/products')
  return data.data
})

export const refreshStock = createAsyncThunk('products/refreshStock', async (productId: string) => {
  const { data } = await apiClient.get<{ data: { quantity: number } }>(`/stock/${productId}`)
  return { productId, quantity: data.data.quantity }
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateStockLocally(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      state.stock[action.payload.productId] = action.payload.quantity
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,  (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchProducts.fulfilled,(state, action) => {
        state.isLoading = false
        state.items     = action.payload.map(({ stock: _s, ...p }) => p)
        action.payload.forEach((p) => { state.stock[p.id] = (p as Product & { stock: number }).stock ?? 0 })
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.error.message ?? 'Error loading products'
      })
      .addCase(refreshStock.fulfilled, (state, action) => {
        state.stock[action.payload.productId] = action.payload.quantity
      })
  },
})

export const { updateStockLocally } = productsSlice.actions
export default productsSlice.reducer