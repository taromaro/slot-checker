import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCount } from "./useCount";

describe("useCount", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("初期値は0", () => {
    const { result } = renderHook(() => useCount());
    expect(result.current[0]).toBe(0);
  });

  it("加算メソッドを呼ぶと1増える", () => {
    const { result } = renderHook(() => useCount());
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(1);
  });

  it("加算・減算は引数の数だけ増減する", () => {
    const { result } = renderHook(() => useCount());
    act(() => result.current[1](15));
    act(() => result.current[2](4));
    expect(result.current[0]).toBe(11);
  });

  it("減算は引数なしなら1減る", () => {
    const { result } = renderHook(() => useCount());
    act(() => result.current[1](3));
    act(() => result.current[2]());
    expect(result.current[0]).toBe(2);
  });

  it("リセットで0に戻る", () => {
    const { result } = renderHook(() => useCount());
    act(() => result.current[1](5));
    act(() => result.current[3]());
    expect(result.current[0]).toBe(0);
  });

  describe("localStorage への保存", () => {
    it("storageKey を指定すると値が保存され、次回はその値から始まる", () => {
      const first = renderHook(() => useCount("key"));
      act(() => first.result.current[1](7));
      expect(localStorage.getItem("key")).toBe("7");
      first.unmount();

      const second = renderHook(() => useCount("key"));
      expect(second.result.current[0]).toBe(7);
    });

    it("storageKey を指定しなければ保存しない", () => {
      const { result } = renderHook(() => useCount());
      act(() => result.current[1]());
      expect(localStorage.length).toBe(0);
    });

    it("保存値が数値でなければ0から始まる", () => {
      localStorage.setItem("key", "abc");
      const { result } = renderHook(() => useCount("key"));
      expect(result.current[0]).toBe(0);
    });

    it("localStorage が使えない環境（例外を投げる）でも動く", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      const { result } = renderHook(() => useCount("key"));
      expect(result.current[0]).toBe(0);
      act(() => result.current[1]());
      expect(result.current[0]).toBe(1);
    });
  });
});
