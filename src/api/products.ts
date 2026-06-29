import type { Product } from '../types'
import { apiRequest } from './client'

export function fetchProducts() {
  return apiRequest<Product[]>('/products')
}

export function createProduct(body: Record<string, unknown>) {
  return apiRequest<Product[]>('/products', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateProduct(id: string, body: Record<string, unknown>) {
  return apiRequest<Product[]>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteProduct(id: string) {
  return apiRequest(`/products/${id}`, { method: 'DELETE' })
}
