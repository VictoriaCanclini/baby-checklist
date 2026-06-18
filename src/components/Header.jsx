export default function Header({ title, subtitle, progress }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-title">
          <svg className="header-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h1>{title}</h1>
        </div>
        <p className="header-subtitle">{subtitle}</p>
      </div>
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
