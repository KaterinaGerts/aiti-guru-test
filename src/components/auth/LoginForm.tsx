import { useCallback, useState } from 'react'
import { login } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import userIcon from '../../assets/svg/user.svg'
import xIcon from '../../assets/svg/x.svg'
import lockIcon from '../../assets/svg/lock.svg'
import eyeOffIcon from '../../assets/svg/eye-off.svg'
import eyeIcon from '../../assets/svg/eye.svg'

const initialValues = { username: '', password: '' }

export function LoginForm() {
  const [values, setValues] = useState(initialValues)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setAuth = useAuthStore((s) => s.setAuth)

  const validate = useCallback((): boolean => {
    const next: { username?: string; password?: string } = {}
    if (!values.username.trim()) next.username = 'Обязательное поле'
    if (!values.password) next.password = 'Обязательное поле'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }, [values.username, values.password])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      setFieldErrors({})
      if (!validate()) return

      setIsSubmitting(true)
      try {
        const res = await login({
          username: values.username.trim(),
          password: values.password,
          expiresInMins: 60,
        })
        setAuth(res.accessToken, res.user, rememberMe)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка входа')
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, rememberMe, validate, setAuth],
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const clearUsername = useCallback(() => {
    setValues((prev) => ({ ...prev, username: '' }))
    setFieldErrors((prev) => ({ ...prev, username: undefined }))
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-lg font-medium text-[#232323]">
            Логин
          </label>
          <div className="flex h-12 items-center gap-3 rounded-xl border border-[#EDEDED] bg-white px-4 py-3.5">
            <img
              src={userIcon}
              alt=""
              className="h-6 w-6 shrink-0"
              width={24}
              height={24}
              aria-hidden
            />
            <input
              id="username"
              name="username"
              type="text"
              value={values.username}
              onChange={handleChange}
              autoComplete="username"
              disabled={isSubmitting}
              className="min-w-0 flex-1 bg-transparent text-lg text-[#232323] outline-none placeholder:text-gray-400 disabled:opacity-60"
              placeholder="Введите логин"
            />
            {values.username ? (
              <button
                type="button"
                onClick={clearUsername}
                disabled={isSubmitting}
                className="shrink-0 rounded-full p-1 hover:bg-gray-100 disabled:opacity-60"
                aria-label="Очистить поле"
              >
                <img src={xIcon} alt="" className="h-4 w-4" width={17} height={18} aria-hidden />
              </button>
            ) : null}
          </div>
          {fieldErrors.username && (
            <p className="text-sm text-red-600" role="alert">
              {fieldErrors.username}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-lg font-medium text-[#232323]">
            Пароль
          </label>
          <div className="flex h-12 items-center gap-3 rounded-xl border border-[#EDEDED] bg-white px-4 py-3.5">
            <img
              src={lockIcon}
              alt=""
              className="h-6 w-6 shrink-0"
              width={24}
              height={24}
              aria-hidden
            />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={isSubmitting}
              className="min-w-0 flex-1 bg-transparent text-lg text-[#232323] outline-none placeholder:text-gray-400 disabled:opacity-60"
              placeholder="Введите пароль"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              disabled={isSubmitting}
              className="shrink-0 rounded-full p-1 hover:bg-gray-100 disabled:opacity-60"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              <img
                src={showPassword ? eyeIcon : eyeOffIcon}
                alt=""
                className="h-6 w-6"
                width={24}
                height={24}
                aria-hidden
              />
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-sm text-red-600" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isSubmitting}
          className="h-5 w-5 rounded border-gray-300 text-[#242EDB] focus:ring-[#242EDB]"
        />
        <span className="text-base text-[#9C9C9C]">Запомнить данные</span>
      </label>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-xl border border-[#367AFF] bg-[#242EDB] px-4 py-4 text-lg font-semibold text-white shadow transition hover:opacity-95 disabled:opacity-60"
      >
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  )
}
