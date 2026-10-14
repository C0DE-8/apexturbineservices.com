import apiClient, { apiError } from './client.js'

async function call(config) {
  try { const { data } = await apiClient.request(config); return data } catch (error) { throw apiError(error) }
}

export const getAdminSession = () => call({ url: '/admin/session' })
export async function loginAdmin(credentials) {
  const result = await call({ url: '/admin/login', method: 'POST', data: credentials })
  if (result.token) window.sessionStorage.setItem('apex_admin_token', result.token)
  return result
}
export async function logoutAdmin() {
  try { return await call({ url: '/admin/logout', method: 'POST' }) }
  finally { window.sessionStorage.removeItem('apex_admin_token') }
}
export const saveSite = (site) => call({ url: '/admin/site', method: 'PUT', data: site })
export const saveAdminProfile = (profile) => call({ url: '/admin/profile', method: 'PUT', data: profile })
export async function uploadImage(file) {
  const form = new FormData()
  form.append('image', file)
  try { const { data } = await apiClient.post('/admin/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }); return data.url } catch (error) { throw apiError(error) }
}
