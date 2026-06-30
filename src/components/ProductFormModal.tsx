import { useRef, useState, useCallback } from 'react'
import type { FormEvent, ChangeEvent, DragEvent } from 'react'
import type { ProductForm as ProductFormType } from '../types'
import { formatPriceInput } from '../utils/format'
import { CloseIcon } from '../utils/icons'
import styles from './ProductFormModal.module.css'

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
  const [dragging, setDragging] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const allPreviews = [...previews, ...form.images]

  const errors: Record<string, string> = {}
  if (touched.title && !form.title.trim()) errors.title = 'Nomi kiritilishi shart'
  if (touched.price && !form.price) errors.price = 'Narxi kiritilishi shart'
  if (touched.description && !form.description.trim()) errors.description = 'Tavsif kiritilishi shart'

  const addFiles = useCallback((newFiles: File[]) => {
    if (newFiles.length === 0) return
    const urls = newFiles.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...urls])
    onFilesChange([...files, ...newFiles])
  }, [onFilesChange, files])

  const handleFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/')))
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
      onFormChange({ ...form, images: form.images.filter((_, i) => i !== imgIndex) })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form className={`${styles.modal} ${styles.formModal}`} onClick={e => e.stopPropagation()} onSubmit={onSave} noValidate>
        <div className={styles.modalHeader}>
          <h2>{form.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h2>
          <button type="button" className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Yopish">
            <CloseIcon />
          </button>
        </div>

        <div className={`${styles.field} ${errors.title ? styles.fieldError : ''}`}>
          <span className={styles.fieldLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2 H12 M12 22"/><path d="M4.93 4.93 H4.93 M19.07 19.07"/><path d="M2 12 H22 M4.93 19.07 H4.93 M19.07 4.93 H19.07"/></svg>
            Nomi
          </span>
          <input
            required
            value={form.title}
            onChange={e => onFormChange({ ...form, title: e.target.value })}
            onBlur={() => handleBlur('title')}
            placeholder="Mahsulot nomini kiriting"
          />
          {errors.title && <span className={styles.fieldErrorMsg}>{errors.title}</span>}
        </div>

        <div className={`${styles.field} ${errors.price ? styles.fieldError : ''}`}>
          <span className={styles.fieldLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Narxi (so'm)
          </span>
          <div className={styles.priceWrap}>
            <input
              required
              type="text"
              inputMode="numeric"
              value={form.price ? `${formatPriceInput(form.price)} so'm` : ''}
              onChange={e => {
                const digits = e.target.value.replace(/[^\d]/g, '')
                onFormChange({ ...form, price: digits })
              }}
              onBlur={() => handleBlur('price')}
              placeholder="0"
            />
          </div>
          {errors.price && <span className={styles.fieldErrorMsg}>{errors.price}</span>}
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            Rasmlar
          </span>
          <div
            className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilePick}
              className={styles.hiddenInput}
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>{dragging ? 'Rasmlarni tashlang' : 'Rasmlarni yuklash uchun bosing yoki tashlang'}</span>
            <span className={styles.dropzoneHint}>PNG, JPG, WEBP — bir nechta rasm tanlash mumkin</span>
          </div>

          {allPreviews.length > 0 && (
            <div className={styles.imageGrid}>
              {allPreviews.map((src, i) => (
                <div key={i} className={styles.imageGridItem} style={{ '--item-delay': `${i * 40}ms` } as React.CSSProperties}>
                  <img src={src} alt="" />
                  <button
                    type="button"
                    className={styles.imageGridRemove}
                    onClick={() => removeFile(i)}
                    aria-label="Rasmni olib tashlash"
                  >
                    <CloseIcon size={12} />
                  </button>
                </div>
              ))}
              <div className={styles.imageGridAdd} onClick={() => fileInputRef.current?.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
            </div>
          )}

          {form.images.length === 0 && files.length === 0 && form.id && (
            <p className={styles.fieldHint}>Rasm talab qilinmaydi (mavjud rasmlar saqlanadi)</p>
          )}
        </div>

        <div className={`${styles.field} ${errors.description ? styles.fieldError : ''}`}>
          <span className={styles.fieldLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Tavsif
          </span>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={e => onFormChange({ ...form, description: e.target.value })}
            onBlur={() => handleBlur('description')}
            placeholder="Mahsulot haqida batafsil ma'lumot"
          />
          {errors.description && <span className={styles.fieldErrorMsg}>{errors.description}</span>}
        </div>

        <div className={`${styles.field}`}>
          <span className={styles.fieldLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Soni (qoldiq)
          </span>
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={e => onFormChange({ ...form, quantity: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className={styles.formModalFooter}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Bekor qilish</button>
          <button className="btn btn--primary" disabled={saving} type="submit">
            {saving ? (
              <span className="btn__spinner" />
            ) : form.id ? 'Yangilash' : 'Yaratish'}
          </button>
        </div>
      </form>
    </div>
  )
}
