import apiClient, { apiError } from './client.js'

export async function getSite() {
  try { const { data } = await apiClient.get('/site'); return data } catch (error) { throw apiError(error) }
}
