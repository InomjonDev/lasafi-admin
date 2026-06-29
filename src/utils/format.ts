export const money = new Intl.NumberFormat('uz-UZ')

export function formatPriceInput(value: string): string {
  if (!value) return ''
  const num = Number(value)
  if (isNaN(num)) return value
  return money.format(num)
}

export function timeAgo(dateStr?: string): string {
  if (!dateStr) return '-'
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Hozir'
  if (mins < 60) return `${mins} min oldin`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} soat oldin`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} kun oldin`
  return new Date(dateStr).toLocaleDateString()
}
