import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MealPicker from '../MealPicker'

const recipes = [
  { id: '1', name: 'Dal Tadka', ingredients: [], prep_time: 35 },
  { id: '2', name: 'Veggie Pasta', ingredients: [], prep_time: 25 },
]

const baseProps = {
  recipes,
  dayName: 'Monday',
  onSelect: vi.fn(),
  onClose: vi.fn(),
}

describe('MealPicker', () => {
  it('renders the day name in the title', () => {
    render(<MealPicker {...baseProps} />)
    expect(screen.getByText(/pick dinner for monday/i)).toBeInTheDocument()
  })

  it('renders all recipes initially', () => {
    render(<MealPicker {...baseProps} />)
    expect(screen.getByText('Dal Tadka')).toBeInTheDocument()
    expect(screen.getByText('Veggie Pasta')).toBeInTheDocument()
  })

  it('filters recipes as user types', async () => {
    render(<MealPicker {...baseProps} />)
    await userEvent.type(screen.getByPlaceholderText(/search/i), 'dal')
    expect(screen.getByText('Dal Tadka')).toBeInTheDocument()
    expect(screen.queryByText('Veggie Pasta')).not.toBeInTheDocument()
  })

  it('calls onSelect with recipe id when a recipe is clicked', async () => {
    const onSelect = vi.fn()
    render(<MealPicker {...baseProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Dal Tadka'))
    expect(onSelect).toHaveBeenCalledWith('1')
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<MealPicker {...baseProps} onClose={onClose} />)
    await userEvent.click(screen.getByText(/pick dinner for monday/i).closest('[class*="fixed"]')!)
    expect(onClose).toHaveBeenCalled()
  })
})
