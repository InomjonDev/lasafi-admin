import { useState, type FormEvent } from 'react'
import { supabase } from './supabase'

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
            <div className="login__password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="login__password-toggle"
                onClick={() => setShowPassword(s => !s)}
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                tabIndex={-1}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
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
