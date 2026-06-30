import type { AnalyticsStats } from '../types'
import { apiRequest } from './client'

export function fetchAnalytics(from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return apiRequest<AnalyticsStats>(`/analytics/stats${qs ? '?' + qs : ''}`)
}
