import { supabase } from '../supabase'

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	'https://telegram-shop-api.inomjonismanaliev.workers.dev'

export class AuthError extends Error {}

export async function apiRequest<T>(
	path: string,
	options?: RequestInit,
): Promise<T> {
	const {
		data: { session },
	} = await supabase.auth.getSession()
	const headers: Record<string, string> = { 'Content-Type': 'application/json' }
	if (session?.access_token) {
		headers['Authorization'] = `Bearer ${session.access_token}`
	}
	const res = await fetch(`${API_BASE_URL}${path}`, {
		headers: { ...headers, ...(options?.headers as Record<string, string>) },
		...options,
	})
	if (res.status === 401) {
		await supabase.auth.signOut()
		throw new AuthError('Sessiya tugadi')
	}
	const payload = await res.json().catch(() => null)
	if (!res.ok)
		throw new Error(payload?.error || `So'rov bajarilmadi (${res.status})`)
	return payload as T
}
