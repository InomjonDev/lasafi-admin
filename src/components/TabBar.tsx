import type { Tab } from '../types'
import styles from './TabBar.module.css'

type Props = {
  active: Tab
  onChange: (tab: Tab) => void
}

export function TabBar({ active, onChange }: Props) {
  return (
    <div className={styles.tabs} role="tablist">
      <button
        className={`${styles.tab} ${active === 'products' ? styles.tabActive : ''}`}
        onClick={() => onChange('products')}
        role="tab"
        aria-selected={active === 'products'}
      >
        Mahsulotlar
      </button>
      <button
        className={`${styles.tab} ${active === 'orders' ? styles.tabActive : ''}`}
        onClick={() => onChange('orders')}
        role="tab"
        aria-selected={active === 'orders'}
      >
        Buyurtmalar
      </button>
      <button
        className={`${styles.tab} ${active === 'analytics' ? styles.tabActive : ''}`}
        onClick={() => onChange('analytics')}
        role="tab"
        aria-selected={active === 'analytics'}
      >
        Analitika
      </button>
    </div>
  )
}
