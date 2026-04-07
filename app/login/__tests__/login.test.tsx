import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../page'

vi.mock('../actions', () => ({
  sendMagicLink: vi.fn().mockResolvedValue({ success: true }),
}))

describe('LoginPage', () => {
  it('renders email input and submit button', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument()
  })

  it('shows confirmation message after successful submission', async () => {
    render(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText(/you@example\.com/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send magic link/i }))
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument()
  })
})
