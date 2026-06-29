export type Product = {
  id: string
  title: string
  description: string
  price: number
  images: string[]
}

export type Order = {
  id: string
  product_id?: string
  product_title: string
  product_image?: string
  price: number
  customer_name: string
  phone: string
  address: string
  status: string
  created_at?: string
}

export type ProductForm = {
  id?: string
  title: string
  description: string
  price: string
  images: string[]
}

export type Tab = 'products' | 'orders'

export type ToastMsg = {
  msg: string
  type: 'success' | 'error'
}

export type ConfirmDelete = {
  type: 'product' | 'order'
  item: Product | Order
}
