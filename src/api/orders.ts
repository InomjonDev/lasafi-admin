import type { Order } from '../types'
import { apiRequest } from './client'

export function fetchOrders() {
  return apiRequest<Order[]>('/orders')
}

export function updateOrderStatus(id: string, status: string) {
  return apiRequest<Order[]>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function deleteOrder(id: string) {
  return apiRequest(`/orders/${id}`, { method: 'DELETE' })
}
