import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useHashPath } from "./useHashPath";

const setHash = (hash: string) => {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
};

describe("useHashPath", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("ハッシュが無いときは空文字", () => {
    const { result } = renderHook(() => useHashPath());
    expect(result.current).toBe("");
  });

  it("#/kabaneri なら kabaneri を返す", () => {
    window.location.hash = "#/kabaneri";
    const { result } = renderHook(() => useHashPath());
    expect(result.current).toBe("kabaneri");
  });

  it("先頭のスラッシュが無い #kabaneri でも kabaneri を返す", () => {
    window.location.hash = "#kabaneri";
    const { result } = renderHook(() => useHashPath());
    expect(result.current).toBe("kabaneri");
  });

  it("ハッシュが変わると値が更新される", () => {
    const { result } = renderHook(() => useHashPath());
    setHash("#/kabaneri");
    expect(result.current).toBe("kabaneri");
    setHash("");
    expect(result.current).toBe("");
  });

  it("アンマウント後はハッシュ変更を購読しない", () => {
    const { result, unmount } = renderHook(() => useHashPath());
    unmount();
    setHash("#/kabaneri");
    expect(result.current).toBe("");
  });
});
