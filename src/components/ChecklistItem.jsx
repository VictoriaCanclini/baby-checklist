export default function ChecklistItem({ item, onToggle }) {
  return (
    <div className={`checklist-item${item.done ? ' done' : ''}`}>
      <button
        className={`checkbox${item.done ? ' checked' : ''}`}
        onClick={onToggle}
        aria-label={item.done ? 'Desmarcar' : 'Marcar como listo'}
      >
        {item.done && (
          <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,5 4.5,8.5 11,1" />
          </svg>
        )}
      </button>
      <span className="item-text">{item.text}</span>
      {item.status && (
        <span className={`badge badge-${item.status}`}>{item.status}</span>
      )}
    </div>
  )
}
