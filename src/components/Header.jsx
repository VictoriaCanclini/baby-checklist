import { useState } from 'react'

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function UnlockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}

export default function Header({ title, subtitle, progress, isAdmin, onAdminUnlock, onAdminExit }) {
  const [showInput, setShowInput] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    const ok = onAdminUnlock(password)
    if (ok) {
      setShowInput(false)
      setPassword('')
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  const handleExit = () => {
    onAdminExit()
    setShowInput(false)
    setPassword('')
    setError(false)
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-title">
          <svg className="header-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h1>{title}</h1>
        </div>

        {isAdmin ? (
          <div className="admin-bar">
            <span className="admin-badge">Modo admin</span>
            <button className="admin-lock-btn active" onClick={handleExit} title="Salir del modo admin">
              <UnlockIcon />
            </button>
          </div>
        ) : showInput ? (
          <div className="admin-password-row">
            <input
              className={`admin-password-input${error ? ' error' : ''}`}
              type="password"
              placeholder={error ? 'Contraseña incorrecta' : 'Contraseña...'}
              value={password}
              autoFocus
              onChange={e => { setPassword(e.target.value); setError(false) }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSubmit()
                if (e.key === 'Escape') { setShowInput(false); setPassword(''); setError(false) }
              }}
            />
            <button className="admin-lock-btn" onClick={handleSubmit}>→</button>
            <button className="admin-lock-btn" onClick={() => { setShowInput(false); setPassword(''); setError(false) }}>✕</button>
          </div>
        ) : (
          <button className="admin-lock-btn" onClick={() => setShowInput(true)} title="Acceso admin">
            <LockIcon />
          </button>
        )}
      </div>

      <p className="header-subtitle">{subtitle}</p>

      <div className="progress-card">
        <div className="progress-label">
          <span>Progreso general</span>
          <span className="progress-pct">{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>
  )
}
