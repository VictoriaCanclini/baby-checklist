import { useState, useRef, useEffect } from 'react'
import ChecklistItem from './ChecklistItem'

function GripIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
      <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

const matchesFilter = (item, filter) => {
  if (filter === 'urgentes') return item.status === 'urgente'
  if (filter === 'pendientes') return !item.done
  return true
}

export default function CategoryCard({ category, activeFilter, isAdmin, isDragging, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd, onToggleItem, onAddItem, onToggle, onDeleteItem, onUpdateItem, onSetItemStatus, onReserveItem, onUnreserveItem, onDelete, onUpdate }) {
  const [newItemText, setNewItemText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editFields, setEditFields] = useState({ name: category.name, subtitle: category.subtitle, icon: category.icon })
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (isEditing) nameInputRef.current?.focus()
  }, [isEditing])

  const visibleItems = category.items.filter(i => matchesFilter(i, activeFilter))
  const done = category.items.filter(i => i.done).length
  const total = category.items.length
  const progress = total > 0 ? (done / total) * 100 : 0

  if (activeFilter !== 'all' && visibleItems.length === 0) return null

  const handleAdd = () => {
    if (!newItemText.trim()) return
    onAddItem(newItemText)
    setNewItemText('')
  }

  const startEdit = (e) => {
    e.stopPropagation()
    setEditFields({ name: category.name, subtitle: category.subtitle, icon: category.icon })
    setIsEditing(true)
  }

  const saveEdit = () => {
    if (!editFields.name.trim()) return
    onUpdate({ name: editFields.name.trim(), subtitle: editFields.subtitle.trim(), icon: editFields.icon.trim() || '📦' })
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditFields({ name: category.name, subtitle: category.subtitle, icon: category.icon })
    setIsEditing(false)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setConfirmDelete(true)
  }

  if (isEditing) {
    return (
      <div className="category-card">
        <div className="category-header-edit">
          <input
            className="edit-icon-input"
            value={editFields.icon}
            onChange={e => setEditFields(f => ({ ...f, icon: e.target.value }))}
            maxLength={2}
            aria-label="Ícono"
          />
          <div className="edit-fields">
            <input
              ref={nameInputRef}
              className="edit-name-input"
              value={editFields.name}
              onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre de la categoría"
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
            />
            <input
              className="edit-subtitle-input"
              value={editFields.subtitle}
              onChange={e => setEditFields(f => ({ ...f, subtitle: e.target.value }))}
              placeholder="Subtítulo (opcional)"
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
            />
          </div>
          <div className="edit-actions">
            <button className="edit-save-btn" onClick={saveEdit}>Guardar</button>
            <button className="cancel-btn" onClick={cancelEdit}>✕</button>
          </div>
        </div>
      </div>
    )
  }

  if (confirmDelete) {
    return (
      <div className="category-card">
        <div className="category-header confirm-delete-header">
          <div className="category-icon-wrap">{category.icon}</div>
          <div className="category-info">
            <h3>{category.name}</h3>
            <p className="confirm-delete-text">¿Eliminar esta categoría y sus {total} ítems?</p>
          </div>
          <div className="confirm-actions">
            <button className="confirm-delete-btn" onClick={onDelete}>Eliminar</button>
            <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>Cancelar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`category-card${isDragging ? ' dragging' : ''}${isDragOver ? ' drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); onDragOver() }}
      onDrop={e => { e.preventDefault(); onDrop() }}
    >
      <div className="category-header" onClick={onToggle} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onToggle()}>
        {isAdmin && (
          <div
            className="drag-handle"
            draggable
            onDragStart={e => { e.stopPropagation(); onDragStart() }}
            onDragEnd={onDragEnd}
            onClick={e => e.stopPropagation()}
            title="Arrastrar para reordenar"
          >
            <GripIcon />
          </div>
        )}
        <div className="category-icon-wrap">{category.icon}</div>
        <div className="category-info">
          <h3>{category.name}</h3>
          {category.subtitle && <p>{category.subtitle}</p>}
        </div>
        <div className="category-meta">
          {isAdmin && (
            <div className="cat-header-actions">
              <button className="cat-action-btn" onClick={startEdit} aria-label="Editar categoría">
                <PencilIcon />
              </button>
              <button className="cat-action-btn danger" onClick={handleDeleteClick} aria-label="Eliminar categoría">
                <TrashIcon />
              </button>
            </div>
          )}
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
          {visibleItems.map(item => (
            <ChecklistItem
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              onDelete={() => onDeleteItem(item.id)}
              onEdit={updates => onUpdateItem(item.id, updates)}
              onReserve={name => onReserveItem(item.id, name)}
              onUnreserve={() => onUnreserveItem(item.id)}
            />
          ))}
          {isAdmin && (
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
          )}
        </div>
      )}
    </div>
  )
}
