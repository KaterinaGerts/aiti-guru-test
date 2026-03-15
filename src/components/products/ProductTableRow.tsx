import { memo, useCallback, useRef, useState } from 'react'
import type { Product } from '../../api/products'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { formatPrice } from '../../utils/format'
import dotsThreeCircleIcon from '../../assets/svg/DotsThreeCircle.svg'
import plusIcon from '../../assets/svg/plus.svg'

interface ProductTableRowProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export const ProductTableRow = memo(function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const isLowRating = product.rating < 3
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(menuRef, () => setMenuOpen(false))

  const handleEdit = useCallback(() => {
    setMenuOpen(false)
    onEdit(product)
  }, [product, onEdit])

  const handleDelete = useCallback(() => {
    setMenuOpen(false)
    onDelete(product)
  }, [product, onDelete])

  return (
    <tr
      className={`border-b border-[#EDEDED] transition-colors ${isLowRating ? 'bg-[#FEF2F2]' : ''}`}
    >
      <td className="py-4 pl-5 pr-4">
        <input
          type="checkbox"
          className="checkbox-products h-4 w-4 shrink-0 rounded border border-[#D1D5DB]"
          aria-label={`Выбрать ${product.title}`}
        />
      </td>
      <td className="flex items-center gap-[18px] py-4 pr-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-[#C4C4C4]">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-semibold text-black">{product.title}</span>
          {product.category && <span className="text-sm text-[#9CA3AF]">{product.category}</span>}
        </div>
      </td>
      <td className="py-4 pr-4 text-sm text-black">{product.brand}</td>
      <td className="py-4 pr-4 text-sm text-black">{product.sku ?? '—'}</td>
      <td className="py-4 pr-4">
        <span className={isLowRating ? 'text-sm font-medium text-red-600' : 'text-sm text-black'}>
          {product.rating.toFixed(1)}/5
        </span>
      </td>
      <td className="py-4 pr-4 text-sm font-medium text-black">{formatPrice(product.price)}</td>
      <td className="py-4 pr-5">
        <div className="flex items-center gap-1">
          <button type="button" className="shrink-0 p-0.5 hover:opacity-90" aria-label="Добавить">
            <img src={plusIcon} alt="" className="h-6 w-auto" aria-hidden />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-500 hover:text-gray-700"
              aria-label="Действия"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <img src={dotsThreeCircleIcon} alt="" className="h-5 w-5" aria-hidden />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
})
