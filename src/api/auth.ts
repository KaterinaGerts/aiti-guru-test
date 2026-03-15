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

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const raw = await apiRequest<LoginResponseRaw>(
    '/auth/login',
    {
      method: 'POST',
      body: {
        username: payload.username,
        password: payload.password,
        ...(payload.expiresInMins != null && { expiresInMins: payload.expiresInMins }),
      },
    },
    'Ошибка при авторизации',
  )

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
