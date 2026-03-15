import { useCallback, useState } from 'react'
import { useToastStore } from '../../stores/toastStore'

export interface AddProductFormValues {
  title: string
  price: string
  brand: string
  sku: string
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (values: AddProductFormValues) => void
}

const initialValues: AddProductFormValues = {
  title: '',
  price: '',
  brand: '',
  sku: '',
}

export function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [values, setValues] = useState<AddProductFormValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof AddProductFormValues, string>>>({})
  const showToast = useToastStore((s) => s.show)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const validate = useCallback((): boolean => {
    const next: Partial<Record<keyof AddProductFormValues, string>> = {}
    if (!values.title.trim()) next.title = 'Обязательное поле'
    if (!values.price.trim()) next.price = 'Обязательное поле'
    else if (Number.isNaN(Number(values.price)) || Number(values.price) < 0)
      next.price = 'Введите корректную цену'
    if (!values.brand.trim()) next.brand = 'Обязательное поле'
    if (!values.sku.trim()) next.sku = 'Обязательное поле'
    setErrors(next)
    return Object.keys(next).length === 0
  }, [values])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return
      onAdd(values)
      setValues(initialValues)
      setErrors({})
      onClose()
      showToast('Товар успешно добавлен')
    },
    [values, validate, onAdd, onClose, showToast],
  )

  const handleClose = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    onClose()
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        <h2 id="add-product-title" className="mb-6 text-xl font-semibold text-gray-900">
          Добавить товар
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="add-title" className="mb-1 block text-sm font-medium text-gray-700">
              Наименование
            </label>
            <input
              id="add-title"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-[#242EDB]"
              placeholder="Введите наименование"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="add-price" className="mb-1 block text-sm font-medium text-gray-700">
              Цена
            </label>
            <input
              id="add-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-[#242EDB]"
              placeholder="0"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="add-brand" className="mb-1 block text-sm font-medium text-gray-700">
              Вендор
            </label>
            <input
              id="add-brand"
              name="brand"
              value={values.brand}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-[#242EDB]"
              placeholder="Введите вендора"
            />
            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
          </div>
          <div>
            <label htmlFor="add-sku" className="mb-1 block text-sm font-medium text-gray-700">
              Артикул
            </label>
            <input
              id="add-sku"
              name="sku"
              value={values.sku}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-[#242EDB]"
              placeholder="Введите артикул"
            />
            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          </div>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#242EDB] py-2.5 font-medium text-white hover:opacity-95"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
