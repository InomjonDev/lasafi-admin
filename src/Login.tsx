import { useState, type FormEvent } from 'react'
import { supabase } from './supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? "Email yoki parol noto'g'ri"
        : 'Kirishda xatolik yuz berdi')
    }
    setLoading(false)
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__logo">✦</div>
        <h1 className="login__title">LaSafi</h1>
        <p className="login__subtitle">Boshqaruv paneliga kirish</p>
        <form onSubmit={handleLogin}>
          <label className="login__field">
            Email
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </label>
          <label className="login__field">
            Parol
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <div className="login__error">{error}</div>}
          <button className="login__btn" disabled={loading} type="submit">
            {loading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  )
}
