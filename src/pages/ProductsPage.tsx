import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { deleteProduct, fetchProducts, searchProducts } from '../api/products'
import type { Product } from '../api/products'
import { AddProductModal, type AddProductFormValues } from '../components/products/AddProductModal'
import {
  EditProductModal,
  type EditProductFormValues,
} from '../components/products/EditProductModal'
import { ProductTable } from '../components/products/ProductTable'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, Spinner } from '../components/ui'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [localProducts, setLocalProducts] = useState<Product[]>([])
  const [editedProducts, setEditedProducts] = useState<Record<number, Product>>({})
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set())
  const showToast = useToastStore((s) => s.show)
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

  const baseProducts = useMemo(
    () => (searchQuery ? products : [...localProducts, ...products]),
    [localProducts, products, searchQuery],
  )
  const displayProducts = useMemo(
    () => baseProducts.filter((p) => !deletedIds.has(p.id)).map((p) => editedProducts[p.id] ?? p),
    [baseProducts, editedProducts, deletedIds],
  )

  const displayTotal = searchQuery
    ? displayProducts.length
    : Math.max(0, total + localProducts.length - deletedIds.size)
  const totalPages = searchQuery ? 1 : Math.max(1, Math.ceil(displayTotal / PAGE_SIZE))
  const startItem = displayTotal === 0 ? 0 : searchQuery ? 1 : (page - 1) * PAGE_SIZE + 1
  const endItem =
    displayTotal === 0
      ? 0
      : searchQuery
        ? displayProducts.length
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

  const handleEdit = useCallback((product: Product) => {
    setProductToEdit(product)
    setEditModalOpen(true)
  }, [])

  const handleSaveEdit = useCallback((product: Product, values: EditProductFormValues) => {
    const updated: Product = {
      ...product,
      title: values.title.trim(),
      price: Number(values.price) || 0,
      brand: values.brand.trim(),
      sku: values.sku.trim(),
    }
    if (product.id < 0) {
      setLocalProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)))
    } else {
      setEditedProducts((prev) => ({ ...prev, [product.id]: updated }))
    }
    setProductToEdit(null)
    setEditModalOpen(false)
  }, [])

  const handleDelete = useCallback(
    async (product: Product) => {
      if (product.id < 0) {
        setLocalProducts((prev) => prev.filter((p) => p.id !== product.id))
        showToast('Товар удалён')
        return
      }
      try {
        await deleteProduct(product.id)
        setDeletedIds((prev) => new Set(prev).add(product.id))
        setEditedProducts((prev) => {
          const next = { ...prev }
          delete next[product.id]
          return next
        })
        showToast('Товар удалён')
      } catch {
        showToast('Не удалось удалить товар')
      }
    },
    [showToast],
  )

  const handleRefresh = useCallback(() => {
    loadProducts(searchQuery, searchQuery ? 0 : (page - 1) * PAGE_SIZE)
  }, [loadProducts, searchQuery, page])

  return (
    <main className="min-h-screen bg-[#F6F6F6]">
      <div className="mx-auto max-w-6xl px-4 py-5 pr-0 md:pr-8">
        <nav
          className="mb-8 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[10px] bg-white px-6 py-4"
          aria-label="Основная навигация"
        >
          <h1 className="text-xl font-semibold text-black">Товары</h1>
          <div className="flex min-w-0 justify-center">
            <div className="relative w-full max-w-[1024px]">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Найти"
                className="w-full rounded-xl border-0 bg-[#F3F3F3] py-3 pl-11 pr-4 text-sm text-black placeholder:text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#242EDB]/10 focus:ring-inset"
                aria-label="Поиск товаров"
              />
            </div>
          </div>
          <div className="flex justify-end">
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
            <h2 className="text-lg font-semibold text-black">Все позиции</h2>
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

          {loading ? (
            <div
              className="flex min-h-[320px] items-center justify-center overflow-x-auto"
              aria-busy="true"
              aria-label="Загрузка товаров"
            >
              <Spinner
                className="loader-spinner h-10 w-10 rounded-full border-2 border-[#E5E7EB] border-t-[#242EDB]"
                aria-label="Загрузка товаров"
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <ProductTable
                  products={displayProducts}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row">
                <p className="text-sm text-black ">
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
                        className={`min-w-9 rounded px-2 py-1.5 text-sm font-medium ${
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
            </>
          )}
        </section>
      </div>

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
      <EditProductModal
        isOpen={editModalOpen}
        product={productToEdit}
        onClose={() => {
          setEditModalOpen(false)
          setProductToEdit(null)
        }}
        onSave={handleSaveEdit}
      />
    </main>
  )
}
