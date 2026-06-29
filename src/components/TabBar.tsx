import type { Tab } from '../types'

type Props = {
  active: Tab
  onChange: (tab: Tab) => void
}

export function TabBar({ active, onChange }: Props) {
  return (
    <div className="tabs" role="tablist">
      <button
        className={`tab ${active === 'products' ? 'tab--active' : ''}`}
        onClick={() => onChange('products')}
        role="tab"
        aria-selected={active === 'products'}
      >
        Mahsulotlar
      </button>
      <button
        className={`tab ${active === 'orders' ? 'tab--active' : ''}`}
        onClick={() => onChange('orders')}
        role="tab"
        aria-selected={active === 'orders'}
      >
        Buyurtmalar
      </button>
    </div>
  )
}
