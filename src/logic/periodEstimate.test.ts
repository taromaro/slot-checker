import { describe, expect, it } from "vitest";

import {
  CYCLES,
  type CycleCount,
  estimateSetting,
  formatRatio,
  logLikelihood,
} from "./periodEstimate";

const zero: CycleCount = { win: 0, miss: 0 };
/** 指定した周期(0〜3)だけ回数を入れた counts を作る */
const only = (cycle: number, count: Partial<CycleCount>): CycleCount[] =>
  CYCLES.map((_, i) => (i === cycle ? { ...zero, ...count } : zero));

describe("logLikelihood", () => {
  it("回数が0なら0（確率1の対数）", () => {
    expect(logLikelihood(0, 0, 33)).toBeCloseTo(0);
  });

  it("当選1回なら log(当選率)", () => {
    expect(logLikelihood(1, 0, 33)).toBeCloseTo(Math.log(0.33));
  });

  it("非当選1回なら log(1 - 当選率)", () => {
    expect(logLikelihood(0, 1, 33)).toBeCloseTo(Math.log(0.67));
  });

  it("当選率が0%や100%でも有限の値を返す", () => {
    expect(Number.isFinite(logLikelihood(1, 1, 0))).toBe(true);
    expect(Number.isFinite(logLikelihood(1, 1, 100))).toBe(true);
  });
});

describe("estimateSetting", () => {
  it("何も数えていなければ50:50で、尤度比は1", () => {
    const r = estimateSetting(CYCLES.map(() => zero));
    expect(r.lowPosterior).toBeCloseTo(0.5);
    expect(r.highPosterior).toBeCloseTo(0.5);
    expect(r.ratio).toBeCloseTo(1);
  });

  it("1周期は設定差がないので、何回数えても50:50", () => {
    const r = estimateSetting(only(0, { win: 5, miss: 7 }));
    expect(r.highPosterior).toBeCloseTo(0.5);
  });

  it("2周期の当選1回: 設定6 = 57 / (33 + 57)", () => {
    const r = estimateSetting(only(1, { win: 1 }));
    expect(r.highPosterior).toBeCloseTo(57 / 90);
    expect(r.lowPosterior).toBeCloseTo(33 / 90);
    expect(r.ratio).toBeCloseTo(33 / 57);
  });

  it("2周期の非当選1回: 設定1 = 67 / (67 + 43)", () => {
    const r = estimateSetting(only(1, { miss: 1 }));
    expect(r.lowPosterior).toBeCloseTo(67 / 110);
  });

  it("複数の周期の結果を掛け合わせる", () => {
    // 2周期 当選1 + 3周期 非当選1
    const counts = CYCLES.map((_, i) =>
      i === 1 ? { win: 1, miss: 0 } : i === 2 ? { win: 0, miss: 1 } : zero,
    );
    const low = 0.33 * 0.82;
    const high = 0.57 * 0.63;
    const r = estimateSetting(counts);
    expect(r.highPosterior).toBeCloseTo(high / (low + high));
    expect(r.ratio).toBeCloseTo(low / high);
  });

  it("回数が足りない counts は0回として扱う", () => {
    const r = estimateSetting([zero, { win: 1, miss: 0 }]);
    expect(r.highPosterior).toBeCloseTo(57 / 90);
  });

  it("極端な回数でも NaN や Infinity にならず、0〜1に収まる", () => {
    for (const count of [{ win: 10000 }, { miss: 10000 }]) {
      const r = estimateSetting(only(1, count));
      expect(r.lowPosterior).toBeGreaterThanOrEqual(0);
      expect(r.lowPosterior).toBeLessThanOrEqual(1);
      expect(r.highPosterior).toBeGreaterThanOrEqual(0);
      expect(r.highPosterior).toBeLessThanOrEqual(1);
      expect(Number.isNaN(r.ratio)).toBe(false);
    }
  });

  it("どんな回数でも、設定1と設定6の確率の合計は1", () => {
    const values = [0, 1, 3, 10, 50, 300];
    for (const win of values) {
      for (const miss of values) {
        for (let cycle = 0; cycle < CYCLES.length; cycle++) {
          const r = estimateSetting(only(cycle, { win, miss }));
          expect(r.lowPosterior + r.highPosterior).toBeCloseTo(1);
        }
      }
    }
  });
});

describe("formatRatio", () => {
  it("通常は小数2桁で表示する", () => {
    expect(formatRatio(1)).toBe("1.00倍");
    expect(formatRatio(0.579)).toBe("0.58倍");
    expect(formatRatio(999.994)).toBe("999.99倍");
  });

  it("1000以上は「1000倍以上」", () => {
    expect(formatRatio(1000)).toBe("1000倍以上");
    expect(formatRatio(Infinity)).toBe("1000倍以上");
  });

  it("0.001以下は「0.001倍以下」", () => {
    expect(formatRatio(0.001)).toBe("0.001倍以下");
    expect(formatRatio(0)).toBe("0.001倍以下");
  });

  it("0.1未満は小数3桁で表示し、0.00倍にならない", () => {
    expect(formatRatio(0.0011)).toBe("0.001倍");
    expect(formatRatio(0.0049)).toBe("0.005倍");
    expect(formatRatio(0.05)).toBe("0.050倍");
  });
});
