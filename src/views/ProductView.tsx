import { ProductCard } from '@/components/product/ProductCard'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectProduct } from '@/store/slices/checkoutSlide'
import { Heart, Shield, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function ProductView() {
    const dispatch = useAppDispatch()
    const { items: products, stock, isLoading } = useAppSelector((s) => s.products)
    const [selectedCategory, setSelectedCategory] = useState('Todos')

    const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map((p) => p.category)))], [products])
    const filtered = useMemo(() => selectedCategory === 'Todos' ? products : products.filter((p) => p.category === selectedCategory), [products, selectedCategory])

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
                            <span className="font-serif text-sm font-bold text-white">P</span>
                        </div>
                        <span className="font-serif text-xl font-bold text-foreground">Mimi Store</span>
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">Productos premium para mascotas</p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Hero */}
                <section className="mb-10 flex flex-col items-center text-center animate-fade-in">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
                        <Heart className="size-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary">Lo mejor para tu mascota</span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-foreground md:text-5xl leading-tight">
                        Todo lo que tu <span className="text-primary">peludo necesita</span>
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                        Productos premium seleccionados con amor. Desde alimentación natural hasta accesorios artesanales.
                    </p>
                </section>

                {/* Trust badges */}
                <section className="mb-8 grid grid-cols-3 gap-3">
                    {[
                        { icon: Truck, title: 'Envío Rápido', sub: 'Todo Colombia' },
                        { icon: Shield, title: 'Garantía', sub: 'Productos certificados' },
                        { icon: Heart, title: 'Con Amor', sub: 'Para mascotas felices' },
                    ].map(({ icon: Icon, title, sub }) => (
                        <div key={title} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-center">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
                                <Icon className="size-4 text-primary" />
                            </div>
                            <p className="text-xs font-semibold text-foreground">{title}</p>
                            <p className="text-[10px] text-muted-foreground">{sub}</p>
                        </div>
                    ))}
                </section>

                {/* Filtros por categoría */}
                <section className="mb-6 flex gap-2 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)}
                            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all
                ${selectedCategory === cat
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                            {cat}
                        </button>
                    ))}
                </section>

                {/* Grid de productos */}
                {isLoading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse rounded-3xl bg-muted aspect-[3/4]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
                        {filtered.map((product) => (
                            <div key={product.id} className="animate-fade-in">
                                <ProductCard product={product} stock={stock[product.id] ?? 0} onBuy={(p) => dispatch(selectProduct(p))} />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="mt-12 border-t border-border bg-card">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary">
                            <span className="font-serif text-xs font-bold text-white">P</span>
                        </div>
                        <span className="font-serif font-semibold text-foreground">Mimi Store</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Productos premium para mascotas felices.</p>
                </div>
            </footer>
        </div>
    )
}