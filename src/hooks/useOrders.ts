import { useState } from 'react'
import type { Order } from '../types'
import * as ordersApi from '../api/orders'
import { AuthError } from '../api/client'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await ordersApi.fetchOrders()
      setOrders(data ?? [])
    } catch (err) {
      if (err instanceof AuthError) throw err
      setOrders([])
      setError(err instanceof Error ? err.message : 'Buyurtmalar mavjud emas')
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (order: Order, status: string) => {
    const prevStatus = order.status
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o))
    setUpdatingStatus(order.id)
    try {
      const updated = await ordersApi.updateOrderStatus(order.id, status)
      const next = updated[0] || { ...order, status }
      setOrders(prev => prev.map(o => o.id === order.id ? next : o))
    } catch (err) {
      if (err instanceof AuthError) throw err
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: prevStatus } : o))
      throw err
    } finally {
      setUpdatingStatus(null)
    }
  }

  const remove = async (id: string) => {
    await ordersApi.deleteOrder(id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  return { orders, loading, error, updatingStatus, load, changeStatus, remove }
}
