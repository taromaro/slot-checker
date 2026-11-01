import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CountUp } from './CountUp'

describe('CountUp', () => {
  it('名前と数値が表示される', () => {
    render(<CountUp name="太郎" num={1} />)
    expect(screen.getByText('太郎')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('クリックするとonClickが1回呼ばれる', () => {
    const handleClick = vi.fn()
    render(<CountUp name="太郎" num={1} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})