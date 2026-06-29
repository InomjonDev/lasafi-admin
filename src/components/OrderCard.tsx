import type { Order } from '../types'
import { money, timeAgo } from '../utils/format'
import { orderStatuses, statusLabels, statusColors } from '../utils/constants'
import { DeleteIcon } from '../utils/icons'

type Props = {
  order: Order
  updatingStatus: string | null
  onStatusChange: (order: Order, status: string) => void
  onDelete: (order: Order) => void
}

export function OrderCard({ order, updatingStatus, onStatusChange, onDelete }: Props) {
  const sc = statusColors[order.status] || { bg: '#f5f5f4', text: '#44403c' }

  return (
    <article className="card card--order">
      <div className="card__order-header">
        <h3 className="card__order-title">{order.product_title}</h3>
        <span className="card__order-date">{timeAgo(order.created_at)}</span>
      </div>
      <div className="card__row">
        <span className="card__label">Mijoz</span>
        <span>
          <strong>{order.customer_name}</strong>
          <span className="card__sub">{order.phone}</span>
          <span className="card__sub">{order.address}</span>
        </span>
      </div>
      <div className="card__row">
        <span className="card__label">Jami</span>
        <strong>{money.format(order.price || 0)} so'm</strong>
      </div>
      <div className="card__row">
        <span className="card__label">Holat</span>
        <select
          className="status-badge"
          style={{ background: sc.bg, color: sc.text, opacity: updatingStatus === order.id ? 0.6 : 1 }}
          value={order.status}
          disabled={updatingStatus === order.id}
          onChange={e => onStatusChange(order, e.target.value)}
        >
          {orderStatuses.map(s => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </div>
      <div className="card__actions">
        <button className="btn btn--sm btn--danger" onClick={() => onDelete(order)}>
          <DeleteIcon /> O'chirish
        </button>
      </div>
    </article>
  )
}
