import { useState, useEffect, useRef, useCallback } from 'react'
import type { Order } from '../types'
import * as ordersApi from '../api/orders'
import { AuthError } from '../api/client'
import { supabase } from '../supabase'

type Options = {
  onNewOrder?: (order: Order) => void
}

function notifyOrder(order: Order) {
  if (!('Notification' in window)) return
  if (Notification.permission === 'granted') {
    new Notification('Yangi buyurtma!', {
      body: `${order.product_title} — ${order.customer_name}`,
      icon: order.product_image || undefined,
      tag: order.id,
    })
  }
}

function requestNotifyPermission() {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

export function useOrders(options?: Options) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const onNewOrderRef = useRef(options?.onNewOrder)
  onNewOrderRef.current = options?.onNewOrder

  const load = useCallback(async () => {
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
  }, [])

  useEffect(() => { requestNotifyPermission() }, [])

  useEffect(() => {
    const channel = supabase
      .channel('orders-live')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as Order
          setOrders(prev => [newOrder, ...prev])
          notifyOrder(newOrder)
          onNewOrderRef.current?.(newOrder)
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

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
