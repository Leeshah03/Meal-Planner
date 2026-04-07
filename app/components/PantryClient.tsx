'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import PantryItem from './PantryItem'
import { addPantryItemAction, updateQuantityAction, deletePantryItemAction } from '@/app/actions'
import type { PantryItem as PantryItemType } from '@/lib/types'

interface PantryClientProps {
  initialItems: PantryItemType[]
}

export default function PantryClient({ initialItems }: PantryClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleAdd = () => {
    if (!name.trim()) return
    setShowForm(false)
    setName(''); setQty(''); setUnit('')
    startTransition(async () => {
      try {
        await addPantryItemAction(name.trim(), parseFloat(qty) || 1, unit.trim())
      } catch {
        toast.error('Failed to add pantry item.')
      }
    })
  }

  const handleAdjust = (id: string, delta: number) => {
    startTransition(async () => {
      try {
        await updateQuantityAction(id, delta)
      } catch {
        toast.error('Failed to update quantity.')
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deletePantryItemAction(id)
      } catch {
        toast.error('Failed to delete pantry item.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Pantry</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--color-green)' }}
        >
          + Add
        </button>
      </div>

      {showForm && (
        <div
          className="rounded-xl border-2 border-dashed p-4 mb-4"
          style={{ borderColor: 'var(--color-green-mid)', background: 'var(--color-card)' }}
        >
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
              style={{ borderColor: 'var(--color-border)' }}
              placeholder="Item name"
              value={name}
              onChange={e => setName(e.target.value)}
              aria-label="Pantry item name"
            />
            <input
              className="w-20 px-3 py-2 border rounded-lg text-sm outline-none"
              style={{ borderColor: 'var(--color-border)' }}
              type="number"
              placeholder="Qty"
              value={qty}
              onChange={e => setQty(e.target.value)}
              aria-label="Quantity"
            />
            <input
              className="w-16 px-3 py-2 border rounded-lg text-sm outline-none"
              style={{ borderColor: 'var(--color-border)' }}
              placeholder="Unit"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              aria-label="Unit"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-sm border rounded-lg"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-sm font-semibold text-white rounded-lg"
              style={{ background: 'var(--color-green)' }}
            >
              Add to Pantry
            </button>
          </div>
        </div>
      )}

      {initialItems.length === 0 && !showForm ? (
        <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
          <div className="text-4xl mb-3">🧺</div>
          <p>Add items you already have at home</p>
        </div>
      ) : (
        <div className="space-y-2">
          {initialItems.map(item => (
            <PantryItem
              key={item.id}
              item={item}
              onAdjust={(delta) => handleAdjust(item.id, delta)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {isPending && (
        <p className="text-xs text-center mt-3" style={{ color: 'var(--color-muted)' }}>Saving…</p>
      )}
    </div>
  )
}
