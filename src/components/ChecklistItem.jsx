import { useState, useRef, useEffect } from 'react'

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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

function UndoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  )
}

export default function ChecklistItem({ item, onDelete, onEdit, onReserve, onUnreserve }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(item.text)
  const [editUrl, setEditUrl] = useState(item.url || '')
  const [isReserving, setIsReserving] = useState(false)
  const [reserverName, setReserverName] = useState('')
  const inputRef = useRef(null)
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  useEffect(() => {
    if (isReserving) nameInputRef.current?.focus()
  }, [isReserving])

  const startEdit = () => {
    setEditText(item.text)
    setEditUrl(item.url || '')
    setIsEditing(true)
  }

  const saveEdit = () => {
    const trimmed = editText.trim()
    if (trimmed) onEdit({ text: trimmed, url: editUrl.trim() || null })
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditText(item.text)
    setEditUrl(item.url || '')
    setIsEditing(false)
  }

  const handleReserve = () => {
    const name = reserverName.trim()
    if (!name) return
    onReserve(name)
    setIsReserving(false)
    setReserverName('')
  }

  if (isEditing) {
    return (
      <div className="checklist-item editing">
        <div className="checkbox-placeholder" />
        <div className="item-edit-fields">
          <input
            ref={inputRef}
            className="item-edit-input"
            value={editText}
            placeholder="Nombre del ítem"
            onChange={e => setEditText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
          />
          <input
            className="item-edit-input item-url-input"
            value={editUrl}
            placeholder="Link al producto (opcional)"
            type="url"
            onChange={e => setEditUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
          />
        </div>
        <button className="item-edit-save-btn" onClick={saveEdit}>✓</button>
        <button className="item-edit-cancel-btn" onClick={cancelEdit}>✕</button>
      </div>
    )
  }

  return (
    <div className={`checklist-item-wrapper${item.reserved ? ' is-reserved' : ''}`}>
      <div className="checklist-item">
        <span className="item-text">{item.text}</span>

        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="item-link-btn" aria-label="Ver producto" onClick={e => e.stopPropagation()}>
            <LinkIcon />
          </a>
        )}

        {item.reserved ? (
          <span className="badge badge-reservado">Reservado por {item.reservedBy}</span>
        ) : (
          <button className="reserve-btn" onClick={() => setIsReserving(true)}>
            Reservar
          </button>
        )}

        <div className="item-actions">
          {item.reserved && (
            <button className="item-action-btn" onClick={onUnreserve} aria-label="Quitar reserva" title="Quitar reserva">
              <UndoIcon />
            </button>
          )}
          <button className="item-action-btn" onClick={startEdit} aria-label="Editar ítem">
            <PencilIcon />
          </button>
          <button className="item-action-btn danger" onClick={onDelete} aria-label="Eliminar ítem">
            <TrashIcon />
          </button>
        </div>
      </div>

      {isReserving && (
        <div className="reserve-input-row">
          <input
            ref={nameInputRef}
            className="reserve-name-input"
            placeholder="Tu nombre..."
            value={reserverName}
            onChange={e => setReserverName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleReserve(); if (e.key === 'Escape') setIsReserving(false) }}
          />
          <button className="reserve-confirm-btn" onClick={handleReserve}>Confirmar</button>
          <button className="cancel-btn" onClick={() => setIsReserving(false)}>✕</button>
        </div>
      )}
    </div>
  )
}
