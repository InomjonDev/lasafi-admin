import { useEffect, useRef, useState } from 'react'
import styles from './Select.module.css'

type Option = { value: string; label: string; bg: string; color: string }

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
}

export function Select({ options, value, onChange, disabled, style, className }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className={`${styles.selectWrap}${className ? ' ' + className : ''}`} style={style}>
      <button
        className={styles.selectTrigger}
        type="button"
        disabled={disabled}
        style={{
          background: selected?.bg || '#f5f5f4',
          color: selected?.color || '#44403c',
        }}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        <span className={styles.selectTriggerDot} style={{ background: selected?.bg || '#ccc' }} />
        <span className={styles.selectTriggerLabel}>{selected?.label || value}</span>
        <svg className={`${styles.selectTriggerArrow}${open ? ' ' + styles.selectTriggerArrowOpen : ''}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className={styles.selectMenu}>
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              className={`${styles.selectOption} ${o.value === value ? styles.selectOptionActive : ''}`}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              <span className={styles.selectOptionDot} style={{ background: o.bg || '#ccc' }} />
              <span>{o.label}</span>
              {o.value === value && (
                <svg className={styles.selectOptionCheck} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
