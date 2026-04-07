import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeCard from '../RecipeCard'

const recipe = {
  id: 'r1',
  name: 'Dal Tadka',
  prep_time: 35,
  ingredients: [
    { name: 'Red lentils', qty: 200, unit: 'g' },
    { name: 'Cumin', qty: 1, unit: 'tsp' },
  ],
}

describe('RecipeCard', () => {
  it('renders recipe name', () => {
    render(<RecipeCard recipe={recipe} onDelete={vi.fn()} />)
    expect(screen.getByText('Dal Tadka')).toBeInTheDocument()
  })

  it('renders prep time', () => {
    render(<RecipeCard recipe={recipe} onDelete={vi.fn()} />)
    expect(screen.getByText('🕐 35 min')).toBeInTheDocument()
  })

  it('renders ingredient tags', () => {
    render(<RecipeCard recipe={recipe} onDelete={vi.fn()} />)
    expect(screen.getByText(/red lentils/i)).toBeInTheDocument()
    expect(screen.getByText(/cumin/i)).toBeInTheDocument()
  })

  it('calls onDelete with recipe.id when delete clicked', async () => {
    const onDelete = vi.fn()
    render(<RecipeCard recipe={recipe} onDelete={onDelete} />)
    await userEvent.click(screen.getByLabelText('Delete Dal Tadka'))
    expect(onDelete).toHaveBeenCalledWith('r1')
  })
})
