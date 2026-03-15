import { apiRequest } from './client'

export interface Product {
  id: number
  title: string
  description?: string
  price: number
  rating: number
  brand: string
  category?: string
  sku: string
  stock?: number
  thumbnail?: string
  images?: string[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductSearchParams {
  q?: string
  limit?: number
  skip?: number
  select?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

export async function fetchProducts(params?: ProductSearchParams): Promise<ProductsResponse> {
  return apiRequest<ProductsResponse>(
    '/products',
    { method: 'GET', params: params as Record<string, string | number | undefined> },
    'Ошибка при загрузке товаров с сервера',
  )
}

export async function fetchProductById(id: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, { method: 'GET' }, 'Ошибка при загрузке товара')
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  return apiRequest<ProductsResponse>(
    '/products/search',
    { method: 'GET', params: { q: query } },
    'Ошибка при поиске товаров',
  )
}

export interface ProductCategory {
  slug: string
  name: string
  url?: string
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  return apiRequest<ProductCategory[]>(
    '/products/categories',
    { method: 'GET' },
    'Ошибка при загрузке категорий',
  )
}

export async function fetchProductCategoryList(): Promise<string[]> {
  return apiRequest<string[]>(
    '/products/category-list',
    { method: 'GET' },
    'Ошибка при загрузке списка категорий',
  )
}

export async function fetchProductsByCategory(
  category: string,
  params?: Omit<ProductSearchParams, 'q'>,
): Promise<ProductsResponse> {
  return apiRequest<ProductsResponse>(
    `/products/category/${category}`,
    { method: 'GET', params: params as Record<string, string | number | undefined> },
    'Ошибка при загрузке товаров категории',
  )
}

export interface CreateProductPayload {
  title: string
  price?: number
  brand?: string
  sku?: string
  description?: string
  category?: string
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  return apiRequest<Product>(
    '/products/add',
    { method: 'POST', body: payload },
    'Ошибка при добавлении товара',
  )
}

export interface UpdateProductPayload {
  title?: string
  price?: number
  brand?: string
  sku?: string
  description?: string
  category?: string
}

export async function updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
  return apiRequest<Product>(
    `/products/${id}`,
    { method: 'PUT', body: payload },
    'Ошибка при обновлении товара',
  )
}

export async function deleteProduct(id: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, { method: 'DELETE' }, 'Ошибка при удалении товара')
}
