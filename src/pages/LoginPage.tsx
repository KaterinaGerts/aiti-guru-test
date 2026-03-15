import { LoginForm } from '../components/auth/LoginForm'
import logoUrl from '../assets/svg/logo.svg'

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F9F9] p-4" role="main">
      <section
        className="w-full max-w-[480px] rounded-[40px] bg-white p-10 shadow-lg"
        aria-labelledby="login-heading"
      >
        <header className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={logoUrl} alt="" className="h-[52px] w-[52px] shrink-0" width={52} height={52} />
          <h1 id="login-heading" className="text-[40px] font-semibold leading-tight text-[#232323]">
            Добро пожаловать!
          </h1>
          <p className="text-lg text-[#E0E0E0]">Пожалуйста, авторизируйтесь</p>
        </header>
        <LoginForm />
        <p className="mt-6 text-center text-lg text-[#6C6C6C]">
          Нет аккаунта? <span className="text-[#242EDB] underline">Создать</span>
        </p>
      </section>
    </main>
  )
}
