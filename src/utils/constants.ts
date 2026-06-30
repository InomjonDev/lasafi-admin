import type { ProductForm } from '../types'

export const orderStatuses = ['new', 'contacted', 'confirmed', 'delivered', 'cancelled'] as const

export const statusLabels: Record<string, string> = {
  new: 'Yangi',
  contacted: 'Aloqaga chiqilgan',
  confirmed: 'Tasdiqlangan',
  delivered: 'Yetkazilgan',
  cancelled: 'Bekor qilingan',
}

export const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: '#fef9ee', text: '#d48a30' },
  contacted: { bg: '#faf5ea', text: '#c69c4c' },
  confirmed: { bg: '#e8f4f1', text: '#0d7667' },
  delivered: { bg: '#e8f4f1', text: '#065a4f' },
  cancelled: { bg: '#fcf0f2', text: '#c46a7a' },
}

export const blankForm: ProductForm = { title: '', description: '', price: '', images: [], quantity: '1' }
