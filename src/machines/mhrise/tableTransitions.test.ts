import { describe, expect, it } from "vitest";

import { SETTINGS, TABLE_KEYS, TABLE_TRANSITION_RATES } from "./tableTransitions";

// 出典: なな徹「滞在テーブル別の移行率」
// 行=設定1〜6、列=移行先 A / B / 天国準備 / 天国
const EXPECTED: Record<string, number[][]> = {
  tableA: [
    [50.0, 22.7, 7.0, 20.3],
    [48.8, 23.0, 7.4, 20.8],
    [47.7, 23.4, 7.8, 21.1],
    [34.0, 23.8, 18.8, 23.4],
    [27.4, 24.2, 24.2, 24.2],
    [25.0, 25.0, 25.0, 25.0],
  ],
  tableB: [
    [0, 50.0, 25.0, 25.0],
    [0, 49.2, 25.4, 25.4],
    [0, 48.4, 25.8, 25.8],
    [0, 39.0, 30.5, 30.5],
    [0, 35.2, 32.4, 32.4],
    [0, 33.6, 33.2, 33.2],
  ],
  heavenPrep: [
    [0, 0, 25.0, 75.0],
    [0, 0, 24.6, 75.4],
    [0, 0, 24.2, 75.8],
    [0, 0, 22.3, 77.7],
    [0, 0, 20.7, 79.3],
    [0, 0, 19.9, 80.1],
  ],
  heaven: [
    [50.0, 6.3, 6.3, 37.4],
    [49.2, 6.7, 6.7, 37.4],
    [48.4, 7.1, 7.1, 37.4],
    [36.8, 9.4, 16.4, 37.4],
    [31.7, 11.8, 19.1, 37.4],
    [30.1, 12.5, 20.0, 37.4],
  ],
};

const FROM_KEYS = ["tableA", "tableB", "heavenPrep", "heaven"] as const;
const SETTING_LIST = [1, 2, 3, 4, 5, 6] as const;

const cases = FROM_KEYS.flatMap((from) =>
  SETTING_LIST.flatMap((setting) =>
    FROM_KEYS.map((to, toIdx) => ({
      from,
      setting,
      to,
      expected: EXPECTED[from][setting - 1][toIdx],
    })),
  ),
);

const pairs = FROM_KEYS.flatMap((from) => SETTING_LIST.map((setting) => ({ from, setting })));

describe("SETTINGS / TABLE_KEYS", () => {
  it("SETTINGS は 1〜6 を昇順で持つ", () => {
    expect(SETTINGS).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("TABLE_KEYS は A / B / 天国準備 / 天国 の順", () => {
    expect(TABLE_KEYS).toEqual(["tableA", "tableB", "heavenPrep", "heaven"]);
  });
});

describe("TABLE_TRANSITION_RATES", () => {
  it("滞在テーブルのキーは4テーブルちょうど", () => {
    expect(Object.keys(TABLE_TRANSITION_RATES).sort()).toEqual([...FROM_KEYS].sort());
  });

  it.each(pairs)("$from 設定$setting: 設定キーと移行先4キーをすべて持つ", ({ from, setting }) => {
    expect(Object.keys(TABLE_TRANSITION_RATES[from]).sort()).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
    expect(Object.keys(TABLE_TRANSITION_RATES[from][setting]).sort()).toEqual(
      [...FROM_KEYS].sort(),
    );
  });

  it("96値ある", () => {
    expect(cases).toHaveLength(96);
  });

  it.each(cases)("$from 設定$setting → $to は $expected%", ({ from, setting, to, expected }) => {
    expect(TABLE_TRANSITION_RATES[from][setting][to]).toBeCloseTo(expected, 5);
  });

  it.each(pairs)("$from 設定$setting: 合計が 100", ({ from, setting }) => {
    const row = TABLE_TRANSITION_RATES[from][setting];
    const sum = FROM_KEYS.reduce((acc, to) => acc + row[to], 0);
    expect(sum).toBeCloseTo(100, 5);
  });

  it.each(cases)("$from 設定$setting → $to は 0 以上 100 以下の有限数", ({ from, setting, to }) => {
    const v = TABLE_TRANSITION_RATES[from][setting][to];
    expect(typeof v).toBe("number");
    expect(Number.isFinite(v)).toBe(true);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(100);
  });

  describe("天国に着くまでは下のテーブルに落ちない", () => {
    it.each(SETTING_LIST)("設定%i: テーブルB → テーブルA は 0", (s) => {
      expect(TABLE_TRANSITION_RATES.tableB[s].tableA).toBe(0);
    });

    it.each(SETTING_LIST)("設定%i: 天国準備 → テーブルA は 0", (s) => {
      expect(TABLE_TRANSITION_RATES.heavenPrep[s].tableA).toBe(0);
    });

    it.each(SETTING_LIST)("設定%i: 天国準備 → テーブルB は 0", (s) => {
      expect(TABLE_TRANSITION_RATES.heavenPrep[s].tableB).toBe(0);
    });
  });

  it.each(SETTING_LIST)("設定%i: 天国 → 天国 は 37.4（設定差なし）", (s) => {
    expect(TABLE_TRANSITION_RATES.heaven[s].heaven).toBeCloseTo(37.4, 5);
  });
});
