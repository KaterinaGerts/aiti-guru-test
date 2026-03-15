import { request } from './request'

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

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
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
  return request<LoginResponse>(
    {
      url: '/auth/login',
      method: 'POST',
      data: payload,
    },
    'Ошибка при авторизации',
  )
}

export async function fetchMe(accessToken: string): Promise<MeResponse> {
  return request<MeResponse>(
    {
      url: '/auth/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    'Ошибка при получении профиля пользователя',
  )
}

export async function refreshToken(payload: RefreshPayload): Promise<RefreshResponse> {
  return request<RefreshResponse>(
    {
      url: '/auth/refresh',
      method: 'POST',
      data: payload,
    },
    'Ошибка при обновлении токена',
  )
}
