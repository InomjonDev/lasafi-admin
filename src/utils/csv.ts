import type { Order } from '../types'

export function exportOrdersToCsv(orders: Order[]) {
  const header = ['ID', 'Mahsulot', 'Narxi', 'Mijoz', 'Telefon', 'Manzil', 'Soni', 'Holat', 'Sana']
  const rows = orders.map(o => [
    o.id,
    o.product_title || '',
    String(o.price || 0),
    o.customer_name || '',
    o.phone || '',
    o.address || '',
    String(o.quantity || 1),
    o.status || '',
    o.created_at || '',
  ])

  const csv = [header, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `buyurtmalar-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
