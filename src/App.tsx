import { useEffect } from 'react'
import { Toast } from './components/ui/Toast'
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
      <div className="flex min-h-screen items-center justify-center bg-[#F6F6F6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#242EDB] border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? <ProductsPage /> : <LoginPage />}
      <Toast />
    </>
  )
}
