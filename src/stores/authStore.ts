import { create } from 'zustand'
import type { AuthUser } from '../api/auth'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'
const AUTH_REMEMBER_KEY = 'auth_remember'

function getStorage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  rememberMe: boolean
  isHydrated: boolean
  setAuth: (token: string, user: AuthUser, rememberMe: boolean) => void
  logout: () => void
  hydrate: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  rememberMe: false,
  isHydrated: false,

  setAuth: (token, user, rememberMe) => {
    const storage = getStorage(rememberMe)
    storage.setItem(AUTH_TOKEN_KEY, token)
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    storage.setItem(AUTH_REMEMBER_KEY, String(rememberMe))
    if (!rememberMe) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(AUTH_REMEMBER_KEY)
    }
    set({ token, user, rememberMe })
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_REMEMBER_KEY)
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)
    sessionStorage.removeItem(AUTH_REMEMBER_KEY)
    set({ token: null, user: null, rememberMe: false })
  },

  hydrate: () => {
    const fromLocal = localStorage.getItem(AUTH_TOKEN_KEY)
    const fromSession = sessionStorage.getItem(AUTH_TOKEN_KEY)
    const token = fromLocal ?? fromSession
    const userStr = localStorage.getItem(AUTH_USER_KEY) ?? sessionStorage.getItem(AUTH_USER_KEY)
    const rememberStr =
      localStorage.getItem(AUTH_REMEMBER_KEY) ?? sessionStorage.getItem(AUTH_REMEMBER_KEY)
    const user = userStr ? (JSON.parse(userStr) as AuthUser) : null
    set({
      token,
      user,
      rememberMe: rememberStr === 'true',
      isHydrated: true,
    })
  },

  isAuthenticated: () => Boolean(get().token),
}))

export function getAuthToken(): string | null {
  return useAuthStore.getState().token
}
