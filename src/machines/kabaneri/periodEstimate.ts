// カバネリ 通常時の周期ごとの当選回数から、設定1と設定6のどちらに近いかを推測する

// 周期ごとの当選率(%) low = 設定1、high = 設定6
export const CYCLES = [
  { name: "1周期", low: 33, high: 33 },
  { name: "2周期", low: 33, high: 57 },
  { name: "3周期", low: 18, high: 37 },
  { name: "4周期", low: 34, high: 47 },
] as const;

export type CycleCount = { win: number; miss: number };

export type Estimate = {
  /** 設定1である確率(0〜1)。事前確率は設定1:設定6 = 50:50 */
  lowPosterior: number;
  /** 設定6である確率(0〜1) */
  highPosterior: number;
  /** 尤度比(設定1/設定6)。設定1のほうが何倍この結果になりやすいか */
  ratio: number;
};

const EPS = 1e-12;

/** 当選率 ratePercent のとき、win 回当選・miss 回非当選となる対数尤度 */
export const logLikelihood = (win: number, miss: number, ratePercent: number) => {
  // p が 0 や 1 になると log が -Infinity / NaN になるため丸める
  const p = Math.min(Math.max(ratePercent / 100, EPS), 1 - EPS);
  return win * Math.log(p) + miss * Math.log(1 - p);
};

/** counts は CYCLES と同じ順（1周期〜4周期） */
export const estimateSetting = (counts: readonly CycleCount[]): Estimate => {
  // 各周期の対数尤度を合計(設定1 / 設定6)
  const logLow = CYCLES.reduce(
    (sum, c, i) => sum + logLikelihood(counts[i]?.win ?? 0, counts[i]?.miss ?? 0, c.low),
    0,
  );
  const logHigh = CYCLES.reduce(
    (sum, c, i) => sum + logLikelihood(counts[i]?.win ?? 0, counts[i]?.miss ?? 0, c.high),
    0,
  );

  // exp のオーバーフローを避けるため、シグモイド形式で計算する
  const diff = logHigh - logLow; // 正なら設定6寄り
  return {
    lowPosterior: 1 / (1 + Math.exp(diff)),
    highPosterior: 1 / (1 + Math.exp(-diff)),
    ratio: Math.exp(-diff),
  };
};

/** 尤度比の表示用(極端な値で Infinity や 0.00 にならないようにする) */
export const formatRatio = (ratio: number) => {
  if (ratio >= 1000) return "1000倍以上";
  if (ratio <= 0.001) return "0.001倍以下";
  // 小さい値は小数2桁だと 0.00 に潰れるため3桁で表示する
  return `${ratio.toFixed(ratio < 0.1 ? 3 : 2)}倍`;
};
