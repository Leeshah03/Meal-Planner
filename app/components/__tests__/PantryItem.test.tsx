import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PantryItem from '../PantryItem'

const item = { id: '1', name: 'Spinach', quantity: 2, unit: 'bag' }

describe('PantryItem', () => {
  it('renders item name and quantity', () => {
    render(<PantryItem item={item} onAdjust={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Spinach')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('bag')).toBeInTheDocument()
  })

  it('calls onAdjust(-1) when decrease button clicked', async () => {
    const onAdjust = vi.fn()
    render(<PantryItem item={item} onAdjust={onAdjust} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('Decrease quantity'))
    expect(onAdjust).toHaveBeenCalledWith(-1)
  })

  it('calls onAdjust(1) when increase button clicked', async () => {
    const onAdjust = vi.fn()
    render(<PantryItem item={item} onAdjust={onAdjust} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('Increase quantity'))
    expect(onAdjust).toHaveBeenCalledWith(1)
  })

  it('calls onDelete when delete button clicked', async () => {
    const onDelete = vi.fn()
    render(<PantryItem item={item} onAdjust={vi.fn()} onDelete={onDelete} />)
    await userEvent.click(screen.getByLabelText('Delete item'))
    expect(onDelete).toHaveBeenCalled()
  })
})
