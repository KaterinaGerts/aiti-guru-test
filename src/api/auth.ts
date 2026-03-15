import { apiRequest } from './client'

export interface LoginPayload {
  username: string
  password: string
  expiresInMins?: number
}

export interface AuthUser {
  id: number
  username: string
  email?: string
  firstName: string
  lastName: string
}

/** Ответ DummyJSON: плоский объект с полями пользователя и токенами */
export interface LoginResponseRaw {
  id: number
  username: string
  email?: string
  firstName: string
  lastName: string
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export type MeResponse = AuthUser

export interface RefreshPayload {
  refreshToken?: string
  expiresInMins?: number
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  'Invalid credentials': 'Неверный логин или пароль',
  'User not found': 'Пользователь не найден',
  'Invalid credentials.': 'Неверный логин или пароль',
}

function getLoginErrorMessage(status: number, apiMessage: string): string {
  const lower = apiMessage.toLowerCase()
  if (status === 400 || status === 401) {
    if (lower.includes('invalid credentials') || lower.includes('user not found')) {
      return 'Неверный логин или пароль'
    }
    return LOGIN_ERROR_MESSAGES[apiMessage] ?? 'Неверный логин или пароль'
  }
  if (status >= 500) return 'Сервер временно недоступен. Попробуйте позже.'
  if (status === 0 || status === 404) return 'Сервис недоступен. Проверьте подключение к интернету.'
  return 'Ошибка входа. Попробуйте ещё раз.'
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  let raw: LoginResponseRaw
  try {
    raw = await apiRequest<LoginResponseRaw>(
      '/auth/login',
      {
        method: 'POST',
        body: {
          username: payload.username,
          password: payload.password,
          ...(payload.expiresInMins != null && { expiresInMins: payload.expiresInMins }),
        },
      },
      'Invalid credentials',
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const match = message.match(/Ошибка (\d+): (.+)/)
    const status = match ? Number(match[1]) : 0
    const apiMessage = match ? match[2].trim() : message
    throw new Error(getLoginErrorMessage(status, apiMessage))
  }

  if (!raw.accessToken) {
    throw new Error('Ошибка при авторизации: в ответе нет токена')
  }

  return {
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    user: {
      id: raw.id,
      username: raw.username,
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
    },
  }
}

export async function fetchMe(accessToken: string): Promise<MeResponse> {
  return apiRequest<MeResponse>(
    '/auth/me',
    {
      method: 'GET',
      token: accessToken,
    },
    'Ошибка при получении профиля пользователя',
  )
}

export async function refreshToken(payload: RefreshPayload): Promise<RefreshResponse> {
  return apiRequest<RefreshResponse>(
    '/auth/refresh',
    {
      method: 'POST',
      body: payload,
    },
    'Ошибка при обновлении токена',
  )
}
