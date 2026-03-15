import { useCallback, useState } from 'react'
import type { Product } from '../../api/products'
import { useToastStore } from '../../stores/toastStore'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { Modal } from '../ui/Modal'
import {
  hasValidationErrors,
  validateProductForm,
  type ProductFormValues,
} from '../../utils/validateProductForm'

export type EditProductFormValues = ProductFormValues

interface EditProductModalProps {
  isOpen: boolean
  product: Product | null
  onClose: () => void
  onSave: (product: Product, values: EditProductFormValues) => void
}

function productToValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    price: String(product.price),
    brand: product.brand,
    sku: product.sku ?? '',
  }
}

interface EditProductFormProps {
  product: Product
  onClose: () => void
  onSave: (product: Product, values: EditProductFormValues) => void
}

function EditProductForm({ product, onClose, onSave }: EditProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() => productToValues(product))
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({})
  const showToast = useToastStore((s) => s.show)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const nextErrors = validateProductForm(values)
      setErrors(nextErrors)
      if (hasValidationErrors(nextErrors)) return
      onSave(product, values)
      onClose()
      showToast('Товар успешно изменён')
    },
    [product, values, onSave, onClose, showToast],
  )

  const handleClose = useCallback(() => {
    setErrors({})
    onClose()
  }, [onClose])

  return (
    <Modal titleId="edit-product-title" title="Редактировать товар">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          id="edit-title"
          name="title"
          label="Наименование"
          value={values.title}
          onChange={handleChange}
          placeholder="Введите наименование"
          error={errors.title}
        />
        <FormField
          id="edit-price"
          name="price"
          type="number"
          min={0}
          step={0.01}
          label="Цена"
          value={values.price}
          onChange={handleChange}
          placeholder="0"
          error={errors.price}
        />
        <FormField
          id="edit-brand"
          name="brand"
          label="Вендор"
          value={values.brand}
          onChange={handleChange}
          placeholder="Введите вендора"
          error={errors.brand}
        />
        <FormField
          id="edit-sku"
          name="sku"
          label="Артикул"
          value={values.sku}
          onChange={handleChange}
          placeholder="Введите артикул"
          error={errors.sku}
        />
        <div className="mt-2 flex gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function EditProductModal({ isOpen, product, onClose, onSave }: EditProductModalProps) {
  if (!isOpen || !product) return null
  return <EditProductForm key={product.id} product={product} onClose={onClose} onSave={onSave} />
}
