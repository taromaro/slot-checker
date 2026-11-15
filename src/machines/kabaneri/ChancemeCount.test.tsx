import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ChancemeCount } from "./ChancemeCount";

// ボタンの並び順: 発光無し, 発光, 1p, 15p（各 Stepper に − と + がある）
const NON_HAKKOU = 0;
const HAKKOU = 1;
const P1 = 2;
const P15 = 3;
const plus = (i: number) => screen.getAllByRole("button", { name: "+" })[i];
const minus = (i: number) => screen.getAllByRole("button", { name: "−" })[i];
const totalPoint = () => screen.getByText("ポイント合計:").querySelector("span")?.textContent;
const hakkouRitu = () => screen.getByText("発光率:").querySelector("span")?.textContent;
const counts = () =>
  screen.getAllByRole("button", { name: "+" }).map((b) => b.previousElementSibling?.textContent);

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

  it("発光率は 発光 / (発光無し + 発光) で、最初は0%", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    expect(hakkouRitu()).toBe("0.0%");
    fireEvent.click(plus(NON_HAKKOU));
    fireEvent.click(plus(HAKKOU));
    expect(hakkouRitu()).toBe("50.0%");
    fireEvent.click(plus(NON_HAKKOU));
    expect(hakkouRitu()).toBe("33.3%");
  });

  it("1p・15p は合計ポイントには加わるが、発光率には影響しない", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    fireEvent.click(plus(P1));
    fireEvent.click(plus(P15));
    expect(totalPoint()).toBe("16");
    expect(hakkouRitu()).toBe("0.0%");
  });

  it("オールクリアで4項目と合計がすべて0になる", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    for (const i of [NON_HAKKOU, HAKKOU, P1, P15]) fireEvent.click(plus(i));
    fireEvent.click(screen.getByText("オールクリア"));
    expect(counts()).toEqual(["0", "0", "0", "0"]);
    expect(totalPoint()).toBe("0");
  });

  it("ポイントクリアは合計だけを0にし、各項目の回数は残す", () => {
    render(<ChancemeCount name="太郎" color="red" />);
    fireEvent.click(plus(HAKKOU));
    fireEvent.click(screen.getByText("ポイントクリア"));
    expect(counts()).toEqual(["0", "1", "0", "0"]);
  });

  it("名前が違えば値は共有されない（無名と生駒が干渉しない）", () => {
    const { unmount } = render(<ChancemeCount name="無名" color="red" />);
    fireEvent.click(plus(HAKKOU));
    unmount();
    render(<ChancemeCount name="生駒" color="green" />);
    expect(counts()).toEqual(["0", "0", "0", "0"]);
    expect(totalPoint()).toBe("0");
  });

  it("再表示（リロード相当）しても値が復元される", () => {
    const { unmount } = render(<ChancemeCount name="太郎" color="red" />);
    fireEvent.click(plus(HAKKOU));
    fireEvent.click(plus(P1));
    unmount();
    render(<ChancemeCount name="太郎" color="red" />);
    expect(counts()).toEqual(["0", "1", "1", "0"]);
    expect(totalPoint()).toBe("16");
  });
});
