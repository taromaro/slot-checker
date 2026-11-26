import { describe, expect, it } from "vitest";

import type { TableRates } from "./questTables";
import { calcSettingRates } from "./settingEstimation";
import type { Setting } from "./tableTransitions";

const t = (rates: Partial<TableRates>): TableRates => ({
  tableA: 0,
  tableB: 0,
  heavenPrep: 0,
  heaven: 0,
  ...rates,
});

const ALL_ZERO = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
const SETTING_KEYS = ["1", "2", "3", "4", "5", "6"];

// キーが 1〜6 ちょうどで、各値が小数4桁で一致することを表す期待オブジェクト
const closeTo = (expected: number[]) =>
  Object.fromEntries(expected.map((v, i) => [i + 1, expect.closeTo(v, 4)]));

const sum = (r: Record<Setting, number>) => Object.values(r).reduce((a, b) => a + b, 0);

const CASE3 = [t({ tableA: 100 }), t({ heaven: 100 })];
const CASE3_EXPECTED = [15.059347, 15.430267, 15.652819, 17.35905, 17.952522, 18.545994];

const CASE5 = [
  t({ tableA: 25, tableB: 25, heavenPrep: 25, heaven: 25 }),
  t({ tableA: 25, tableB: 25, heavenPrep: 25, heaven: 25 }),
];

const CASE6 = [t({ tableA: 100 }), t({ tableA: 100 }), t({ tableA: 100 })];
const CASE6_EXPECTED = [25.803815, 24.580095, 23.484465, 11.931684, 7.748989, 6.450954];

const CASE7 = [t({ tableA: 100 }), t({ tableA: 50, heaven: 50 }), t({ heaven: 100 })];
// 真ん中は A と天国が同率なので、先の A とみなして A → A → 天国
const CASE7_EXPECTED = [19.823483, 19.824264, 19.656888, 15.538486, 12.950301, 12.206578];

describe("calcSettingRates", () => {
  describe("移り方がない場合", () => {
    it("予想 0 個なら全設定 0", () => {
      expect(calcSettingRates([])).toEqual(ALL_ZERO);
    });

    it("予想 1 個なら全設定 0", () => {
      expect(calcSettingRates([t({ tableA: 100 })])).toEqual(ALL_ZERO);
    });
  });

  describe("あり得ない移り方", () => {
    it("天国準備 100% → テーブルA 100% は見込み合計 0 なので全設定 0（NaN にならない）", () => {
      const result = calcSettingRates([t({ heavenPrep: 100 }), t({ tableA: 100 })]);
      expect(result).toEqual(ALL_ZERO);
      Object.values(result).forEach((v) => expect(Number.isNaN(v)).toBe(false));
    });
  });

  describe("期待値", () => {
    it("テーブルA → 天国 は A→天国 の移行率をそのまま割り振った値", () => {
      expect(calcSettingRates(CASE3)).toEqual(closeTo(CASE3_EXPECTED));
    });

    it("4テーブル 25% ずつ → 25% ずつ はどれとも決められないので全設定 0", () => {
      expect(calcSettingRates(CASE5)).toEqual(ALL_ZERO);
    });

    it("テーブルA → A → A（3個、2回の移行を連鎖して掛ける）", () => {
      expect(calcSettingRates(CASE6)).toEqual(closeTo(CASE6_EXPECTED));
    });

    it("テーブルA → {A 50%, 天国 50%} → 天国 は同率の真ん中を A とみなし A → A → 天国 で計算する", () => {
      expect(calcSettingRates(CASE7)).toEqual(closeTo(CASE7_EXPECTED));
    });

    it("{A 60%, 天国準備 40%} → {A 40%, 天国準備 60%} は割合を混ぜず A → 天国準備 とみなす", () => {
      const result = calcSettingRates([
        t({ tableA: 60, heavenPrep: 40 }),
        t({ tableA: 40, heavenPrep: 60 }),
      ]);
      expect(result).toEqual(
        closeTo([7.760532, 8.203991, 8.64745, 20.842572, 26.829268, 27.716186]),
      );
    });

    it("混ざった予想 {A 57.74, B 6.386, 天国準備 35.874} が2つ続くと A → A とみなす", () => {
      const mixed = t({ tableA: 57.74, tableB: 6.386, heavenPrep: 35.874 });
      expect(calcSettingRates([mixed, { ...mixed }])).toEqual(
        closeTo([21.468441, 20.953199, 20.480893, 14.59854, 11.764706, 10.734221]),
      );
    });
  });

  describe("性質", () => {
    it.each([
      ["ケース3", CASE3],
      ["ケース6", CASE6],
      ["ケース7", CASE7],
    ])("%s: 合計 100、キーは 1〜6 ちょうど", (_, predictions) => {
      const result = calcSettingRates(predictions);
      expect(Object.keys(result).sort()).toEqual(SETTING_KEYS);
      expect(sum(result)).toBeCloseTo(100, 6);
    });

    it("予想の割合の倍率を変えても結果は同じ（合計 1 のスケール）", () => {
      const result = calcSettingRates([t({ tableA: 1 }), t({ heaven: 1 })]);
      expect(result).toEqual(closeTo(CASE3_EXPECTED));
    });

    it("予想ごとに倍率が異なっても結果は同じ（ケース7を予想ごとに別倍率）", () => {
      const result = calcSettingRates([
        t({ tableA: 3 }),
        t({ tableA: 0.5, heaven: 0.5 }),
        t({ heaven: 1000 }),
      ]);
      expect(result).toEqual(closeTo(CASE7_EXPECTED));
    });

    it("入力配列を変更しない", () => {
      const predictions = [t({ tableA: 100 }), t({ tableA: 50, heaven: 50 })];
      const snapshot = JSON.parse(JSON.stringify(predictions));
      calcSettingRates(predictions);
      expect(predictions).toEqual(snapshot);
    });
  });
});
