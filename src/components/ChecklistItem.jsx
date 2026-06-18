import { useState, useRef, useEffect } from 'react'

const STATUSES = [null, 'pendiente', 'urgente']

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
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

export default function ChecklistItem({ item, onToggle, onDelete, onEdit, onSetStatus }) {
  const cycleStatus = () => {
    const idx = STATUSES.indexOf(item.status)
    onSetStatus(STATUSES[(idx + 1) % STATUSES.length])
  }
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(item.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const startEdit = () => {
    setEditText(item.text)
    setIsEditing(true)
  }

  const save = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== item.text) onEdit(trimmed)
    setIsEditing(false)
  }

  const cancel = () => {
    setEditText(item.text)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="checklist-item editing">
        <div className="checkbox-placeholder" />
        <input
          ref={inputRef}
          className="item-edit-input"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={save}
          onKeyDown={e => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') cancel()
          }}
        />
      </div>
    )
  }

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
      <span className="item-text" onDoubleClick={startEdit}>{item.text}</span>
      {item.status && (
        <button className={`badge badge-${item.status} badge-clickable`} onClick={cycleStatus} title="Click para cambiar estado">
          {item.status}
        </button>
      )}
      <div className="item-actions">
        <button className={`item-action-btn${item.status ? ' tag-active' : ''}`} onClick={cycleStatus} aria-label="Cambiar estado">
          <TagIcon />
        </button>
        <button className="item-action-btn" onClick={startEdit} aria-label="Editar ítem">
          <PencilIcon />
        </button>
        <button className="item-action-btn danger" onClick={onDelete} aria-label="Eliminar ítem">
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}
