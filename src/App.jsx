import { useState, useEffect } from 'react'
import { initialCategories } from './data/initialData'
import { supabase } from './supabase'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import FilterBar from './components/FilterBar'
import CategoryCard from './components/CategoryCard'
import './App.css'

export default function App() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCatText, setNewCatText] = useState('')
  const [addingCat, setAddingCat] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isAdmin, setIsAdmin] = useState(false)

  const ADMIN_PASSWORD = 'valentino2026'

  const handleAdminUnlock = (password) => {
    if (password === ADMIN_PASSWORD) { setIsAdmin(true); return true }
    return false
  }

  useEffect(() => {
    // Carga inicial
    supabase
      .from('checklist')
      .select('categories')
      .eq('id', 'main')
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          // Primera vez — inicializa con los datos por defecto
          supabase.from('checklist').upsert({ id: 'main', categories: initialCategories }).then()
          setCategories(initialCategories)
        } else {
          setCategories(data.categories)
        }
        setLoading(false)
      })

    // Suscripción a cambios en tiempo real
    const channel = supabase
      .channel('checklist-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'checklist', filter: 'id=eq.main' },
        (payload) => setCategories(payload.new.categories)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const save = (newCategories) => {
    setCategories(newCategories)
    supabase.from('checklist').upsert({ id: 'main', categories: newCategories }).then()
  }

  const allItems = categories.flatMap(c => c.items)
  const total = allItems.length
  const done = allItems.filter(i => i.done).length
  const pending = total - done
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const toggleItem = (catId, itemId) =>
    save(categories.map(cat =>
      cat.id === catId
        ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item) }
        : cat
    ))

  const addItem = (catId, text) =>
    save(categories.map(cat =>
      cat.id === catId
        ? { ...cat, items: [...cat.items, { id: Date.now(), text: text.trim(), done: false, status: null }] }
        : cat
    ))

  const toggleCategory = (catId) =>
    save(categories.map(cat => cat.id === catId ? { ...cat, expanded: !cat.expanded } : cat))

  const deleteItem = (catId, itemId) =>
    save(categories.map(cat =>
      cat.id === catId
        ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
        : cat
    ))

  const updateItem = (catId, itemId, updates) =>
    save(categories.map(cat =>
      cat.id === catId
        ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
        : cat
    ))

  const updateItemStatus = (catId, itemId, status) =>
    save(categories.map(cat =>
      cat.id === catId
        ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, status } : i) }
        : cat
    ))

  const reserveItem = (catId, itemId, name) =>
    save(categories.map(cat =>
      cat.id === catId
        ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, reserved: true, reservedBy: name } : i) }
        : cat
    ))

  const unreserveItem = (catId, itemId) =>
    save(categories.map(cat =>
      cat.id === catId
        ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, reserved: false, reservedBy: null } : i) }
        : cat
    ))

  const deleteCategory = (catId) => save(categories.filter(c => c.id !== catId))

  const updateCategory = (catId, updates) =>
    save(categories.map(cat => cat.id === catId ? { ...cat, ...updates } : cat))

  const reorderCategories = (from, to) => {
    const result = [...categories]
    const [moved] = result.splice(from, 1)
    result.splice(to, 0, moved)
    save(result)
  }

  const handleDragStart = (index) => setDragIndex(index)
  const handleDragOver = (index) => setDragOverIndex(index)
  const handleDrop = (toIndex) => {
    if (dragIndex !== null && dragIndex !== toIndex) reorderCategories(dragIndex, toIndex)
    setDragIndex(null)
    setDragOverIndex(null)
  }
  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const addCategory = () => {
    if (!newCatText.trim()) return
    save([...categories, { id: Date.now(), name: newCatText.trim(), subtitle: '', icon: '📦', expanded: true, items: [] }])
    setNewCatText('')
    setAddingCat(false)
  }

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        title="Lista de regalos"
        subtitle="¡Ayudanos a preparar la llegada del bebé!"
        progress={progress}
        isAdmin={isAdmin}
        onAdminUnlock={handleAdminUnlock}
        onAdminExit={() => setIsAdmin(false)}
      />
      <StatsBar total={total} done={done} pending={pending} />

      <FilterBar
        active={activeFilter}
        onChange={setActiveFilter}
        counts={{
          all: total,
          urgentes: allItems.filter(i => i.status === 'urgente').length,
          pendientes: allItems.filter(i => !i.done).length,
        }}
      />

      <div className="categories-section">
        <p className="section-label">CATEGORÍAS</p>
        {categories.map((cat, index) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            activeFilter={activeFilter}
            isAdmin={isAdmin}
            index={index}
            isDragging={dragIndex === index}
            isDragOver={dragOverIndex === index && dragOverIndex !== dragIndex}
            onDragStart={() => handleDragStart(index)}
            onDragOver={() => handleDragOver(index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            onToggleItem={itemId => toggleItem(cat.id, itemId)}
            onAddItem={text => addItem(cat.id, text)}
            onToggle={() => toggleCategory(cat.id)}
            onDeleteItem={itemId => deleteItem(cat.id, itemId)}
            onUpdateItem={(itemId, updates) => updateItem(cat.id, itemId, updates)}
            onSetItemStatus={(itemId, status) => updateItemStatus(cat.id, itemId, status)}
            onReserveItem={(itemId, name) => reserveItem(cat.id, itemId, name)}
            onUnreserveItem={(itemId) => unreserveItem(cat.id, itemId)}
            onDelete={() => deleteCategory(cat.id)}
            onUpdate={updates => updateCategory(cat.id, updates)}
          />
        ))}

        {isAdmin && addingCat ? (
          <div className="new-cat-row">
            <input
              className="add-item-input"
              placeholder="Nombre de la categoría..."
              value={newCatText}
              autoFocus
              onChange={e => setNewCatText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addCategory()
                if (e.key === 'Escape') setAddingCat(false)
              }}
            />
            <button className="add-item-btn" onClick={addCategory}>+</button>
            <button className="cancel-btn" onClick={() => setAddingCat(false)}>✕</button>
          </div>
        ) : isAdmin ? (
          <button className="add-category-btn" onClick={() => setAddingCat(true)}>
            + Nueva categoría
          </button>
        ) : null}
      </div>
    </div>
  )
}
