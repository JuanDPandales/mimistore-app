import { formatCurrency } from '@/lib/card'
import { Product } from '@/types'
import { ShoppingCart } from 'lucide-react'
import { StockBadge } from './StockBadge'

interface ProductCardProps {
    product: Product
    stock: number
    onBuy: (product: Product) => void
}

export function ProductCard({ product, stock, onBuy }: ProductCardProps) {
    const unavailable = stock === 0
    return (
        <article className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 max-h-[400px]
      ${unavailable ? 'opacity-60' : 'hover:shadow-xl hover:-translate-y-1'}`}>

            {/* Imagen */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <img src={product.imageUrl} alt={product.name}
                    className="max-h-[244px] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute top-3 left-3"><StockBadge quantity={stock} /></div>
                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    {product.category}
                </div>
            </div>

            {/* Contenido */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 font-semibold text-foreground leading-tight">{product.name}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-primary">
                        {formatCurrency(product.price)}
                    </span>
                    <button
                        onClick={() => !unavailable && onBuy(product)}
                        disabled={unavailable}
                        className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-200
              ${unavailable
                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                : 'bg-primary text-white hover:bg-primary-500 active:scale-95'}`}
                    >
                        <ShoppingCart className="size-4" /> Comprar
                    </button>
                </div>
            </div>
        </article>
    )
}