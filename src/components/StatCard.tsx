type Props = {
  icon: string
  label: string
  value: string | number
  glow: string
  iconClass: string
}

export function StatCard({ icon, label, value, glow, iconClass }: Props) {
  return (
    <article className="stat-card">
      <div className="stat-card__glow" style={{ background: glow }} />
      <div className={`stat-card__icon ${iconClass}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <strong className="stat-card__value">{value}</strong>
      </div>
    </article>
  )
}
