interface StockBadgeProps { quantity: number }

export function StockBadge({ quantity }: StockBadgeProps) {
    if (quantity === 0)
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                <span className="size-1.5 rounded-full bg-red-500" />
                Agotado
            </span>
        )
    if (quantity <= 3)
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                Últimas {quantity} unidades
            </span>
        )
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            <span className="size-1.5 rounded-full bg-green-500" />
            {quantity} disponibles
        </span>
    )
}