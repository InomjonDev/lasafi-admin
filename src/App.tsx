import { StrictMode, useEffect, useMemo, useState, useCallback } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { useOrders } from './hooks/useOrders'
import { useAnalytics } from './hooks/useAnalytics'
import { useDebounce } from './hooks/useDebounce'
import { AuthError } from './api/client'
import { money } from './utils/format'
import { blankForm } from './utils/constants'
import { exportOrdersToCsv } from './utils/csv'
import type { Product, Order, ProductForm, Tab, ToastMsg, ConfirmDelete } from './types'
import Login from './Login'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Header } from './components/Header'
import { StatCard } from './components/StatCard'
import { TabBar } from './components/TabBar'
import { SearchBar } from './components/SearchBar'
import { Toast } from './components/Toast'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ProductsPage } from './pages/ProductsPage'
import { OrdersPage } from './pages/OrdersPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import './App.css'

const PAGE_SIZE = 20
const DRAFT_KEY = 'lasafi-product-draft'

function App() {
  const { session, authLoading, logout } = useAuth()

  const [toast, setToast] = useState<ToastMsg | null>(null)
  const showToast = useCallback((msg: string, type: 'success' | 'error') => setToast({ msg, type }), [])

  const productsCtrl = useProducts()
  const ordersCtrl = useOrders({
    onNewOrder: useCallback((order: Order) => {
      showToast(`Yangi buyurtma: ${order.product_title}`, 'success')
    }, [showToast]),
  })
  const analyticsCtrl = useAnalytics()

  const [form, setForm] = useState<ProductForm>(blankForm)
  const [files, setFiles] = useState<File[]>([])
  const [tab, setTab] = useState<Tab>('products')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete | null>(null)
  const [productPage, setProductPage] = useState(1)
  const [orderPage, setOrderPage] = useState(1)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [orderDateFrom, setOrderDateFrom] = useState('')
  const [orderDateTo, setOrderDateTo] = useState('')

  const loadAll = useCallback(async () => {
    try {
      await Promise.all([productsCtrl.load(), ordersCtrl.load(), analyticsCtrl.load()])
    } catch (err) {
      if (err instanceof AuthError) return
    }
  }, [])

  useEffect(() => {
    if (session) loadAll()
  }, [session, loadAll])

  const stats = useMemo(() => ({
    products: productsCtrl.products.length,
    orders: ordersCtrl.orders.length,
    newOrders: ordersCtrl.orders.filter(o => o.status === 'new').length,
    revenue: ordersCtrl.orders.reduce((sum, o) => sum + (o.price || 0), 0),
  }), [productsCtrl.products, ordersCtrl.orders])

  useEffect(() => {
    document.title = stats.newOrders > 0 ? `(${stats.newOrders}) LaSafi Admin` : 'LaSafi Admin'
  }, [stats.newOrders])

  useEffect(() => {
    if (!showForm) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, files: files.map(f => f.name) }))
    } catch { /* ignore quota */ }
  }, [form, files, showForm])

  const filteredProducts = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return productsCtrl.products
    return productsCtrl.products.filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }, [productsCtrl.products, debouncedQuery])

  const filteredOrders = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    let result = ordersCtrl.orders
    if (q) {
      result = result.filter(o =>
        o.product_title?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q) ||
        o.status?.toLowerCase().includes(q)
      )
    }
    if (orderDateFrom) {
      result = result.filter(o => o.created_at && o.created_at >= orderDateFrom)
    }
    if (orderDateTo) {
      result = result.filter(o => o.created_at && o.created_at.slice(0, 10) <= orderDateTo)
    }
    return result
  }, [ordersCtrl.orders, debouncedQuery, orderDateFrom, orderDateTo])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const result = await productsCtrl.save(form, files)
      setForm(blankForm)
      setFiles([])
      setShowForm(false)
      localStorage.removeItem(DRAFT_KEY)
      showToast(result.type === 'updated' ? 'Mahsulot yangilandi' : 'Mahsulot yaratildi', 'success')
    } catch (err) {
      if (err instanceof AuthError) return
      showToast(err instanceof Error ? err.message : "Saqlab bo'lmadi", 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p: Product) => {
    setForm({ id: p.id, title: p.title, description: p.description, price: String(p.price), images: p.images })
    setFiles([])
    setShowForm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return
    try {
      if (confirmDelete.type === 'product') {
        await productsCtrl.remove(confirmDelete.item.id)
        showToast("Mahsulot o'chirildi", 'success')
      } else {
        await ordersCtrl.remove(confirmDelete.item.id)
        showToast("Buyurtma o'chirildi", 'success')
      }
    } catch (err) {
      if (err instanceof AuthError) return
      showToast(err instanceof Error ? err.message : "O'chirib bo'lmadi", 'error')
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleStatusChange = async (order: Order, status: string) => {
    try {
      await ordersCtrl.changeStatus(order, status)
    } catch (err) {
      if (err instanceof AuthError) return
      showToast(err instanceof Error ? err.message : "Holatni yangilab bo'lmadi", 'error')
    }
  }

  const toggleForm = () => {
    if (showForm) {
      setForm(blankForm)
      setFiles([])
      localStorage.removeItem(DRAFT_KEY)
    } else {
      try {
        const raw = localStorage.getItem(DRAFT_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          if (saved.form) setForm(saved.form)
        }
      } catch { /* ignore */ }
    }
    setShowForm(!showForm)
  }

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setQuery('')
    setProductPage(1)
    setOrderPage(1)
    if (t === 'analytics') {
      analyticsCtrl.load(dateFrom || undefined, dateTo || undefined)
    }
  }

  const handleSearch = (q: string) => {
    setQuery(q)
    setProductPage(1)
    setOrderPage(1)
  }

  const handleRefresh = () => loadAll()
  const handleLogout = () => logout()

  const paginatedProducts = useMemo(() => filteredProducts.slice(0, productPage * PAGE_SIZE), [filteredProducts, productPage])
  const paginatedOrders = useMemo(() => filteredOrders.slice(0, orderPage * PAGE_SIZE), [filteredOrders, orderPage])
  const hasMoreProducts = paginatedProducts.length < filteredProducts.length
  const hasMoreOrders = paginatedOrders.length < filteredOrders.length

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__spinner" />
      </div>
    )
  }

  if (!session) return <Login />

  return (
    <ErrorBoundary>
      <div className="admin">
        <Header onRefresh={handleRefresh} onLogout={handleLogout} />

        <section className="stats">
          <StatCard
            icon="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"
            label="Mahsulotlar"
            value={stats.products}
            glow="var(--color-gold)"
            iconClass="stat-card__icon--gold"
          />
          <StatCard
            icon="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
            label="Buyurtmalar"
            value={stats.orders}
            glow="var(--color-emerald)"
            iconClass="stat-card__icon--emerald"
          />
          <StatCard
            icon="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            label="Yangi"
            value={stats.newOrders}
            glow="var(--color-rose)"
            iconClass="stat-card__icon--rose"
          />
          <StatCard
            icon="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
            label="Daromad"
            value={money.format(stats.revenue)}
            glow="var(--color-amber)"
            iconClass="stat-card__icon--amber"
          />
        </section>

        <TabBar active={tab} onChange={handleTabChange} />

        {tab !== 'analytics' && (
          <SearchBar
            value={query}
            onChange={handleSearch}
            placeholder={tab === 'products' ? 'Mahsulotlarni qidirish...' : 'Buyurtmalarni qidirish...'}
          />
        )}

        {tab === 'orders' && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="date"
              value={orderDateFrom}
              onChange={e => { setOrderDateFrom(e.target.value); setOrderPage(1) }}
              style={{ padding: '0.375rem 0.625rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.875rem' }}
            />
            <span style={{ color: 'var(--color-muted)' }}>—</span>
            <input
              type="date"
              value={orderDateTo}
              onChange={e => { setOrderDateTo(e.target.value); setOrderPage(1) }}
              style={{ padding: '0.375rem 0.625rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.875rem' }}
            />
            {(orderDateFrom || orderDateTo) && (
              <button
                className="btn btn--sm"
                onClick={() => { setOrderDateFrom(''); setOrderDateTo('') }}
              >
                Filterni tozalash
              </button>
            )}
            {ordersCtrl.orders.length > 0 && (
              <button
                className="btn btn--sm"
                onClick={() => exportOrdersToCsv(filteredOrders)}
                style={{ marginLeft: 'auto' }}
              >
                CSV yuklab olish
              </button>
            )}
          </div>
        )}

        {tab === 'products' && (
          <ErrorBoundary key="products">
            <ProductsPage
              productsCtrl={productsCtrl}
              filteredProducts={filteredProducts}
              paginatedProducts={paginatedProducts}
              hasMoreProducts={hasMoreProducts}
              form={form}
              files={files}
              saving={saving}
              showForm={showForm}
              onEdit={handleEdit}
              onDelete={(product) => setConfirmDelete({ type: 'product', item: product })}
              onSave={handleSave}
              onToggleForm={toggleForm}
              onFormChange={setForm}
              onFilesChange={setFiles}
              onLoadMore={() => setProductPage(p => p + 1)}
              query={query}
            />
          </ErrorBoundary>
        )}

        {tab === 'orders' && (
          <ErrorBoundary key="orders">
            <OrdersPage
              ordersCtrl={ordersCtrl}
              filteredOrders={filteredOrders}
              paginatedOrders={paginatedOrders}
              hasMoreOrders={hasMoreOrders}
              onStatusChange={handleStatusChange}
              onDelete={(order) => setConfirmDelete({ type: 'order', item: order })}
              onLoadMore={() => setOrderPage(p => p + 1)}
            />
          </ErrorBoundary>
        )}

        {tab === 'analytics' && (
          <ErrorBoundary key="analytics">
            <AnalyticsPage
              analyticsCtrl={analyticsCtrl}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onToday={() => {
                const d = new Date().toISOString().slice(0, 10)
                setDateFrom(d)
                setDateTo(d)
                analyticsCtrl.load(d, d)
              }}
              onThisWeek={() => {
                const to = new Date().toISOString().slice(0, 10)
                const from = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
                setDateFrom(from)
                setDateTo(to)
                analyticsCtrl.load(from, to)
              }}
              onThisMonth={() => {
                const to = new Date().toISOString().slice(0, 10)
                const from = new Date().toISOString().slice(0, 7) + '-01'
                setDateFrom(from)
                setDateTo(to)
                analyticsCtrl.load(from, to)
              }}
              onDateRange={() => {
                analyticsCtrl.load(dateFrom || undefined, dateTo || undefined)
              }}
            />
          </ErrorBoundary>
        )}

        {confirmDelete && (
          <ConfirmDialog
            type={confirmDelete.type}
            item={confirmDelete.item}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setConfirmDelete(null)}
          />
        )}

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </ErrorBoundary>
  )
}

export default function WrappedApp() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}
