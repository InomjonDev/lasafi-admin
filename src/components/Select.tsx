import { useEffect, useRef, useState } from 'react'

type Option = { value: string; label: string; bg: string; color: string }

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  style?: React.CSSProperties
}

export function Select({ options, value, onChange, disabled, style }: Props) {
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
    <div ref={ref} className="custom-select" style={{ position: 'relative', ...style }}>
      <button
        className="status-badge"
        type="button"
        disabled={disabled}
        style={{
          background: selected?.bg || '#f5f5f4',
          color: selected?.color || '#44403c',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'default' : 'pointer',
          paddingRight: 26,
          minWidth: 140,
          justifyContent: 'space-between',
        }}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        <span>{selected?.label || value}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.6, flexShrink: 0 }}>
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          className="custom-select__menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 20,
            minWidth: 160,
            background: '#fff',
            border: '1px solid #e7e5e4',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              className={`custom-select__option ${o.value === value ? 'custom-select__option--active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                border: 0,
                background: o.value === value ? '#f5f0e8' : 'transparent',
                color: '#292524',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
              onMouseEnter={e => { if (o.value !== value) (e.target as HTMLElement).style.background = '#faf8f4' }}
              onMouseLeave={e => { if (o.value !== value) (e.target as HTMLElement).style.background = 'transparent' }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: o.bg || '#ccc',
                  flexShrink: 0,
                }}
              />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
