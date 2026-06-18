import { useState, useEffect } from 'react'
import { initialCategories } from './data/initialData'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import CategoryCard from './components/CategoryCard'
import './App.css'

const STORAGE_KEY = 'baby-checklist-v1'

export default function App() {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialCategories
    } catch {
      return initialCategories
    }
  })
  const [newCatText, setNewCatText] = useState('')
  const [addingCat, setAddingCat] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }, [categories])

  const allItems = categories.flatMap(c => c.items)
  const total = allItems.length
  const done = allItems.filter(i => i.done).length
  const pending = total - done
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const toggleItem = (catId, itemId) =>
    setCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item) }
          : cat
      )
    )

  const addItem = (catId, text) =>
    setCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? { ...cat, items: [...cat.items, { id: Date.now(), text: text.trim(), done: false, status: null }] }
          : cat
      )
    )

  const toggleCategory = (catId) =>
    setCategories(cats =>
      cats.map(cat => cat.id === catId ? { ...cat, expanded: !cat.expanded } : cat)
    )

  const deleteItem = (catId, itemId) =>
    setCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
          : cat
      )
    )

  const updateItem = (catId, itemId, newText) =>
    setCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, text: newText } : i) }
          : cat
      )
    )

  const updateItemStatus = (catId, itemId, status) =>
    setCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, status } : i) }
          : cat
      )
    )

  const deleteCategory = (catId) =>
    setCategories(cats => cats.filter(c => c.id !== catId))

  const updateCategory = (catId, updates) =>
    setCategories(cats =>
      cats.map(cat => cat.id === catId ? { ...cat, ...updates } : cat)
    )

  const addCategory = () => {
    if (!newCatText.trim()) return
    setCategories(cats => [
      ...cats,
      { id: Date.now(), name: newCatText.trim(), subtitle: '', icon: '📦', expanded: true, items: [] },
    ])
    setNewCatText('')
    setAddingCat(false)
  }

  return (
    <div className="app">
      <Header
        title="Preparativos para el bebé"
        subtitle="Todo listo antes de que llegue"
        progress={progress}
      />
      <StatsBar total={total} done={done} pending={pending} />

      <div className="categories-section">
        <p className="section-label">CATEGORÍAS</p>
        {categories.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onToggleItem={itemId => toggleItem(cat.id, itemId)}
            onAddItem={text => addItem(cat.id, text)}
            onToggle={() => toggleCategory(cat.id)}
            onDeleteItem={itemId => deleteItem(cat.id, itemId)}
            onUpdateItem={(itemId, text) => updateItem(cat.id, itemId, text)}
            onSetItemStatus={(itemId, status) => updateItemStatus(cat.id, itemId, status)}
            onDelete={() => deleteCategory(cat.id)}
            onUpdate={updates => updateCategory(cat.id, updates)}
          />
        ))}

        {addingCat ? (
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
        ) : (
          <button className="add-category-btn" onClick={() => setAddingCat(true)}>
            + Nueva categoría
          </button>
        )}
      </div>
    </div>
  )
}
