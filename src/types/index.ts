export type Product = {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  quantity: number
}

export type Order = {
  id: string
  product_id?: string
  product_title: string
  product_image?: string
  price: number
  quantity?: number
  total_price?: number
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
  quantity: string
}

export type Tab = 'products' | 'orders' | 'analytics'

export type AnalyticsStats = {
  summary: {
    total_visits: number
    unique_visitors: number
    total_page_views: number
    total_product_views: number
  }
  daily: {
    date: string
    visits: number
    unique_visitors: number
    page_views: number
  }[]
  page_breakdown: Record<string, number>
  top_products: {
    product_id: string
    views: number
  }[]
}

export type ToastMsg = {
  msg: string
  type: 'success' | 'error'
}

export type ConfirmDelete = {
  type: 'product' | 'order'
  item: Product | Order
}
