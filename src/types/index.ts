export type CheckoutStep = 1 | 2 | 3 | 4

export interface Product {
  id: string
  name: string
  description: string
  price: number        // COP, base (no centavos)
  imageUrl: string
  category: string
}

export interface StockInfo {
  productId: string
  quantity: number
}

export interface Customer {
  id?: string
  name: string
  email: string
  phone: string
}

export interface DeliveryInfo {
  address: string
  city: string
  department: string
}

export interface CardInfo {
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardType: 'VISA' | 'MASTERCARD' | 'UNKNOWN'
}

export interface PaymentSummary {
  productAmount: number
  baseFee: number       // 3500 COP
  deliveryFee: number   // 8000 COP
  total: number
}

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED'

export interface Transaction {
  id: string
  gatewayId?: string | null
  reference: string
  status: TransactionStatus
  amount: number
  customer?: Customer
}