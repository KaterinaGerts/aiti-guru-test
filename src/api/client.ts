import { getAuthToken } from '../stores/authStore'

const DEFAULT_API_URL = 'https://dummyjson.com'
const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || DEFAULT_API_URL

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const base = BASE_URL.replace(/\/$/, '')
  const pathStr = (path ?? '').replace(/^\//, '')
  const url = new URL(pathStr, `${base}/`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }
  return url.toString()
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: object
  headers?: Record<string, string>
  params?: Record<string, string | number | undefined>
  /** Передать токен явно (иначе берётся из store) */
  token?: string | null
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
  defaultErrorMessage = 'Ошибка запроса',
): Promise<T> {
  const { method = 'GET', body, headers = {}, params, token } = options
  const url = buildUrl(path, params)
  const tokenToUse = token !== undefined ? token : getAuthToken()
  const requestHeaders: Record<string, string> = {
    ...headers,
  }
  if (tokenToUse) {
    requestHeaders['Authorization'] = `Bearer ${tokenToUse}`
  }
  if (body != null && method !== 'GET') {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const message = (data as { message?: string }).message ?? defaultErrorMessage
    throw new Error(`Ошибка ${res.status}: ${message}`)
  }

  return res.json() as Promise<T>
}
