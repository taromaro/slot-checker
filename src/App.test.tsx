import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import App from "./App";

const goTo = (hash: string) => {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
};

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = "";
  });

  afterEach(() => {
    window.location.hash = "";
  });

  it("最初はホーム画面で、機種の一覧が表示される", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("機種選択");
    const link = screen.getByRole("link", { name: "カバネリ" });
    expect(link).toHaveAttribute("href", "#/kabaneri");
    // ホームでは機種のカウンターは表示されない
    expect(screen.queryByRole("heading", { name: "無名" })).not.toBeInTheDocument();
  });

  it("機種を選ぶと、その機種の設定判別ページが開く", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("link", { name: "カバネリ" }));
    expect(window.location.hash).toBe("#/kabaneri");
    goTo("#/kabaneri"); // jsdom はリンククリックで hashchange を発火しないため明示的に発火
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("カバネリ");
    for (const name of ["無名", "生駒", "通常周期の非当選カウント", "下段ベル"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("機種ページから「機種選択へ戻る」でホームに戻れる", () => {
    window.location.hash = "#/kabaneri";
    render(<App />);
    const back = screen.getByRole("link", { name: "← 機種選択へ戻る" });
    expect(back).toHaveAttribute("href", "#/");
    goTo("#/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("機種選択");
  });

  it("ホームにモンハンライズが表示され、選ぶと機種ページが開く", () => {
    render(<App />);
    const links = screen.getAllByRole("link").map((a) => a.textContent);
    expect(links).toEqual(["カバネリ", "モンハンライズ"]);
    expect(screen.getByRole("link", { name: "モンハンライズ" })).toHaveAttribute(
      "href",
      "#/mhrise",
    );
    goTo("#/mhrise");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("モンハンライズ");
    expect(screen.getByText("準備中")).toBeInTheDocument();
  });

  it("存在しない機種のハッシュならホーム画面を表示する", () => {
    window.location.hash = "#/unknown";
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("機種選択");
  });

  it("ホームに戻って再度開いても、カウントは保持される", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/kabaneri";
    render(<App />);
    const gedan = () => screen.getByRole("heading", { name: "下段ベル" }).closest("section")!;
    await user.click(within(gedan()).getByRole("button", { name: "+" }));
    await user.click(within(gedan()).getByRole("button", { name: "+" }));
    goTo("#/");
    expect(screen.queryByRole("heading", { name: "下段ベル" })).not.toBeInTheDocument();
    goTo("#/kabaneri");
    expect(within(gedan()).getByText("2")).toBeInTheDocument();
  });
});
