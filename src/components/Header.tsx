import { RefreshIcon, LogoutIcon } from '../utils/icons'

type Props = {
  onRefresh: () => void
  onLogout: () => void
}

export function Header({ onRefresh, onLogout }: Props) {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo">✦</div>
        <div className="header__brand-text">
          <span className="header__eyebrow">LaSafi</span>
          <h1 className="header__title">Boshqaruv paneli</h1>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn--ghost btn--icon" onClick={onRefresh} aria-label="Yangilash">
          <RefreshIcon />
        </button>
        <button className="btn btn--ghost btn--icon" onClick={onLogout} aria-label="Chiqish" title="Chiqish">
          <LogoutIcon />
        </button>
      </div>
    </header>
  )
}
