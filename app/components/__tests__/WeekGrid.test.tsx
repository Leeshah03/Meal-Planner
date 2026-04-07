import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WeekGrid from '../WeekGrid'

const baseProps = {
  weekPlan: [],
  weekStart: '2026-04-05', // a Sunday
  onEdit: vi.fn(),
  onClear: vi.fn(),
}

describe('WeekGrid', () => {
  it('renders 7 day cards', () => {
    render(<WeekGrid {...baseProps} />)
    expect(screen.getAllByRole('article')).toHaveLength(7)
  })

  it('shows recipe name when day has a recipe', () => {
    const weekPlan = [{
      id: '1', week_start: '2026-04-05', day: 0, recipe_id: 'r1',
      recipes: { id: 'r1', name: 'Dal Tadka', ingredients: [], prep_time: 35 }
    }]
    render(<WeekGrid {...baseProps} weekPlan={weekPlan} />)
    expect(screen.getByText('Dal Tadka')).toBeInTheDocument()
    expect(screen.getByText('🕐 35 min')).toBeInTheDocument()
  })

  it('shows empty state text for unplanned days', () => {
    render(<WeekGrid {...baseProps} />)
    const emptySlots = screen.getAllByText('Tap to add dinner')
    expect(emptySlots).toHaveLength(7)
  })

  it('calls onEdit with correct day index', async () => {
    const onEdit = vi.fn()
    render(<WeekGrid {...baseProps} onEdit={onEdit} />)
    await userEvent.click(screen.getAllByLabelText(/^Edit/)[0])
    expect(onEdit).toHaveBeenCalledWith(0)
  })

  it('calls onClear with correct day index for a filled day', async () => {
    const onClear = vi.fn()
    const weekPlan = [{
      id: '1', week_start: '2026-04-05', day: 1, recipe_id: 'r1',
      recipes: { id: 'r1', name: 'Pasta', ingredients: [], prep_time: 20 }
    }]
    render(<WeekGrid {...baseProps} weekPlan={weekPlan} onClear={onClear} />)
    await userEvent.click(screen.getByLabelText('Clear Mon'))
    expect(onClear).toHaveBeenCalledWith(1)
  })
})
