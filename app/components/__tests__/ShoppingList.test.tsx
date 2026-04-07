import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShoppingList from '../ShoppingList'

const grouped = {
  Produce: [{ name: 'Tomatoes', qty: 2, unit: '' }],
  'Pantry Staples': [{ name: 'Olive oil', qty: 1, unit: 'tbsp' }],
}

describe('ShoppingList', () => {
  it('renders category section titles', () => {
    render(<ShoppingList grouped={grouped} haveAlready={[]} />)
    expect(screen.getByText('Produce')).toBeInTheDocument()
    expect(screen.getByText('Pantry Staples')).toBeInTheDocument()
  })

  it('renders ingredient names', () => {
    render(<ShoppingList grouped={grouped} haveAlready={[]} />)
    expect(screen.getByText('Tomatoes')).toBeInTheDocument()
    expect(screen.getByText('Olive oil')).toBeInTheDocument()
  })

  it('toggles bought state when checkbox clicked', async () => {
    render(<ShoppingList grouped={grouped} haveAlready={[]} />)
    const checkbox = screen.getByRole('checkbox', { name: /tomatoes/i })
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('shows haveAlready items in pantry section', () => {
    render(<ShoppingList grouped={{}} haveAlready={[{ name: 'Spinach', qty: 1, unit: 'bag' }]} />)
    expect(screen.getByText(/already in your pantry/i)).toBeInTheDocument()
    expect(screen.getByText('Spinach')).toBeInTheDocument()
  })

  it('shows empty state when no items', () => {
    render(<ShoppingList grouped={{}} haveAlready={[]} />)
    expect(screen.getByText(/plan some dinners/i)).toBeInTheDocument()
  })
})
