import type { Order } from '../types'
import { SkeletonList } from '../components/SkeletonList'
import { OrderCard } from '../components/OrderCard'
import { EmptyCartIcon } from '../utils/icons'
import styles from './OrdersPage.module.css'

type Props = {
  ordersCtrl: { loading: boolean; error: string; orders: Order[]; updatingStatus: string | null }
  filteredOrders: Order[]
  paginatedOrders: Order[]
  hasMoreOrders: boolean
  onStatusChange: (order: Order, status: string) => void
  onDelete: (order: Order) => void
  onLoadMore: () => void
}

export function OrdersPage({
  ordersCtrl,
  filteredOrders,
  paginatedOrders,
  hasMoreOrders,
  onStatusChange,
  onDelete,
  onLoadMore,
}: Props) {
  if (ordersCtrl.loading) return <SkeletonList />

  return (
    <div className={styles.wrapper}>
      {ordersCtrl.error && <div className="notice notice--error">{ordersCtrl.error}</div>}
      <div className="card-list">
        {paginatedOrders.map(o => (
          <OrderCard
            key={o.id}
            order={o}
            updatingStatus={ordersCtrl.updatingStatus}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
        {filteredOrders.length === 0 && (
          <div className="empty">
            <EmptyCartIcon />
            <span>Buyurtma topilmadi</span>
          </div>
        )}
      </div>
      {hasMoreOrders && (
        <button className="btn btn--load-more" onClick={onLoadMore}>
          Yana yuklash ({filteredOrders.length - paginatedOrders.length} ta)
        </button>
      )}
    </div>
  )
}
