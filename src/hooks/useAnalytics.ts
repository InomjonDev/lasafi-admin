import { useState, useCallback, useRef } from 'react'
import type { AnalyticsStats } from '../types'
import * as analyticsApi from '../api/analytics'
import { AuthError } from '../api/client'

function friendlyError(err: unknown): string {
  if (err instanceof AuthError) throw err
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    return 'Serverga ulanishda xatolik. Internetni tekshirib, qayta urinib ko\'ring.'
  }
  return 'Ma\'lumotlarni yuklashda xatolik yuz berdi. Qayta urinib ko\'ring.'
}

export function useAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const paramsRef = useRef<{ from?: string; to?: string }>({})

  const load = useCallback(async (from?: string, to?: string) => {
    paramsRef.current = { from, to }
    setLoading(true)
    setError('')
    try {
      const data = await analyticsApi.fetchAnalytics(from, to)
      setStats(data)
    } catch (err) {
      if (err instanceof AuthError) throw err
      setStats(null)
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const retry = useCallback(() => {
    return load(paramsRef.current.from, paramsRef.current.to)
  }, [load])

  return { stats, loading, error, load, retry }
}
