import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChancemeCount } from './ChancemeCount'

describe('ChancemeCount', () => {
  it('名前と数値が表示される', () => {
    render(<ChancemeCount name="太郎" color="red"/>)
    expect(screen.getByText('太郎')).toBeInTheDocument()
  })

  it('＋を押すとポイント合計が増える', () => {
    render(<ChancemeCount name="太郎" color="red" />)
    fireEvent.click(screen.getAllByRole('button', { name: '+' })[0])
    expect(screen.getByText('ポイント合計:')).toBeInTheDocument()
  })

  it('ポイントクリアを押すとポイントが0になる', () => {
    render(<ChancemeCount name="太郎" color="red" />)
    fireEvent.click(screen.getByText("ポイントクリア"))
    expect(screen.getByText('ポイント合計:')).toBeInTheDocument()
  })
})