import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchProducts, searchProducts } from '../api/products'
import type { Product } from '../api/products'
import { AddProductModal, type AddProductFormValues } from '../components/products/AddProductModal'
import { ProductTable } from '../components/products/ProductTable'
import { useAuthStore } from '../stores/authStore'
import refreshIconUrl from '../assets/svg/vector_1.svg'

const PAGE_SIZE = 20
type SortKey = 'title' | 'brand' | 'sku' | 'rating' | 'price'
type SortOrder = 'asc' | 'desc'

const SEARCH_DEBOUNCE_MS = 400

export function ProductsPage() {
  const logout = useAuthStore((s) => s.logout)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortKey | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [localProducts, setLocalProducts] = useState<Product[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const effectiveSkip = (page - 1) * PAGE_SIZE

  const loadProducts = useCallback(async (q: string, skip: number) => {
    setLoading(true)
    try {
      if (q.trim()) {
        const res = await searchProducts(q.trim())
        setProducts(res.products)
        setTotal(res.total)
      } else {
        const res = await fetchProducts({ limit: PAGE_SIZE, skip })
        setProducts(res.products)
        setTotal(res.total)
      }
    } catch {
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (searchInput.trim() !== searchQuery) {
      debounceRef.current = setTimeout(() => {
        setSearchQuery(searchInput.trim())
        setPage(1)
      }, SEARCH_DEBOUNCE_MS)
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput, searchQuery])

  useEffect(() => {
    loadProducts(searchQuery, searchQuery ? 0 : effectiveSkip)
  }, [searchQuery, effectiveSkip, loadProducts])

  const displayProducts = useMemo(
    () => (searchQuery ? products : [...localProducts, ...products]),
    [localProducts, products, searchQuery],
  )

  const displayTotal = searchQuery ? total : total + localProducts.length
  const totalPages = searchQuery ? 1 : Math.max(1, Math.ceil(displayTotal / PAGE_SIZE))
  const startItem = displayTotal === 0 ? 0 : searchQuery ? 1 : (page - 1) * PAGE_SIZE + 1
  const endItem =
    displayTotal === 0
      ? 0
      : searchQuery
        ? displayTotal
        : Math.min((page - 1) * PAGE_SIZE + displayProducts.length, displayTotal)

  const handleSort = useCallback((key: SortKey) => {
    setSortBy((prev) => {
      if (prev === key) {
        setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
        return key
      }
      setSortOrder('asc')
      return key
    })
  }, [])

  const handleAddProduct = useCallback((values: AddProductFormValues) => {
    const newProduct: Product = {
      id: -Date.now(),
      title: values.title.trim(),
      price: Number(values.price) || 0,
      brand: values.brand.trim(),
      sku: values.sku.trim(),
      rating: 0,
      category: undefined,
    }
    setLocalProducts((prev) => [newProduct, ...prev])
  }, [])

  const handleRefresh = useCallback(() => {
    loadProducts(searchQuery, searchQuery ? 0 : (page - 1) * PAGE_SIZE)
  }, [loadProducts, searchQuery, page])

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <div className="mx-auto max-w-6xl px-4 py-5 pr-0 md:pr-8">
        <nav className="mb-8 flex items-center justify-between rounded-[10px] bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-[#000]">Товары</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Найти"
                className="w-64 rounded-lg border-0 bg-[#F3F3F3] py-2.5 pl-10 pr-4 text-sm text-[#000] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#242EDB]/20"
                aria-label="Поиск товаров"
              />
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Выйти
            </button>
          </div>
        </nav>

        <section className="rounded-xl bg-white px-6 py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[#000]">Все позиции</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Обновить"
              >
                <img src={refreshIconUrl} alt="" className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-2 rounded-md bg-[#242EDB] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
              >
                <PlusIcon />
                Добавить
              </button>
            </div>
          </div>

          {loading && (
            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full animate-pulse bg-[#242EDB]"
                style={{ width: '40%' }}
                role="progressbar"
                aria-valuenow={40}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <ProductTable
              products={displayProducts}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row">
            <p className="text-sm text-[#000]">
              Показано {startItem}-{endItem} из {displayTotal}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                aria-label="Предыдущая страница"
              >
                <ChevronLeftIcon />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`min-w-[2.25rem] rounded px-2 py-1.5 text-sm font-medium ${
                      page === p
                        ? 'bg-[#797FEA] text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                aria-label="Следующая страница"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </section>
      </div>

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  )
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 52 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M26 6.5V20.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13.5H33"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
