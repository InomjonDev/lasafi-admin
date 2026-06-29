import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ProductForm as ProductFormType } from '../types'
import { formatPriceInput } from '../utils/format'
import { CloseIcon } from '../utils/icons'

type Props = {
  form: ProductFormType
  files: File[]
  saving: boolean
  onFormChange: (form: ProductFormType) => void
  onFilesChange: (files: File[]) => void
  onSave: (e: FormEvent) => void
  onClose: () => void
}

export function ProductFormModal({ form, files, saving, onFormChange, onFilesChange, onSave, onClose }: Props) {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allPreviews = [
    ...previews,
    ...form.images,
  ]

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || [])
    if (picked.length === 0) return
    const urls = picked.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...urls])
    onFilesChange([...files, ...picked])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    const isNew = index < files.length
    if (isNew) {
      URL.revokeObjectURL(previews[index])
      const newFiles = files.filter((_, i) => i !== index)
      const newPreviews = previews.filter((_, i) => i !== index)
      onFilesChange(newFiles)
      setPreviews(newPreviews)
    } else {
      const imgIndex = index - files.length
      const newImages = form.images.filter((_, i) => i !== imgIndex)
      onFormChange({ ...form, images: newImages })
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={e => e.stopPropagation()} onSubmit={onSave}>
        <div className="modal__header">
          <h2>{form.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h2>
          <button type="button" className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Yopish">
            <CloseIcon />
          </button>
        </div>

        <label className="field">
          Nomi
          <input
            required
            value={form.title}
            onChange={e => onFormChange({ ...form, title: e.target.value })}
          />
        </label>

        <label className="field">
          Narxi (so'm)
          <div style={{ position: 'relative' }}>
            <input
              required
              type="text"
              inputMode="numeric"
              value={form.price ? `${formatPriceInput(form.price)} so'm` : ''}
              onChange={e => {
                const digits = e.target.value.replace(/[^\d]/g, '')
                onFormChange({ ...form, price: digits })
              }}
              style={{ paddingRight: 48 }}
            />
          </div>
        </label>

        <label className="field">
          Rasmlar
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilePick}
          />
        </label>

        {allPreviews.length > 0 && (
          <div className="image-grid">
            {allPreviews.map((src, i) => (
              <div key={i} className="image-grid__item">
                <img src={src} alt="" />
                <button
                  type="button"
                  className="image-grid__remove"
                  onClick={() => removeFile(i)}
                  aria-label="Rasmni olib tashlash"
                >
                  <CloseIcon size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {form.images.length === 0 && files.length === 0 && form.id && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: -8 }}>
            Rasm talab qilinmaydi (mavjud rasmlar saqlanadi)
          </p>
        )}

        <label className="field" style={{ marginTop: 12 }}>
          Tavsif
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={e => onFormChange({ ...form, description: e.target.value })}
          />
        </label>

        <button className="btn btn--primary" disabled={saving} type="submit">
          {saving ? 'Saqlanmoqda...' : form.id ? 'Yangilash' : 'Yaratish'}
        </button>
      </form>
    </div>
  )
}
