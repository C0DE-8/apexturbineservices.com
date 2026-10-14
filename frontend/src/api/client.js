import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.DEV ? (import.meta.env.VITE_API_URL || '') : ''}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export function apiError(error) {
  return new Error(error.response?.data?.error || error.message || 'Something went wrong.', { cause: error })
}

export default apiClient
