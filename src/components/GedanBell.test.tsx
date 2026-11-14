import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { GedanBell } from "./GedanBell";

describe("GedanBell", () => {
  // 回数・ゲーム数は localStorage に保存されるため、テスト間で値が残らないようにする
  beforeEach(() => {
    localStorage.clear();
  });

  it("初期表示では確率が-になる", () => {
    render(<GedanBell />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("回数とゲーム数を入力すると確率が表示される", async () => {
    const user = userEvent.setup();
    render(<GedanBell />);

    // 3回カウントアップ
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "+" }));

    // ゲーム数を入力
    await user.type(screen.getByLabelText("トータルゲーム数"), "300");

    // 300 / 3 = 100.00
    expect(screen.getByText("1/100.00")).toBeInTheDocument();
  });

  it("ゲーム数が未入力なら、回数を増やしても確率は - のまま", async () => {
    const user = userEvent.setup();
    render(<GedanBell />);
    await user.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
