import type { Order } from '../types'
import { money, timeAgo } from '../utils/format'
import { orderStatuses, statusLabels, statusColors } from '../utils/constants'
import { DeleteIcon } from '../utils/icons'
import { Select } from './Select'
import styles from './OrderCard.module.css'

type Props = {
  order: Order
  updatingStatus: string | null
  onStatusChange: (order: Order, status: string) => void
  onDelete: (order: Order) => void
}

export function OrderCard({ order, updatingStatus, onStatusChange, onDelete }: Props) {
  return (
    <article className={`${styles.card} ${styles.cardOrder}`}>
      <div className={styles.cardOrderHeader}>
        <h3 className={styles.cardOrderTitle}>{order.product_title}</h3>
        <span className={styles.cardOrderDate}>{timeAgo(order.created_at)}</span>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>Mijoz</span>
        <span>
          <strong>{order.customer_name}</strong>
          <span className={styles.cardSub}>{order.phone}</span>
          <span className={styles.cardSub}>{order.address}</span>
        </span>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>Soni</span>
        <strong>{order.quantity ?? 1} dona</strong>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>Jami</span>
        <strong>{money.format(order.total_price || (order.price || 0) * (order.quantity || 1))} so'm</strong>
      </div>
      <div className={styles.cardRow}>
        <span className={styles.cardLabel}>Holat</span>
        <Select
          options={orderStatuses.map(s => ({
            value: s,
            label: statusLabels[s],
            bg: statusColors[s]?.bg || '#f5f5f4',
            color: statusColors[s]?.text || '#44403c',
          }))}
          value={order.status}
          disabled={updatingStatus === order.id}
          className={updatingStatus === order.id ? styles.cardDisabled : undefined}
          onChange={v => onStatusChange(order, v)}
        />
      </div>
      <div className={styles.cardActions}>
        <button className="btn btn--sm btn--danger" onClick={() => onDelete(order)}>
          <DeleteIcon /> O'chirish
        </button>
      </div>
    </article>
  )
}
