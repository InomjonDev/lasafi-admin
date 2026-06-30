import { SearchIcon } from '../utils/icons'
import styles from './SearchBar.module.css'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Qidirish...' }: Props) {
  return (
    <div className={styles.searchWrap}>
      <SearchIcon />
      <input
        className={styles.search}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
