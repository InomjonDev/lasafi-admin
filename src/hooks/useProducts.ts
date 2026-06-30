import { useState } from 'react'
import type { Product, ProductForm } from '../types'
import * as productsApi from '../api/products'
import { uploadImages } from '../api/storage'
import { AuthError } from '../api/client'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await productsApi.fetchProducts()
      setProducts(data ?? [])
    } catch (err) {
      if (err instanceof AuthError) throw err
      setError(err instanceof Error ? err.message : 'Mahsulotlar mavjud emas')
    } finally {
      setLoading(false)
    }
  }

  const save = async (form: ProductForm, files: File[]) => {
    let images = form.images
    if (files.length > 0) {
      const urls = await uploadImages(files)
      images = [...images, ...urls]
    }
    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      images,
      quantity: Number(form.quantity) || 0,
    }
    if (form.id) {
      const updated = await productsApi.updateProduct(form.id, body)
      const product = updated[0] || { ...body, id: form.id }
      setProducts(prev => prev.map(p => p.id === form.id ? product : p))
      return { type: 'updated' as const }
    } else {
      await productsApi.createProduct(body)
      await load()
      return { type: 'created' as const }
    }
  }

  const remove = async (id: string) => {
    await productsApi.deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return { products, loading, error, load, save, remove }
}
