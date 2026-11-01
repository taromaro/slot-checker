import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePoint } from './usePoint'

describe('usePoint', () => {
  it('初期値は0', () => {
    const { result } = renderHook(() => usePoint())
    expect(result.current[0]).toBe(0)
  })

  it('加算メソッドを呼ぶと1増える', () => {
    const { result } = renderHook(() => usePoint())
    act(() => {
      result.current[1](10)
    })
    expect(result.current[0]).toBe(10)
  })
})