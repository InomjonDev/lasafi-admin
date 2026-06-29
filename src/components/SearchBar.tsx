import { SearchIcon } from '../utils/icons'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Qidirish...' }: Props) {
  return (
    <div className="search-wrap">
      <SearchIcon />
      <input
        className="search"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
