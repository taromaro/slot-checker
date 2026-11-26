import { describe } from "vitest";

import {
  calcCumulativeTableRates,
  calcTableRates,
  INITIAL_QUEST_STATE,
  predictTableLabel,
  recordOmen,
} from "./questTables";

describe("calcTableRates", () => {
  it("フェイク前兆は（100 − 成功期待度）× フェイク前兆の選択率で割合を出す", () => {
    // 2回目・大社跡: A 69.9×9.7 / B 90.2×90.0 / 天国準備 75.0×7.1 / 天国 0（2回目なし）
    expect(calcTableRates(2, "大社跡", "フェイク前兆")).toEqual({
      tableA: expect.closeTo(7.27, 2),
      tableB: expect.closeTo(87.02, 2),
      heavenPrep: expect.closeTo(5.71, 2),
      heaven: 0,
    });
  });

  it("本前兆は 成功期待度 × 本前兆の選択率で割合を出す（選択率が同じでも期待度で差が付く）", () => {
    // 1回目・大社跡: A・B・天国準備 0.4×58.9 / 天国 100×58.9
    expect(calcTableRates(1, "大社跡", "本前兆")).toEqual({
      tableA: expect.closeTo(0.3953, 4),
      tableB: expect.closeTo(0.3953, 4),
      heavenPrep: expect.closeTo(0.3953, 4),
      heaven: expect.closeTo(98.814, 3),
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

describe("calcCumulativeTableRates", () => {
  it("履歴が空ならすべて 0", () => {
    expect(calcCumulativeTableRates([])).toEqual({
      tableA: 0,
      tableB: 0,
      heavenPrep: 0,
      heaven: 0,
    });
  });

  it("1回分だけなら、その回の値だけで割合を出す", () => {
    expect(calcCumulativeTableRates([{ field: "大社跡", omen: "フェイク前兆" }])).toEqual(
      calcTableRates(1, "大社跡", "フェイク前兆"),
    );
  });

  it("1回目 大社跡・フェイク前兆 → 2回目 寒冷群島・本前兆 は、2回分の（期待度 × 選択率）の積で割合を出す", () => {
    // A: 99.6×89.7 × 30.1×66.7 / B: 99.6×79.7 × 9.8×25.5 / 天国準備: 99.6×67.1 × 25.0×66.7 / 天国: 0
    expect(
      calcCumulativeTableRates([
        { field: "大社跡", omen: "フェイク前兆" },
        { field: "寒冷群島", omen: "本前兆" },
      ]),
    ).toEqual({
      tableA: expect.closeTo(57.74, 2),
      tableB: expect.closeTo(6.39, 2),
      heavenPrep: expect.closeTo(35.87, 2),
      heaven: 0,
    });
  });

  it("1回目の値が A・B・天国準備で同じなら、2回目の値だけで決まる。天国は2回目がないので 0", () => {
    // 1回目 大社跡・本前兆は A・B・天国準備とも 0.4×58.9
    // 2回目 大社跡・本前兆は A 30.1×25.5 / B 9.8×66.7 / 天国準備 25.0×25.5 / 天国なし
    expect(
      calcCumulativeTableRates([
        { field: "大社跡", omen: "本前兆" },
        { field: "大社跡", omen: "本前兆" },
      ]),
    ).toEqual({
      tableA: expect.closeTo(37.28, 2),
      tableB: expect.closeTo(31.75, 2),
      heavenPrep: expect.closeTo(30.97, 2),
      heaven: 0,
    });
  });

  it("どのテーブルでもあり得ない履歴（7回目のフェイク前兆）はすべて 0", () => {
    const history = Array.from({ length: 7 }, (_, i) => ({
      field: "大社跡" as const,
      omen: i < 6 ? ("本前兆" as const) : ("フェイク前兆" as const),
    }));
    expect(calcCumulativeTableRates(history)).toEqual({
      tableA: 0,
      tableB: 0,
      heavenPrep: 0,
      heaven: 0,
    });
  });
});

describe("recordOmen", () => {
  it("フェイク前兆は履歴に追加し、予想はまだ確定しない", () => {
    const state = recordOmen(INITIAL_QUEST_STATE, { field: "大社跡", omen: "フェイク前兆" });
    expect(state).toEqual({
      history: [{ field: "大社跡", omen: "フェイク前兆" }],
      predictions: [],
    });
  });

  it("本前兆は、その回も含めた履歴で予想を確定し、履歴を空にする", () => {
    const afterFake = recordOmen(INITIAL_QUEST_STATE, { field: "大社跡", omen: "フェイク前兆" });
    const state = recordOmen(afterFake, { field: "寒冷群島", omen: "本前兆" });
    expect(state).toEqual({
      history: [],
      predictions: [
        {
          questCount: 2,
          rates: calcCumulativeTableRates([
            { field: "大社跡", omen: "フェイク前兆" },
            { field: "寒冷群島", omen: "本前兆" },
          ]),
        },
      ],
    });
  });

  it("確定した予想は、本前兆のたびに後ろへ追加される", () => {
    const first = recordOmen(INITIAL_QUEST_STATE, { field: "大社跡", omen: "フェイク前兆" });
    const second = recordOmen(first, { field: "大社跡", omen: "本前兆" });
    const third = recordOmen(second, { field: "溶岩洞", omen: "本前兆" });
    expect(third.predictions).toEqual([
      {
        questCount: 2,
        rates: calcCumulativeTableRates([
          { field: "大社跡", omen: "フェイク前兆" },
          { field: "大社跡", omen: "本前兆" },
        ]),
      },
      {
        questCount: 1,
        rates: calcCumulativeTableRates([{ field: "溶岩洞", omen: "本前兆" }]),
      },
    ]);
    expect(third.history).toEqual([]);
  });

  it("6回目までフェイク前兆のあと、7回目のフェイク前兆は記録しない", () => {
    let state = INITIAL_QUEST_STATE;
    for (let i = 0; i < 6; i++) {
      state = recordOmen(state, { field: "大社跡", omen: "フェイク前兆" });
    }
    expect(state.history).toHaveLength(6);
    expect(recordOmen(state, { field: "大社跡", omen: "フェイク前兆" })).toBe(state);
  });

  it("6回目までフェイク前兆のあとでも、7回目の本前兆は確定できる", () => {
    let state = INITIAL_QUEST_STATE;
    for (let i = 0; i < 6; i++) {
      state = recordOmen(state, { field: "大社跡", omen: "フェイク前兆" });
    }
    const finished = recordOmen(state, { field: "大社跡", omen: "本前兆" });
    expect(finished.history).toEqual([]);
    expect(finished.predictions).toEqual([
      {
        questCount: 7,
        rates: calcCumulativeTableRates([...state.history, { field: "大社跡", omen: "本前兆" }]),
      },
    ]);
  });

  it("1回目で本前兆なら questCount は 1", () => {
    const state = recordOmen(INITIAL_QUEST_STATE, { field: "大社跡", omen: "本前兆" });
    expect(state.predictions).toEqual([
      {
        questCount: 1,
        rates: calcCumulativeTableRates([{ field: "大社跡", omen: "本前兆" }]),
      },
    ]);
  });

  it("予想が確定したあとは 1 回目から数え直す", () => {
    let state = INITIAL_QUEST_STATE;
    state = recordOmen(state, { field: "大社跡", omen: "フェイク前兆" });
    state = recordOmen(state, { field: "大社跡", omen: "本前兆" });
    state = recordOmen(state, { field: "大社跡", omen: "本前兆" });
    state = recordOmen(state, { field: "大社跡", omen: "フェイク前兆" });
    state = recordOmen(state, { field: "大社跡", omen: "フェイク前兆" });
    state = recordOmen(state, { field: "大社跡", omen: "本前兆" });
    expect(state.predictions.map((p) => p.questCount)).toEqual([2, 1, 3]);
  });
});

describe("predictTableLabel", () => {
  it("一番割合が高いテーブル名を「テーブルXと予想。」で返す", () => {
    expect(predictTableLabel({ tableA: 47.9, tableB: 16.3, heavenPrep: 35.8, heaven: 0 })).toBe(
      "テーブルAと予想。",
    );
    expect(predictTableLabel({ tableA: 10, tableB: 60, heavenPrep: 30, heaven: 0 })).toBe(
      "テーブルBと予想。",
    );
  });

  it("天国準備・天国が一番高ければ、その名前で予想する", () => {
    expect(predictTableLabel({ tableA: 10, tableB: 20, heavenPrep: 70, heaven: 0 })).toBe(
      "天国準備と予想。",
    );
    expect(predictTableLabel({ tableA: 10, tableB: 20, heavenPrep: 30, heaven: 40 })).toBe(
      "天国と予想。",
    );
  });

  it("4テーブルとも全く同じ割合なら「全テーブルの可能性あり。」", () => {
    expect(predictTableLabel({ tableA: 25, tableB: 25, heavenPrep: 25, heaven: 25 })).toBe(
      "全テーブルの可能性あり。",
    );
  });

  it("1回目・本前兆の履歴は、成功期待度 100% の天国を予想する", () => {
    expect(predictTableLabel(calcCumulativeTableRates([{ field: "大社跡", omen: "本前兆" }]))).toBe(
      "天国と予想。",
    );
  });

  it("一部だけ同率で一番高い場合は、表示順で先のテーブルを予想する", () => {
    expect(predictTableLabel({ tableA: 10, tableB: 45, heavenPrep: 45, heaven: 0 })).toBe(
      "テーブルBと予想。",
    );
  });
});
