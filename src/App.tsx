import { Toaster } from '@/components/ui/Toaster'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchProducts } from '@/store/slices/productSlide'
import PaymentView from '@/views/PaymentView/PaymentView'
import ProductView from '@/views/ProductView/ProductView'
import ResultView from '@/views/ResultView/ResultView'
import SummaryView from '@/views/SummaryView/SummaryView'
import { useEffect } from 'react'

export default function App() {
  const dispatch = useAppDispatch()
  const step = useAppSelector((s) => s.checkout.currentStep)

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {step === 1 && <ProductView />}
      {step === 2 && <PaymentView />}
      {step === 3 && <SummaryView />}
      {step === 4 && <ResultView />}
    </div>
  )
}