export default function StatsBar({ total, reserved, pending }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-number">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card">
        <span className="stat-number accent">{reserved}</span>
        <span className="stat-label">Reservados</span>
      </div>
      <div className="stat-card">
        <span className="stat-number red">{pending}</span>
        <span className="stat-label">Pendientes</span>
      </div>
    </div>
  )
}
