import { useEffect } from 'react'
import { CheckIcon, CloseIcon } from '../utils/icons'

type Props = {
  msg: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ msg, type, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`toast toast--${type}`} onClick={onClose} role="alert">
      {type === 'success' ? <CheckIcon /> : <CloseIcon />}
      {msg}
    </div>
  )
}
