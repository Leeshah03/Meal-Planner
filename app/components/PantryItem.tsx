'use client'

import type { PantryItem as PantryItemType } from '@/lib/types'

interface PantryItemProps {
  item: PantryItemType
  onAdjust: (delta: number) => void
  onDelete: () => void
}

export default function PantryItem({ item, onAdjust, onDelete }: PantryItemProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      <span className="flex-1 text-[15px] font-medium">{item.name}</span>

      <div className="flex items-center gap-2">
        <button
          aria-label="Decrease quantity"
          onClick={() => onAdjust(-1)}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-lg transition-colors"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        >
          −
        </button>
        <span className="text-[15px] font-semibold min-w-[50px] text-center">
          {item.quantity}
          {item.unit && <span className="text-xs font-normal ml-1" style={{ color: 'var(--color-muted)' }}>{item.unit}</span>}
        </span>
        <button
          aria-label="Increase quantity"
          onClick={() => onAdjust(1)}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-lg transition-colors"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        >
          +
        </button>
      </div>

      <button
        aria-label="Delete item"
        onClick={onDelete}
        className="p-1.5 rounded-md text-base transition-colors"
        style={{ color: 'var(--color-muted)' }}
      >
        🗑
      </button>
    </div>
  )
}
