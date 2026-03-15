import { memo, useMemo } from 'react'
import type { Product } from '../../api/products'
import { ProductTableRow } from './ProductTableRow'

type SortKey = 'title' | 'brand' | 'sku' | 'rating' | 'price'
type SortOrder = 'asc' | 'desc'

interface ProductTableProps {
  products: Product[]
  sortBy: SortKey | null
  sortOrder: SortOrder
  onSort: (key: SortKey) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function sortProducts(products: Product[], sortBy: SortKey | null, order: SortOrder): Product[] {
  if (!sortBy) return products
  return [...products].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    const cmp =
      typeof aVal === 'string' && typeof bVal === 'string'
        ? aVal.localeCompare(bVal)
        : Number(aVal) - Number(bVal)
    return order === 'asc' ? cmp : -cmp
  })
}

export const ProductTable = memo(function ProductTable({
  products,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const sorted = useMemo(
    () => sortProducts(products, sortBy, sortOrder),
    [products, sortBy, sortOrder],
  )

  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr className="border-b border-[#EDEDED]">
          <th className="w-12 align-middle py-4 pl-5 pr-4 text-left">
            <div className="flex shrink-0 items-center">
              <input
                type="checkbox"
                className="checkbox-products h-4 w-4 shrink-0 rounded border border-[#D1D5DB]"
                aria-label="Выбрать все"
              />
            </div>
          </th>
          <th className="w-[min(280px,30%)] align-middle py-4 pr-4 text-left">
            <SortHeader
              label="Наименование"
              sortKey="title"
              isActive={sortBy === 'title'}
              order={sortOrder}
              onSort={onSort}
            />
          </th>
          <th className="align-middle py-4 pr-4 text-left">
            <SortHeader
              label="Вендор"
              sortKey="brand"
              isActive={sortBy === 'brand'}
              order={sortOrder}
              onSort={onSort}
            />
          </th>
          <th className="align-middle py-4 pr-4 text-left">
            <SortHeader
              label="Артикул"
              sortKey="sku"
              isActive={sortBy === 'sku'}
              order={sortOrder}
              onSort={onSort}
            />
          </th>
          <th className="align-middle py-4 pr-4 text-left">
            <SortHeader
              label="Оценка"
              sortKey="rating"
              isActive={sortBy === 'rating'}
              order={sortOrder}
              onSort={onSort}
            />
          </th>
          <th className="align-middle py-4 pr-4 text-left">
            <SortHeader
              label="Цена, ₽"
              sortKey="price"
              isActive={sortBy === 'price'}
              order={sortOrder}
              onSort={onSort}
            />
          </th>
          <th className="w-24 align-middle py-4 pr-5" />
        </tr>
      </thead>
      <tbody>
        {sorted.map((product) => (
          <ProductTableRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  )
})

const SortHeader = memo(function SortHeader({
  label,
  sortKey,
  isActive,
  order,
  onSort,
}: {
  label: string
  sortKey: SortKey
  isActive: boolean
  order: SortOrder
  onSort: (key: SortKey) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-sm font-semibold text-[#9CA3AF] hover:text-[#374151]"
    >
      {label}
      {isActive && (
        <span className="text-[#242EDB]" aria-hidden>
          {order === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )
})
