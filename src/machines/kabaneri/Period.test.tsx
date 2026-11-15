import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { Period } from "./Period";

// ＋ボタンの並び順: 非当選 1〜4周期 → 当選 1〜4周期
const MISS = 0;
const WIN = 4;
const plus = (i: number) => screen.getAllByRole("button", { name: "+" })[i];
const valueOf = (label: string) => screen.getByText(label).nextElementSibling?.textContent;
const counts = () =>
  screen.getAllByRole("button", { name: "+" }).map((b) => b.previousElementSibling?.textContent);

describe("Period", () => {
  // カウントは localStorage に保存されるため、テスト間で値が残らないようにする
  beforeEach(() => {
    localStorage.clear();
  });

  it("初期状態では設定1・設定6とも50%、尤度比は1倍", () => {
    render(<Period />);
    expect(valueOf("設定1の確率")).toBe("50.0%");
    expect(valueOf("設定6の確率")).toBe("50.0%");
    expect(valueOf("尤度比(設定1/設定6)")).toBe("1.00倍");
  });

  it("2周期の当選を数えると設定6寄りになる", () => {
    render(<Period />);
    fireEvent.click(plus(WIN + 1));
    // 設定1: 33%, 設定6: 57% → 57 / (33 + 57)
    expect(valueOf("設定6の確率")).toBe("63.3%");
    expect(valueOf("設定1の確率")).toBe("36.7%");
    expect(valueOf("尤度比(設定1/設定6)")).toBe("0.58倍");
  });

  it("2周期の非当選を数えると設定1寄りになる", () => {
    render(<Period />);
    fireEvent.click(plus(MISS + 1));
    // 設定1: 67%, 設定6: 43% → 67 / (67 + 43)
    expect(valueOf("設定1の確率")).toBe("60.9%");
    expect(valueOf("設定6の確率")).toBe("39.1%");
  });

  it("1周期は設定差がないので、数えても50%のまま", () => {
    render(<Period />);
    fireEvent.click(plus(WIN + 0));
    fireEvent.click(plus(MISS + 0));
    expect(valueOf("設定1の確率")).toBe("50.0%");
    expect(valueOf("設定6の確率")).toBe("50.0%");
  });

  it("オールクリアで8つのカウントがすべて0に戻る", () => {
    render(<Period />);
    for (let i = 0; i < 8; i++) fireEvent.click(plus(i));
    expect(counts()).toEqual(Array(8).fill("1"));

    fireEvent.click(screen.getByText("オールクリア"));
    expect(counts()).toEqual(Array(8).fill("0"));
    expect(valueOf("設定6の確率")).toBe("50.0%");
  });

  it("非当選と当選のカウントは別々に保存される", () => {
    const { unmount } = render(<Period />);
    fireEvent.click(plus(MISS + 2));
    fireEvent.click(plus(MISS + 2));
    fireEvent.click(plus(WIN + 2));
    unmount();

    // 再表示（リロード相当）しても、それぞれの値が復元される
    render(<Period />);
    expect(counts()).toEqual(["0", "0", "2", "0", "0", "0", "1", "0"]);
  });
});
