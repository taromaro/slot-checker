import { useCount } from "../hooks/useCount";
import { Stepper } from "./Stepper";

// 周期ごとの当選率(%) low = 設定1、high = 設定6
const CYCLES = [
  { name: "1周期", low: 33, high: 33 },
  { name: "2周期", low: 33, high: 57 },
  { name: "3周期", low: 18, high: 37 },
  { name: "4周期", low: 34, high: 47 },
] as const;

// 対数尤度: 当選w回・非当選m回が起きる確率の対数（アンダーフロー対策）
const logLikelihood = (win: number, miss: number, ratePercent: number) => {
  const p = ratePercent / 100;
  return win * Math.log(p) + miss * Math.log(1 - p);
};

export const Period = () => {
  const missCounters = [useCount(), useCount(), useCount(), useCount()];
  const winCounters = [useCount(), useCount(), useCount(), useCount()];

  const periods = CYCLES.map((cycle, i) => {
    const [miss, onMissPlus, onMissMinus] = missCounters[i];
    const [win, onWinPlus, onWinMinus] = winCounters[i];
    return { ...cycle, miss, onMissPlus, onMissMinus, win, onWinPlus, onWinMinus };
  });

  const logLow = periods.reduce((s, p) => s + logLikelihood(p.win, p.miss, p.low), 0);
  const logHigh = periods.reduce((s, p) => s + logLikelihood(p.win, p.miss, p.high), 0);

  // 設定1のほうが何倍この結果になりやすいか（尤度比）
  const ratio = Math.exp(logLow - logHigh);
  // 事前確率を設定1:設定6 = 50:50 とした場合の事後確率
  const highPosterior = 1 / (1 + ratio);
  const lowPosterior = 1 - highPosterior;

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-3">
      <h2 className="mb-2 text-lg font-bold">通常周期の非当選カウント</h2>
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <Stepper
            key={`miss-${p.name}`}
            name={p.name}
            num={p.miss}
            onIncrement={p.onMissPlus}
            onDecrement={p.onMissMinus}
          />
        ))}
      </div>

      <h2 className="mb-2 mt-3 text-lg font-bold">通常周期の当選カウント</h2>
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <Stepper
            key={`win-${p.name}`}
            name={p.name}
            num={p.win}
            onIncrement={p.onWinPlus}
            onDecrement={p.onWinMinus}
          />
        ))}
      </div>

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-gray-600">設定1の確率</dt>
        <dd className="font-bold">{(lowPosterior * 100).toFixed(1)}%</dd>

        <dt className="text-gray-600">設定6の確率</dt>
        <dd className="font-bold">{(highPosterior * 100).toFixed(1)}%</dd>

        <dt className="text-gray-600">尤度比(設定1/設定6)</dt>
        <dd className="font-bold">{ratio.toFixed(2)}倍</dd>
      </dl>
    </section>
  );
};