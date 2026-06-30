import type { FormEvent } from 'react'
import type { Product, ProductForm } from '../types'
import { SkeletonList } from '../components/SkeletonList'
import { ProductCard } from '../components/ProductCard'
import { ProductFormModal } from '../components/ProductFormModal'
import { PlusIcon, EmptyTagIcon } from '../utils/icons'
import styles from './ProductsPage.module.css'

type Props = {
  productsCtrl: { loading: boolean; error: string; products: Product[] }
  filteredProducts: Product[]
  paginatedProducts: Product[]
  hasMoreProducts: boolean
  form: ProductForm
  files: File[]
  saving: boolean
  showForm: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onSave: (e: FormEvent) => void
  onToggleForm: () => void
  onFormChange: (form: ProductForm) => void
  onFilesChange: (files: File[]) => void
  onLoadMore: () => void
  query: string
}

export function ProductsPage({
  productsCtrl,
  filteredProducts,
  paginatedProducts,
  hasMoreProducts,
  form,
  files,
  saving,
  showForm,
  onEdit,
  onDelete,
  onSave,
  onToggleForm,
  onFormChange,
  onFilesChange,
  onLoadMore,
  query,
}: Props) {
  if (productsCtrl.loading) return <SkeletonList />

  return (
    <div className={styles.wrapper}>
      {productsCtrl.error && <div className="notice notice--error">{productsCtrl.error}</div>}
      <button className="btn btn--add-desktop" onClick={onToggleForm}>
        <PlusIcon /> Mahsulot qo'shish
      </button>
      <div className="card-list">
        {paginatedProducts.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="empty">
            <EmptyTagIcon />
            <span>{query ? "Qidiruv bo'yicha mahsulot topilmadi" : 'Mahsulot topilmadi'}</span>
          </div>
        )}
      </div>
      {hasMoreProducts && (
        <button className="btn btn--load-more" onClick={onLoadMore}>
          Yana yuklash ({filteredProducts.length - paginatedProducts.length} ta)
        </button>
      )}

      <button className="fab" onClick={onToggleForm} aria-label="Mahsulot qo'shish">
        <PlusIcon size={24} />
      </button>

      {showForm && (
        <ProductFormModal
          form={form}
          files={files}
          saving={saving}
          onFormChange={onFormChange}
          onFilesChange={onFilesChange}
          onSave={onSave}
          onClose={onToggleForm}
        />
      )}
    </div>
  )
}
