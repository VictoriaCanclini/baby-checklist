export default function StatsBar({ total, done, pending }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-number">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card">
        <span className="stat-number accent">{done}</span>
        <span className="stat-label">Listos</span>
      </div>
      <div className="stat-card">
        <span className="stat-number red">{pending}</span>
        <span className="stat-label">Pendientes</span>
      </div>
    </div>
  )
}
