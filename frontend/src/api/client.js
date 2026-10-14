import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3002' : 'https://api.apexturbine.valtherainvestments.com')}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem('apex_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function apiError(error) {
  return new Error(error.response?.data?.error || error.message || 'Something went wrong.', { cause: error })
}

export default apiClient
