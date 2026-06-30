import styles from './StatCard.module.css'

type Props = {
  icon: string
  label: string
  value: string | number
  glow: string
  iconClass: string
}

export function StatCard({ icon, label, value, glow, iconClass }: Props) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statCardGlow} style={{ background: glow }} />
      <div className={`${styles.statCardIcon} ${iconClass}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>
      <div className={styles.statCardContent}>
        <span className={styles.statCardLabel}>{label}</span>
        <strong className={styles.statCardValue}>{value}</strong>
      </div>
    </article>
  )
}
