import { StatCard } from '../components/StatCard'
import type { AnalyticsStats } from '../types'
import styles from './AnalyticsPage.module.css'

type Props = {
  analyticsCtrl: {
    stats: AnalyticsStats | null
    loading: boolean
    error: string
    load: (from?: string, to?: string) => void
    retry: () => void
  }
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onToday: () => void
  onThisWeek: () => void
  onThisMonth: () => void
  onDateRange: () => void
}

export function AnalyticsPage({
  analyticsCtrl,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onToday,
  onThisWeek,
  onThisMonth,
  onDateRange,
}: Props) {
  if (analyticsCtrl.loading) {
    return (
      <div className={styles.fadeIn}>
        <div className={styles.skeletonSummary}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonShape} ${styles.skeletonIcon}`} />
              <div className={`${styles.skeletonShape} ${styles.skeletonLabel}`} />
              <div className={`${styles.skeletonShape} ${styles.skeletonValue}`} />
            </div>
          ))}
        </div>
        <div className={styles.skeletonControls}>
          <div className={`${styles.skeletonShape} ${styles.skeletonBtn}`} />
          <div className={`${styles.skeletonShape} ${styles.skeletonBtn}`} />
          <div className={`${styles.skeletonShape} ${styles.skeletonBtn}`} />
        </div>
        <div className={styles.skeletonChart}>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className={styles.skeletonBar} style={{ height: `${20 + Math.random() * 60}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (analyticsCtrl.error) {
    return (
      <div className={styles.error} role="alert">
        <div className={styles.errorContent}>
          <p>{analyticsCtrl.error}</p>
          <button
            className={`btn btn--sm ${styles.errorRetry}`}
            onClick={analyticsCtrl.retry}
            disabled={analyticsCtrl.loading}
          >
            {analyticsCtrl.loading && <span className="btn__spinner" />}
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  if (!analyticsCtrl.stats) {
    return (
      <div className={styles.empty}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.emptyIcon}>
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
        <h3 className={styles.emptyTitle}>Hozircha ma'lumot yo'q</h3>
        <p className={styles.emptyDesc}>
          Saytga tashrif buyuruvchilar haqidagi ma'lumotlar bu yerda ko'rinadi.
          Ma'lumotlar to'planishi bilan statistikani ko'rishingiz mumkin.
        </p>
      </div>
    )
  }

  const { stats } = analyticsCtrl

  return (
    <div className={styles.fadeIn}>
      <section className={styles.summary}>
        <StatCard
          icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          label="Tashriflar"
          value={stats.summary.total_visits}
          glow="var(--color-gold)"
          iconClass="stat-card__icon--gold"
        />
        <StatCard
          icon="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          label="Mehmonlar"
          value={stats.summary.unique_visitors}
          glow="var(--color-emerald)"
          iconClass="stat-card__icon--emerald"
        />
        <StatCard
          icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          label="Sahifa ko'rish"
          value={stats.summary.total_page_views}
          glow="var(--color-rose)"
          iconClass="stat-card__icon--rose"
        />
        <StatCard
          icon="M2 12a9 9 0 0 1 9-9h2a9 9 0 0 1 9 9v2a9 9 0 0 1-9 9h-2a9 9 0 0 1-9-9z"
          label="Mahsulot ko'rish"
          value={stats.summary.total_product_views}
          glow="var(--color-amber)"
          iconClass="stat-card__icon--amber"
        />
      </section>

      <div className={styles.controls}>
        <span className={styles.controlsLabel}>Davr:</span>
        <div className={styles.presets}>
          <button className="btn btn--sm" disabled={analyticsCtrl.loading} onClick={onToday}>
            {analyticsCtrl.loading && <span className="btn__spinner" />}
            Bugun
          </button>
          <button className="btn btn--sm" disabled={analyticsCtrl.loading} onClick={onThisWeek}>
            {analyticsCtrl.loading && <span className="btn__spinner" />}
            7 kun
          </button>
          <button className="btn btn--sm" disabled={analyticsCtrl.loading} onClick={onThisMonth}>
            {analyticsCtrl.loading && <span className="btn__spinner" />}
            30 kun
          </button>
        </div>
        <div className={styles.dates}>
          <input
            type="date"
            className={styles.dateInput}
            value={dateFrom}
            onChange={e => onDateFromChange(e.target.value)}
          />
          <span>—</span>
          <input
            type="date"
            className={styles.dateInput}
            value={dateTo}
            onChange={e => onDateToChange(e.target.value)}
          />
          <button className="btn btn--sm" disabled={analyticsCtrl.loading} onClick={onDateRange}>
            {analyticsCtrl.loading && <span className="btn__spinner" />}
            OK
          </button>
        </div>
      </div>

      {stats.daily.length > 0 ? (
        <section className={styles.chartWrap}>
          <h3 className={styles.sectionTitle}>Kunlik tashriflar</h3>
          <div className={styles.chart}>
            {stats.daily.map((d, i) => {
              const max = Math.max(...stats.daily.map(x => x.visits), 1)
              const h = (d.visits / max) * 100
              return (
                <div key={d.date} className={styles.chartCol}>
                  <span className={styles.chartVal}>{d.visits}</span>
                  <div
                    className={styles.chartBar}
                    style={{ '--bar-height': `${h}%`, '--bar-delay': `${i * 40}ms` } as React.CSSProperties}
                  />
                  <span className={styles.chartDate}>{d.date.slice(5)}</span>
                </div>
              )
            })}
          </div>
        </section>
      ) : (
        <section className={styles.chartWrap}>
          <p className={styles.emptyChart}>Tanlangan davrda ma'lumot yo'q. Boshqa davrni tanlab ko'ring.</p>
        </section>
      )}

      <section className={styles.breakdowns}>
        <div>
          <h3 className={styles.sectionTitle}>Sahifalar</h3>
          {Object.keys(stats.page_breakdown).length === 0 ? (
            <div className={styles.emptySmall}>
              <span>Sahifalar bo'yicha ma'lumot yo'q</span>
            </div>
          ) : (
            <div className={styles.list}>
              {Object.entries(stats.page_breakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([page, count]) => (
                <div key={page} className={styles.listRow}>
                  <span className={styles.listLabel}>{page}</span>
                  <span className={styles.listValue}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className={styles.sectionTitle}>Eng ko'p ko'rilgan</h3>
          {stats.top_products.length === 0 ? (
            <div className={styles.emptySmall}>
              <span>Mahsulot ko'rishlar haqida ma'lumot yo'q</span>
            </div>
          ) : (
            <div className={styles.list}>
              {stats.top_products.map(p => (
                <div key={p.product_id} className={styles.listRow}>
                  <span className={styles.listLabel}>{p.product_id.slice(0, 8)}...</span>
                  <span className={styles.listValue}>{p.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
