export interface ProductFormValues {
  title: string
  price: string
  brand: string
  sku: string
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>

export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const next: ProductFormErrors = {}
  if (!values.title.trim()) next.title = 'Обязательное поле'
  if (!values.price.trim()) next.price = 'Обязательное поле'
  else if (Number.isNaN(Number(values.price)) || Number(values.price) < 0)
    next.price = 'Введите корректную цену'
  if (!values.brand.trim()) next.brand = 'Обязательное поле'
  if (!values.sku.trim()) next.sku = 'Обязательное поле'
  return next
}

export function hasValidationErrors(errors: ProductFormErrors): boolean {
  return Object.keys(errors).length > 0
}
