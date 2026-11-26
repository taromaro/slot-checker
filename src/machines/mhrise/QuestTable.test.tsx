import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { QuestTable } from "./QuestTable";

// テーブル名（progress の aria-label）から、横に表示されている「xx.x%」を読む
const rateText = (name: string) =>
  screen.getByRole("progressbar", { name }).parentElement?.textContent;

// 4テーブルの「xx.x%」表示をまとめて読む
const rates = () => ({
  tableA: rateText("テーブルA"),
  tableB: rateText("テーブルB"),
  heavenPrep: rateText("天国準備"),
  heaven: rateText("天国"),
});

// 確定した n 回目のテーブル予想から、4テーブルの「xx.x%」表示をまとめて読む
const predictionRates = (n: number) => {
  const item = screen.getByRole("listitem", { name: `${n}回目のテーブル予想` });
  const read = (label: string) => within(item).getByText(label).nextElementSibling?.textContent;
  return {
    tableA: read("テーブルA"),
    tableB: read("テーブルB"),
    heavenPrep: read("天国準備"),
    heaven: read("天国"),
  };
};

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
    // A・B・天国準備とも（100 − 0.4）を掛けるので比は変わらない
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

  it("大社跡・本前兆の1回目は、成功期待度の差でほぼ天国になる", async () => {
    // 選択率は4テーブルとも 58.9。成功期待度が A・B・天国準備 0.4 / 天国 100
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    expect(predictionRates(1)).toEqual({
      tableA: "0.4%",
      tableB: "0.4%",
      heavenPrep: "0.4%",
      heaven: "98.8%",
    });
  });

  it("本前兆で確定すると、進行中の予想はクエスト0回目・すべて 0.0% に戻る", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
    expect(rates()).toEqual({
      tableA: "0.0%",
      tableB: "0.0%",
      heavenPrep: "0.0%",
      heaven: "0.0%",
    });
  });

  it("確定した予想は、1回目と2回目の（期待度 × 選択率）を掛け合わせた割合になる", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    // 1回目 大社跡・フェイク前兆 → 2回目 寒冷群島・本前兆
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
    await user.click(screen.getByRole("button", { name: "本前兆" }));

    // A 99.6×89.7 × 30.1×66.7 / B 99.6×79.7 × 9.8×25.5 / 天国準備 99.6×67.1 × 25.0×66.7 / 天国 0
    expect(predictionRates(1)).toEqual({
      tableA: "57.7%",
      tableB: "6.4%",
      heavenPrep: "35.9%",
      heaven: "0.0%",
    });
  });

  it("前兆を押した後にフィールドを変えても、記録済みの割合は変わらない", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
    // 1回目 大社跡・フェイク前兆 のまま
    expect(rates()).toEqual({
      tableA: "37.9%",
      tableB: "33.7%",
      heavenPrep: "28.4%",
      heaven: "0.0%",
    });
  });

  it("フェイク前兆は6回目で止まる（7回目にフェイク前兆はない）", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    const fake = screen.getByRole("button", { name: "フェイク前兆" });
    for (let i = 0; i < 8; i++) {
      await user.click(fake);
    }
    expect(screen.getByText("クエスト6回目")).toBeInTheDocument();
    // 大社跡・フェイク前兆を6回
    // 各回（100 − 成功期待度）× フェイク前兆の選択率 を6回分掛ける。天国は 0
    // A 99.6×89.7 × 69.9×9.7 × 90.2×90 × 55.1×9.7 × 90.2×90 × 69.9×9.7
    // B 99.6×79.7 × 90.2×90 × 50×9.7 × 90.2×90 × 50×9.7 × 90.2×90
    // 天国準備 99.6×67.1 × 75×7.1 × 50×90 × 25×7.1 × 50×90 × 25×7.1
    expect(rates()).toEqual({
      tableA: "12.6%",
      tableB: "87.2%",
      heavenPrep: "0.2%",
      heaven: "0.0%",
    });
  });

  it("フェイク前兆6回のあと、7回目の本前兆で予想が確定する", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    const fake = screen.getByRole("button", { name: "フェイク前兆" });
    for (let i = 0; i < 6; i++) {
      await user.click(fake);
    }
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    // 上の6回分に、7回目 大社跡・本前兆 A 100×66.7 / B 100×25.5 / 天国準備 100×66.7 を掛ける
    expect(predictionRates(1)).toEqual({
      tableA: "27.4%",
      tableB: "72.2%",
      heavenPrep: "0.4%",
      heaven: "0.0%",
    });
    expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
  });

  it("確定した予想には、一番可能性が高いテーブル名が書かれる", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    // 1回目 大社跡・フェイク前兆 → 2回目 寒冷群島・本前兆 で確定（A 47.9% が最大）
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    const item = screen.getByRole("listitem", { name: "1回目のテーブル予想" });
    expect(item).toHaveTextContent("テーブルAと予想。");
  });

  it("1回目に本前兆で確定すると「天国と予想。」と書かれる", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    const item = screen.getByRole("listitem", { name: "1回目のテーブル予想" });
    expect(item).toHaveTextContent("天国と予想。");
  });

  it("フェイク前兆2回→本前兆で確定すると「クエスト3回目で本前兆」、続けて本前兆で2件目は「クエスト1回目で本前兆」", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    const first = screen.getByRole("listitem", { name: "1回目のテーブル予想" });
    expect(within(first).getByText("クエスト3回目で本前兆")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "本前兆" }));
    const second = screen.getByRole("listitem", { name: "2回目のテーブル予想" });
    expect(within(second).getByText("クエスト1回目で本前兆")).toBeInTheDocument();
    expect(within(second).queryByText("クエスト3回目で本前兆")).not.toBeInTheDocument();
    expect(second).toHaveTextContent("天国と予想。");
    expect(predictionRates(2)).toEqual({
      tableA: "0.4%",
      tableB: "0.4%",
      heavenPrep: "0.4%",
      heaven: "98.8%",
    });
  });

  it("フェイク前兆を8回押しても、本前兆で確定すると「クエスト7回目で本前兆」になり割合は6回分＋本前兆", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    const fake = screen.getByRole("button", { name: "フェイク前兆" });
    for (let i = 0; i < 8; i++) {
      await user.click(fake);
    }
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    expect(screen.getByRole("radio", { name: "大社跡" })).toBeChecked();
    const first = screen.getByRole("listitem", { name: "1回目のテーブル予想" });
    expect(within(first).getByText("クエスト7回目で本前兆")).toBeInTheDocument();
    expect(predictionRates(1)).toEqual({
      tableA: "27.4%",
      tableB: "72.2%",
      heavenPrep: "0.4%",
      heaven: "0.0%",
    });
  });

  it("確定した予想が1個のときは、設定推測に見出しと案内文だけを出し、割合は出さない", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    // 大社跡・フェイク前兆 → 寒冷群島・本前兆
    await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
    await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
    await user.click(screen.getByRole("button", { name: "本前兆" }));
    const section = screen.getByLabelText("設定推測");
    expect(section.tagName).toBe("SECTION");
    expect(within(section).getByText("設定推測")).toBeInTheDocument();
    expect(
      within(section).getByText("本前兆2回目から設定の割合を表示します。"),
    ).toBeInTheDocument();
    for (let i = 1; i <= 6; i++) {
      expect(within(section).queryByText(`設定${i}`)).not.toBeInTheDocument();
    }
    expect(section).not.toHaveTextContent("%");
  });

  it("確定した予想が2個になると、設定推測に設定1〜設定6の割合を出し、案内文は消える", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    // 大社跡・フェイク前兆 → 寒冷群島・本前兆 を2セット
    for (let i = 0; i < 2; i++) {
      await user.click(screen.getByRole("radio", { name: "大社跡" }));
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
      await user.click(screen.getByRole("button", { name: "本前兆" }));
    }
    const section = screen.getByLabelText("設定推測");
    expect(section.tagName).toBe("SECTION");
    expect(within(section).getByText("設定推測")).toBeInTheDocument();
    // dt（設定n）の次の dd を読み、ラベルと値の対応を確かめる
    const read = (label: string) => {
      const dt = within(section).getByText(label);
      expect(dt.tagName).toBe("DT");
      const dd = dt.nextElementSibling;
      expect(dd?.tagName).toBe("DD");
      return dd?.textContent;
    };
    expect({
      s1: read("設定1"),
      s2: read("設定2"),
      s3: read("設定3"),
      s4: read("設定4"),
      s5: read("設定5"),
      s6: read("設定6"),
    }).toEqual({
      s1: "21.5%",
      s2: "21.0%",
      s3: "20.5%",
      s4: "14.6%",
      s5: "11.8%",
      s6: "10.7%",
    });
    expect(screen.queryByText("本前兆2回目から設定の割合を表示します。")).not.toBeInTheDocument();
  });

  it("確定した予想が0個（初期表示）のときは、設定推測を出さない", () => {
    render(<QuestTable />);
    expect(screen.queryByLabelText("設定推測")).toBeNull();
  });

  it("設定推測は、確定したテーブル予想を含まず、それらより後ろに出る", async () => {
    render(<QuestTable />);
    const user = userEvent.setup();
    // 大社跡・フェイク前兆 → 寒冷群島・本前兆 を2セット
    for (let i = 0; i < 2; i++) {
      await user.click(screen.getByRole("radio", { name: "大社跡" }));
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
      await user.click(screen.getByRole("button", { name: "本前兆" }));
    }
    const section = screen.getByLabelText("設定推測");
    for (const n of [1, 2]) {
      const item = screen.getByRole("listitem", { name: `${n}回目のテーブル予想` });
      expect(section.contains(item)).toBe(false);
      expect(item.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  describe("一つ前に戻す", () => {
    const undoButton = () => screen.getByRole("button", { name: "一つ前に戻す" });

    it("初期表示では「一つ前に戻す」ボタンが disabled", () => {
      render(<QuestTable />);
      expect(undoButton()).toBeDisabled();
    });

    it("前兆ボタンを押すと「一つ前に戻す」ボタンが押せるようになる", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      expect(undoButton()).toBeEnabled();
    });

    it("フェイク前兆1回→戻すと、クエスト0回目・割合すべて 0.0% に戻り、ボタンは disabled になる", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      await user.click(undoButton());
      expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
      expect(rates()).toEqual({
        tableA: "0.0%",
        tableB: "0.0%",
        heavenPrep: "0.0%",
        heaven: "0.0%",
      });
      expect(undoButton()).toBeDisabled();
    });

    it("フェイク前兆2回→戻す1回で、クエスト1回目・1回目の割合に戻る", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      const fake = screen.getByRole("button", { name: "フェイク前兆" });
      await user.click(fake);
      await user.click(fake);
      await user.click(undoButton());
      expect(screen.getByText("クエスト1回目")).toBeInTheDocument();
      expect(rates()).toEqual({
        tableA: "37.9%",
        tableB: "33.7%",
        heavenPrep: "28.4%",
        heaven: "0.0%",
      });
      expect(undoButton()).toBeEnabled();
    });

    it("フェイク前兆2回→戻す2回で、クエスト0回目に戻り、ボタンは disabled になる", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      const fake = screen.getByRole("button", { name: "フェイク前兆" });
      await user.click(fake);
      await user.click(fake);
      await user.click(undoButton());
      await user.click(undoButton());
      expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
      expect(rates()).toEqual({
        tableA: "0.0%",
        tableB: "0.0%",
        heavenPrep: "0.0%",
        heaven: "0.0%",
      });
      expect(undoButton()).toBeDisabled();
    });

    it("本前兆で確定した後に戻すと、確定した予想が消え、進行中の予想は本前兆を押す前の履歴に戻る", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      await user.click(screen.getByRole("button", { name: "本前兆" }));
      expect(screen.getByRole("listitem", { name: "1回目のテーブル予想" })).toBeInTheDocument();

      await user.click(undoButton());
      expect(
        screen.queryByRole("listitem", { name: "1回目のテーブル予想" }),
      ).not.toBeInTheDocument();
      expect(screen.getByText("クエスト1回目")).toBeInTheDocument();
      expect(rates()).toEqual({
        tableA: "37.9%",
        tableB: "33.7%",
        heavenPrep: "28.4%",
        heaven: "0.0%",
      });
      expect(undoButton()).toBeEnabled();
    });

    it("1回目に本前兆で確定→戻すと、予想が消え、クエスト0回目で設定推測も出なくなる", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "本前兆" }));
      await user.click(undoButton());
      expect(
        screen.queryByRole("listitem", { name: "1回目のテーブル予想" }),
      ).not.toBeInTheDocument();
      expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
      expect(rates()).toEqual({
        tableA: "0.0%",
        tableB: "0.0%",
        heavenPrep: "0.0%",
        heaven: "0.0%",
      });
      expect(screen.queryByLabelText("設定推測")).toBeNull();
      expect(undoButton()).toBeDisabled();
    });

    it("確定した予想が2個→戻すと1個になり、設定推測は割合表示から案内文表示に戻る", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      // 大社跡・フェイク前兆 → 寒冷群島・本前兆 を2セット
      for (let i = 0; i < 2; i++) {
        await user.click(screen.getByRole("radio", { name: "大社跡" }));
        await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
        await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
        await user.click(screen.getByRole("button", { name: "本前兆" }));
      }
      await user.click(undoButton());

      expect(screen.getByRole("listitem", { name: "1回目のテーブル予想" })).toBeInTheDocument();
      expect(
        screen.queryByRole("listitem", { name: "2回目のテーブル予想" }),
      ).not.toBeInTheDocument();
      // 1回目の確定内容は変わらない
      expect(predictionRates(1)).toEqual({
        tableA: "57.7%",
        tableB: "6.4%",
        heavenPrep: "35.9%",
        heaven: "0.0%",
      });
      // 進行中は2セット目の 大社跡・フェイク前兆 1回分
      expect(screen.getByText("クエスト1回目")).toBeInTheDocument();
      expect(rates()).toEqual({
        tableA: "37.9%",
        tableB: "33.7%",
        heavenPrep: "28.4%",
        heaven: "0.0%",
      });
      const section = screen.getByLabelText("設定推測");
      expect(
        within(section).getByText("本前兆2回目から設定の割合を表示します。"),
      ).toBeInTheDocument();
      for (let i = 1; i <= 6; i++) {
        expect(within(section).queryByText(`設定${i}`)).not.toBeInTheDocument();
      }
      expect(section).not.toHaveTextContent("%");
    });

    it("フェイク前兆を7回押す（7回目は止まる）→戻す1回で、クエスト5回目になる", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      const fake = screen.getByRole("button", { name: "フェイク前兆" });
      for (let i = 0; i < 7; i++) {
        await user.click(fake);
      }
      expect(screen.getByText("クエスト6回目")).toBeInTheDocument();
      await user.click(undoButton());
      expect(screen.getByText("クエスト5回目")).toBeInTheDocument();
    });

    it("フェイク前兆を8回押す→戻す6回で、クエスト0回目に戻り、ボタンは disabled になる", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      const fake = screen.getByRole("button", { name: "フェイク前兆" });
      for (let i = 0; i < 8; i++) {
        await user.click(fake);
      }
      for (let i = 0; i < 6; i++) {
        await user.click(undoButton());
      }
      expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
      expect(undoButton()).toBeDisabled();
    });

    it("フィールドを選んだだけでは戻す対象にならず、ボタンは disabled のまま", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
      expect(undoButton()).toBeDisabled();
    });

    it("戻しても、現在選んでいるフィールドは変わらない", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      // 大社跡でフェイク前兆 → 寒冷群島に変更 → 戻す
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
      await user.click(undoButton());
      expect(screen.getByRole("radio", { name: "寒冷群島" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "大社跡" })).not.toBeChecked();
      expect(screen.getByText("クエスト0回目")).toBeInTheDocument();
    });

    it("フィールド変更をはさんでも、戻すのは前兆ボタンの操作1回ぶんだけ", async () => {
      render(<QuestTable />);
      const user = userEvent.setup();
      // 大社跡・フェイク前兆 → 寒冷群島・フェイク前兆 → 溶岩洞に変更 → 戻す1回
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      await user.click(screen.getByRole("radio", { name: "寒冷群島" }));
      await user.click(screen.getByRole("button", { name: "フェイク前兆" }));
      await user.click(screen.getByRole("radio", { name: "溶岩洞" }));
      await user.click(undoButton());
      // 1回目 大社跡・フェイク前兆 の状態に戻る
      expect(screen.getByText("クエスト1回目")).toBeInTheDocument();
      expect(rates()).toEqual({
        tableA: "37.9%",
        tableB: "33.7%",
        heavenPrep: "28.4%",
        heaven: "0.0%",
      });
      expect(screen.getByRole("radio", { name: "溶岩洞" })).toBeChecked();
      expect(undoButton()).toBeEnabled();
    });
  });
});
