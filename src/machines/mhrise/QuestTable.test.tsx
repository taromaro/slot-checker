import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { QuestTable } from "./QuestTable";

// テーブル名（progress の aria-label）から、横に表示されている「xx.x%」を読む
const rateText = (name: string) => screen.getByRole("progressbar", { name }).parentElement?.textContent;

// 4テーブルの「xx.x%」表示をまとめて読む
const rates = () => ({
  tableA: rateText("テーブルA"),
  tableB: rateText("テーブルB"),
  heavenPrep: rateText("天国準備"),
  heaven: rateText("天国"),
});

describe("QuestTable", () => {
  it("タイトルがクエストテーブル", () => {
    render(<QuestTable />);
    expect(screen.getByText("クエストテーブル")).toBeInTheDocument();
  });

  it("初期画面のフィールドは大社跡", () => {
    render(<QuestTable />);
    expect(screen.getByRole("radio", { name: "大社跡" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "寒冷群島" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "溶岩洞" })).not.toBeChecked();
  });

  it("初期画面はクエスト0回目で、割合はすべて 0.0%", () => {
    render(<QuestTable />);
    expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
    expect(rates()).toEqual({ tableA: "0.0%", tableB: "0.0%", heavenPrep: "0.0%", heaven: "0.0%" });
  });

  it("フィールドを選ぶとそのフィールドだけが選択状態になる", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    const field = screen.getByRole("radio", { name: "寒冷群島" });
    await user.click(field);
    expect(field).toBeChecked();
    expect(screen.getByRole("radio", { name: "大社跡" })).not.toBeChecked();
  });

  it("フェイク前兆を押すとクエスト1回目になる", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    expect(screen.getByText("クエスト1回目")).toBeInTheDocument();
  });

  it("大社跡・フェイク前兆の1回目は、フェイク前兆の選択率で割合が出る", async () => {
    // A 89.7 / B 79.7 / 天国準備 67.1 / 天国 0（フェイク前兆なし） 合計 236.5
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    expect(rates()).toEqual({
      tableA: "37.9%",
      tableB: "33.7%",
      heavenPrep: "28.4%",
      heaven: "0.0%",
    });
  });

  it("大社跡・本前兆の1回目は、4テーブルとも 25.0%", async () => {
    // 4テーブルとも 58.9 で同じ
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    expect(rates()).toEqual({
      tableA: "25.0%",
      tableB: "25.0%",
      heavenPrep: "25.0%",
      heaven: "25.0%",
    });
  });

  it("2回目の本前兆は、選んだフィールドで割合が変わる", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    const honZencho = screen.getByRole("button", { name: "本前兆" });
    await user.click(honZencho);
    await user.click(honZencho);
    expect(screen.getByText("クエスト2回目")).toBeInTheDocument();

    // 大社跡: A 25.5 / B 66.7 / 天国準備 25.5 / 天国 0（2回目なし） 合計 117.7
    expect(rates()).toEqual({
      tableA: "21.7%",
      tableB: "56.7%",
      heavenPrep: "21.7%",
      heaven: "0.0%",
    });

    // 寒冷群島: A 66.7 / B 25.5 / 天国準備 66.7 / 天国 0 合計 158.9
    await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
    expect(rates()).toEqual({
      tableA: "42.0%",
      tableB: "16.0%",
      heavenPrep: "42.0%",
      heaven: "0.0%",
    });
  });

  it("クエスト回数は7回目で止まる", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    const honZencho = screen.getByRole("button", { name: "本前兆" });
    for (let i = 0; i < 8; i++) {
      await user.click(honZencho);
    }
    expect(screen.getByText("クエスト7回目")).toBeInTheDocument();
    // 7回目・大社跡・本前兆: A 66.7 / B 25.5 / 天国準備 66.7 / 天国 0 合計 158.9
    expect(rates()).toEqual({
      tableA: "42.0%",
      tableB: "16.0%",
      heavenPrep: "42.0%",
      heaven: "0.0%",
    });
  });
});
