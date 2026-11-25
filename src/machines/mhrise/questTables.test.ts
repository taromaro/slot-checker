import { describe } from "vitest";

import { calcTableRates } from "./questTables";

describe("tableSelectionRate", () => {
  it("2回目・大社跡・フェイク前兆なら、選択率 9.7 / 90.0 / 7.1 / 0 の割合になる", () => {
    expect(calcTableRates(2, "大社跡", "フェイク前兆")).toEqual({
      tableA: expect.closeTo(9.08, 2),
      tableB: expect.closeTo(84.27, 2),
      heavenPrep: expect.closeTo(6.65, 2),
      heaven: 0,
    });
  });

  it("1回目が本前兆", () => {
    expect(calcTableRates(1, "大社跡", "本前兆")).toEqual({
      tableA: expect.closeTo(25, 2),
      tableB: expect.closeTo(25, 2),
      heavenPrep: expect.closeTo(25, 2),
      heaven: expect.closeTo(25, 2),
    });
  });

  it("クエスト回数が0ならすべて0", () => {
    expect(calcTableRates(0, "大社跡", "本前兆")).toEqual({
      tableA: expect.closeTo(0),
      tableB: expect.closeTo(0),
      heavenPrep: expect.closeTo(0),
      heaven: expect.closeTo(0),
    });
  });

  it("クエスト回数7回目は本前兆のみ", () => {
    expect(calcTableRates(7, "大社跡", "フェイク前兆")).toEqual({
      tableA: expect.closeTo(0),
      tableB: expect.closeTo(0),
      heavenPrep: expect.closeTo(0),
      heaven: expect.closeTo(0),
    });
  });

  it("クエスト回数8回目は存在しないため0", () => {
    expect(calcTableRates(8, "大社跡", "フェイク前兆")).toEqual({
      tableA: expect.closeTo(0),
      tableB: expect.closeTo(0),
      heavenPrep: expect.closeTo(0),
      heaven: expect.closeTo(0),
    });
  });
});
