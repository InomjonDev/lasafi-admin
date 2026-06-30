import { RefreshIcon, LogoutIcon } from '../utils/icons'
import styles from './Header.module.css'

type Props = {
  onRefresh: () => void
  onLogout: () => void
}

function downloadFavicon() {
  const a = document.createElement('a')
  a.href = '/favicon.svg'
  a.download = 'lasafi-admin-favicon.svg'
  a.click()
}

export function Header({ onRefresh, onLogout }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.headerBrand}>
        <div className={styles.headerLogo}>✦</div>
        <div className={styles.headerBrandText}>
          <span className={styles.headerEyebrow}>LaSafi</span>
          <h1 className={styles.headerTitle}>Boshqaruv paneli</h1>
        </div>
      </div>
      <div className={styles.headerActions}>
        <button className="btn btn--ghost btn--icon" onClick={onRefresh} aria-label="Yangilash">
          <RefreshIcon />
        </button>
        <button className="btn btn--ghost btn--icon" onClick={downloadFavicon} aria-label="Favicon yuklab olish" title="Favicon yuklab olish">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button className="btn btn--ghost btn--icon" onClick={onLogout} aria-label="Chiqish" title="Chiqish">
          <LogoutIcon />
        </button>
      </div>
    </header>
  )
}
