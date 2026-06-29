import type { Product, Order } from '../types'

type Props = {
  type: 'product' | 'order'
  item: Product | Order
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ type, item, onConfirm, onCancel }: Props) {
  const title = type === 'product' ? 'Mahsulotni o\'chirish?' : 'Buyurtmani o\'chirish?'
  const message = type === 'product'
    ? `"${(item as Product).title}" butunlay o'chiriladi.`
    : `"${(item as Order).product_title}" buyurtmasi butunlay o'chiriladi.`

  return (
    <div className="overlay overlay--confirm" onClick={onCancel}>
      <div className="modal confirm" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm__actions">
          <button className="btn btn--ghost" onClick={onCancel}>Bekor qilish</button>
          <button className="btn btn--danger" onClick={onConfirm}>O'chirish</button>
        </div>
      </div>
    </div>
  )
}
