import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddRecipeForm from '../AddRecipeForm'

describe('AddRecipeForm', () => {
  it('renders name input and action buttons', () => {
    render(<AddRecipeForm onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText('Recipe name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save recipe/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls onSave with name and ingredients on submit', async () => {
    const onSave = vi.fn()
    render(<AddRecipeForm onSave={onSave} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('Recipe name'), 'Dal Tadka')
    await userEvent.type(screen.getByLabelText('Ingredient 1 name'), 'Lentils')
    await userEvent.click(screen.getByRole('button', { name: /save recipe/i }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Dal Tadka',
        ingredients: expect.arrayContaining([expect.objectContaining({ name: 'Lentils' })]),
      })
    )
  })

  it('calls onCancel when cancel button clicked', async () => {
    const onCancel = vi.fn()
    render(<AddRecipeForm onSave={vi.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('adds a new ingredient row when + Add ingredient clicked', async () => {
    render(<AddRecipeForm onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getAllByLabelText(/ingredient \d+ name/i)).toHaveLength(1)
    await userEvent.click(screen.getByRole('button', { name: /add ingredient/i }))
    expect(screen.getAllByLabelText(/ingredient \d+ name/i)).toHaveLength(2)
  })
})
