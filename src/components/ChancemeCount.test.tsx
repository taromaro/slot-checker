import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ChancemeCount } from "./ChancemeCount";

// ボタンの並び順: 発光無し, 発光, 1p, 15p（各 Stepper に − と + がある）
const HAKKOU = 1;
const plus = (i: number) => screen.getAllByRole("button", { name: "+" })[i];
const minus = (i: number) => screen.getAllByRole("button", { name: "−" })[i];
const totalPoint = () => screen.getByText("ポイント合計:").querySelector("span")?.textContent;

describe("ChancemeCount", () => {
  // カウントは localStorage に保存されるため、テスト間で値が残らないようにする
  beforeEach(() => {
    localStorage.clear();
  });

  it("名前と数値が表示される", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    expect(screen.getByText("太郎")).toBeInTheDocument();
  });

  it("＋を押すとその項目のポイント分だけ合計が増える", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    fireEvent.click(plus(HAKKOU));
    expect(totalPoint()).toBe("15");
  });

  it("−を押すとその項目のポイント分だけ合計が減る", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    fireEvent.click(plus(HAKKOU));
    fireEvent.click(plus(HAKKOU));
    fireEvent.click(minus(HAKKOU));
    expect(totalPoint()).toBe("15");
  });

  it("ポイントクリア後に−を押しても合計はマイナスにならない", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    fireEvent.click(plus(HAKKOU));
    fireEvent.click(screen.getByText("ポイントクリア"));
    fireEvent.click(minus(HAKKOU));
    expect(totalPoint()).toBe("0");
  });

  it("ポイントクリアを押すと合計が0になる", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    fireEvent.click(plus(HAKKOU));
    fireEvent.click(screen.getByText("ポイントクリア"));
    expect(totalPoint()).toBe("0");
  });
});
