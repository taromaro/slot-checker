import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCount } from './useCount'

describe('useCount', () => {
  it('初期値は0', () => {
    const { result } = renderHook(() => useCount())
    expect(result.current[0]).toBe(0)
  })

  it('加算メソッドを呼ぶと1増える', () => {
    const { result } = renderHook(() => useCount())
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(1)
  })
})