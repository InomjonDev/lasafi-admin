import styles from './SkeletonList.module.css'

export function SkeletonList() {
  return (
    <div className={styles.skeletonList}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  )
}
