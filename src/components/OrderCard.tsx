import type { Order } from '../types'
import { money, timeAgo } from '../utils/format'
import { orderStatuses, statusLabels, statusColors } from '../utils/constants'
import { DeleteIcon } from '../utils/icons'
import { Select } from './Select'

type Props = {
  order: Order
  updatingStatus: string | null
  onStatusChange: (order: Order, status: string) => void
  onDelete: (order: Order) => void
}

export function OrderCard({ order, updatingStatus, onStatusChange, onDelete }: Props) {
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
        <Select
          options={orderStatuses.map(s => ({
            value: s,
            label: statusLabels[s],
            bg: statusColors[s]?.bg || '#f5f5f4',
            color: statusColors[s]?.text || '#44403c',
          }))}
          value={order.status}
          disabled={updatingStatus === order.id}
          style={{ opacity: updatingStatus === order.id ? 0.6 : 1 }}
          onChange={v => onStatusChange(order, v)}
        />
      </div>
      <div className="card__actions">
        <button className="btn btn--sm btn--danger" onClick={() => onDelete(order)}>
          <DeleteIcon /> O'chirish
        </button>
      </div>
    </article>
  )
}
