import { memo } from 'react'
import type { Product } from '../../api/products'
import dotsThreeCircleIcon from '../../assets/svg/DotsThreeCircle.svg'
import plusIcon from '../../assets/svg/plus.svg'

interface ProductTableRowProps {
  product: Product
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export const ProductTableRow = memo(function ProductTableRow({ product }: ProductTableRowProps) {
  const isLowRating = product.rating < 3

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
          <span className="truncate text-sm font-semibold text-[#000]">{product.title}</span>
          {product.category && <span className="text-sm text-[#9CA3AF]">{product.category}</span>}
        </div>
      </td>
      <td className="py-4 pr-4 text-sm text-[#000]">{product.brand}</td>
      <td className="py-4 pr-4 text-sm text-[#000]">{product.sku ?? '—'}</td>
      <td className="py-4 pr-4">
        <span className={isLowRating ? 'text-sm font-medium text-red-600' : 'text-sm text-[#000]'}>
          {product.rating.toFixed(1)}/5
        </span>
      </td>
      <td className="py-4 pr-4 text-sm font-medium text-[#000]">{formatPrice(product.price)}</td>
      <td className="py-4 pr-5">
        <div className="flex items-center gap-1">
          <button type="button" className="shrink-0 p-0.5 hover:opacity-90" aria-label="Добавить">
            <img src={plusIcon} alt="" className="h-6 w-auto" aria-hidden />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-500 hover:text-gray-700"
            aria-label="Действия"
          >
            <img src={dotsThreeCircleIcon} alt="" className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </td>
    </tr>
  )
})
