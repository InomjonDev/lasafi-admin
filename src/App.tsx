import { StrictMode, useEffect, useMemo, useState, useCallback } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { useOrders } from './hooks/useOrders'
import { AuthError } from './api/client'
import { money } from './utils/format'
import { blankForm } from './utils/constants'
import { EmptyTagIcon, EmptyCartIcon } from './utils/icons'
import type { Product, Order, ProductForm, Tab, ToastMsg, ConfirmDelete } from './types'
import Login from './Login'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Header } from './components/Header'
import { StatCard } from './components/StatCard'
import { TabBar } from './components/TabBar'
import { SearchBar } from './components/SearchBar'
import { SkeletonList } from './components/SkeletonList'
import { ProductCard } from './components/ProductCard'
import { OrderCard } from './components/OrderCard'
import { ProductFormModal } from './components/ProductFormModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Toast } from './components/Toast'
import { PlusIcon } from './utils/icons'
import './App.css'

const PAGE_SIZE = 20
const DRAFT_KEY = 'lasafi-product-draft'

function App() {
  const { session, authLoading, logout } = useAuth()

  const productsCtrl = useProducts()
  const ordersCtrl = useOrders()

  const [form, setForm] = useState<ProductForm>(blankForm)
  const [files, setFiles] = useState<File[]>([])
  const [tab, setTab] = useState<Tab>('products')
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastMsg | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete | null>(null)
  const [productPage, setProductPage] = useState(1)
  const [orderPage, setOrderPage] = useState(1)

  const showToast = useCallback((msg: string, type: 'success' | 'error') => setToast({ msg, type }), [])

  const loadAll = useCallback(async () => {
    try {
      await Promise.all([productsCtrl.load(), ordersCtrl.load()])
    } catch (err) {
      if (err instanceof AuthError) return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (session) loadAll()
  }, [session, loadAll])

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return productsCtrl.products
    return productsCtrl.products.filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }, [productsCtrl.products, query])

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ordersCtrl.orders
    return ordersCtrl.orders.filter(o =>
      o.product_title?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    )
  }, [ordersCtrl.orders, query])

  const stats = useMemo(() => ({
    products: productsCtrl.products.length,
    orders: ordersCtrl.orders.length,
    newOrders: ordersCtrl.orders.filter(o => o.status === 'new').length,
    revenue: ordersCtrl.orders.reduce((sum, o) => sum + (o.price || 0), 0),
  }), [productsCtrl.products, ordersCtrl.orders])

  /* ---- Auto-save draft ---- */
  useEffect(() => {
    if (!showForm) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, files: files.map(f => f.name) }))
    } catch { /* ignore quota */ }
  }, [form, files, showForm])

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

  const isLoading = tab === 'products' ? productsCtrl.loading : ordersCtrl.loading

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

        <SearchBar
          value={query}
          onChange={handleSearch}
          placeholder={tab === 'products' ? 'Mahsulotlarni qidirish...' : 'Buyurtmalarni qidirish...'}
        />

        {isLoading ? (
          <SkeletonList />
        ) : tab === 'products' ? (
          <>
            {productsCtrl.error && <div className="notice notice--error">{productsCtrl.error}</div>}
            <button className="btn btn--add-desktop" onClick={toggleForm}>
              <PlusIcon /> Mahsulot qo'shish
            </button>
            <div className="card-list">
              {paginatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onEdit={handleEdit}
                  onDelete={(product) => setConfirmDelete({ type: 'product', item: product })}
                />
              ))}
              {filteredProducts.length === 0 && (
                <div className="empty">
                  <EmptyTagIcon />
                  <span>Mahsulot topilmadi</span>
                </div>
              )}
            </div>
            {hasMoreProducts && (
              <button className="btn btn--load-more" onClick={() => setProductPage(p => p + 1)}>
                Yana yuklash ({filteredProducts.length - paginatedProducts.length} ta)
              </button>
            )}

            <button className="fab" onClick={toggleForm} aria-label="Mahsulot qo'shish">
              <PlusIcon size={24} />
            </button>

            {showForm && (
              <ProductFormModal
                form={form}
                files={files}
                saving={saving}
                onFormChange={setForm}
                onFilesChange={setFiles}
                onSave={handleSave}
                onClose={toggleForm}
              />
            )}
          </>
        ) : (
          <>
            {ordersCtrl.error && <div className="notice notice--error">{ordersCtrl.error}</div>}
            <div className="card-list">
              {paginatedOrders.map(o => (
                <OrderCard
                  key={o.id}
                  order={o}
                  updatingStatus={ordersCtrl.updatingStatus}
                  onStatusChange={handleStatusChange}
                  onDelete={(order) => setConfirmDelete({ type: 'order', item: order })}
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
              <button className="btn btn--load-more" onClick={() => setOrderPage(p => p + 1)}>
                Yana yuklash ({filteredOrders.length - paginatedOrders.length} ta)
              </button>
            )}
          </>
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
