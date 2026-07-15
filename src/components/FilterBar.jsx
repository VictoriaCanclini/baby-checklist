const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'reservados', label: 'Reservados' },
]

export default function FilterBar({ active, onChange, counts }) {
  return (
    <div className="filter-bar">
      {FILTERS.map(f => (
        <button
          key={f.id}
          className={`filter-pill${active === f.id ? ' active' : ''}`}
          onClick={() => onChange(f.id)}
        >
          {f.label}
          <span className="filter-count">{counts[f.id]}</span>
        </button>
      ))}
    </div>
  )
}
