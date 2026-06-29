import type { SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ children, size = 16, ...rest }: Props & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {children}
    </svg>
  )
}

export function SearchIcon(props: Props) {
  return <Svg {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></Svg>
}

export function PlusIcon(props: Props) {
  return <Svg strokeWidth="2.5" {...props}><path d="M12 5v14M5 12h14"/></Svg>
}

export function CloseIcon(props: Props) {
  return <Svg strokeWidth="2.5" {...props}><path d="M18 6 6 18M6 6l12 12"/></Svg>
}

export function RefreshIcon(props: Props) {
  return <Svg {...props}><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></Svg>
}

export function LogoutIcon(props: Props) {
  return <Svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></Svg>
}

export function EditIcon(props: Props) {
  return <Svg strokeWidth="2.5" size={12} {...props}><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></Svg>
}

export function DeleteIcon(props: Props) {
  return <Svg strokeWidth="2.5" size={12} {...props}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>
}

export function CheckIcon(props: Props) {
  return <Svg strokeWidth="2.5" {...props}><path d="M20 6 9 17l-5-5"/></Svg>
}

export function TagIcon(props: Props) {
  return <Svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/></Svg>
}

export function CartIcon(props: Props) {
  return <Svg {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></Svg>
}

export function BellIcon(props: Props) {
  return <Svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></Svg>
}

export function DollarIcon(props: Props) {
  return <Svg {...props}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Svg>
}

export function AlertIcon(props: Props) {
  return <Svg size={40} strokeWidth="1.5" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></Svg>
}

export function EmptyTagIcon(props: Props) {
  return <Svg size={32} strokeWidth="1.5" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/></Svg>
}

export function EmptyCartIcon(props: Props) {
  return <Svg size={32} strokeWidth="1.5" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></Svg>
}
