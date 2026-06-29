import type { Product } from '../types'
import { money } from '../utils/format'
import { EditIcon, DeleteIcon } from '../utils/icons'

type Props = {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const firstImage = product.images?.[0] || ''

  return (
    <article className="card card--product">
      <div className="card__img-wrap">
        {firstImage ? (
          <img className="card__img" src={firstImage} alt={product.title} loading="lazy" />
        ) : (
          <div className="card__img card__img--empty" />
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.title}</h3>
        <p className="card__desc">{product.description}</p>
        <span className="card__price">{money.format(product.price)} so'm</span>
      </div>
      <div className="card__actions">
        <button className="btn btn--sm" onClick={() => onEdit(product)}>
          <EditIcon /> Tahrirlash
        </button>
        <button className="btn btn--sm btn--danger" onClick={() => onDelete(product)}>
          <DeleteIcon /> O'chirish
        </button>
      </div>
    </article>
  )
}
