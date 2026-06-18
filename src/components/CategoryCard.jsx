import { useState } from 'react'
import ChecklistItem from './ChecklistItem'

function ChevronIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function CategoryCard({ category, onToggleItem, onAddItem, onToggle }) {
  const [newItemText, setNewItemText] = useState('')

  const done = category.items.filter(i => i.done).length
  const total = category.items.length
  const progress = total > 0 ? (done / total) * 100 : 0

  const handleAdd = () => {
    if (!newItemText.trim()) return
    onAddItem(newItemText)
    setNewItemText('')
  }

  return (
    <div className="category-card">
      <div className="category-header" onClick={onToggle} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onToggle()}>
        <div className="category-icon-wrap">{category.icon}</div>
        <div className="category-info">
          <h3>{category.name}</h3>
          {category.subtitle && <p>{category.subtitle}</p>}
        </div>
        <div className="category-meta">
          <div className="mini-progress-track">
            <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="category-count">{done}/{total}</span>
          <span className="chevron-icon">
            <ChevronIcon open={category.expanded} />
          </span>
        </div>
      </div>

      {category.expanded && (
        <div className="category-body">
          {category.items.map(item => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
            />
          ))}
          <div className="add-item-row">
            <input
              className="add-item-input"
              placeholder="Agregar ítem..."
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button className="add-item-btn" onClick={handleAdd} aria-label="Agregar">+</button>
          </div>
        </div>
      )}
    </div>
  )
}
