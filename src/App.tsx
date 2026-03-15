import { useEffect } from 'react'
import { Spinner, Toast } from './components/ui'
import { LoginPage } from './pages/LoginPage'
import { ProductsPage } from './pages/ProductsPage'
import { useAuthStore } from './stores/authStore'

export default function App() {
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const isAuthenticated = useAuthStore((s) => Boolean(s.token))
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!isHydrated) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#F6F6F6]"
        aria-busy="true"
        aria-label="Загрузка приложения"
      >
        <Spinner
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#242EDB] border-t-transparent"
          aria-label="Загрузка"
        />
      </main>
    )
  }

  return (
    <>
      {isAuthenticated ? <ProductsPage /> : <LoginPage />}
      <Toast />
    </>
  )
}
