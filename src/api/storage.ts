import { supabase } from '../supabase'

async function uploadOne(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)
  if (error) throw new Error("Rasm yuklab bo'lmadi: " + error.message)
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)
  return publicUrl
}

export async function uploadImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadOne))
}
