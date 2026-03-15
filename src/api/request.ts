import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL as string

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

function mapAxiosError(error: unknown, defaultMessage: string): Error {
  const axiosError = error as AxiosError<{ message?: string }>

  if (axiosError.response) {
    const status = axiosError.response.status
    const message = axiosError.response.data?.message || defaultMessage
    return new Error(`Ошибка ${status}: ${message}`)
  }

  if (axiosError.request) {
    return new Error('Нет ответа от сервера. Проверьте соединение с интернетом.')
  }

  return new Error('Не удалось выполнить запрос. Повторите попытку позже.')
}

export async function request<T>(config: AxiosRequestConfig, defaultMessage: string): Promise<T> {
  try {
    const response: AxiosResponse<T> = await api.request<T>(config)
    return response.data
  } catch (error) {
    throw mapAxiosError(error, defaultMessage)
  }
}
