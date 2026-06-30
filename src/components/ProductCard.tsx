import type { Product } from '../types'
import { money } from '../utils/format'
import { EditIcon, DeleteIcon } from '../utils/icons'
import styles from './ProductCard.module.css'

type Props = {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const firstImage = product.images?.[0] || ''

  return (
    <article className={`${styles.card} ${styles.cardProduct}`}>
      <div className={styles.cardImgWrap}>
        {firstImage ? (
          <img className={styles.cardImg} src={firstImage} alt={product.title} loading="lazy" />
        ) : (
          <div className={styles.cardImg} />
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{product.title}</h3>
        <p className={styles.cardDesc}>{product.description}</p>
        <span className={styles.cardPrice}>{money.format(product.price)} so'm</span>
      </div>
      <div className={styles.cardActions}>
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
