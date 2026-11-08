import { useCount } from "../hooks/useCount";
import { Stepper } from "./Stepper";

// 周期ごとの当選率(%) low = 設定1、high = 設定6
const CYCLES = [
  { name: "1周期", low: 33, high: 33 },
  { name: "2周期", low: 33, high: 57 },
  { name: "3周期", low: 18, high: 37 },
  { name: "4周期", low: 34, high: 47 },
] as const;

// 非当選がcount回続く確率の対数（小さい数のかけ算によるアンダーフロー対策）
const logMissProb = (count: number, winRatePercent: number) => count * Math.log(1 - winRatePercent / 100);
const formatProb = (p: number) => `${(p * 100).toFixed(2)}%`;
export const Period = () => { const counters = [useCount(), useCount(), useCount(), useCount()];

  const periods = CYCLES.map((cycle, i) => {
    const [num, onPlus, onMinus] = counters[i];
    return { ...cycle, num, onPlus, onMinus };
  });

  const logLow = periods.reduce((sum, p) => sum + logMissProb(p.num, p.low), 0);
  const logHigh = periods.reduce((sum, p) => sum + logMissProb(p.num, p.high), 0);

  const lowProb = Math.exp(logLow); // 設定1でこの結果になる確率
  const highProb = Math.exp(logHigh); // 設定6でこの結果になる確率
  const ratio = Math.exp(logLow - logHigh); // 設定1のほうが何倍起きやすいか
  const highPosterior = 1 / (1 + ratio); // 設定1/6が五分五分だった場合に設定6である確率

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-3">
      <h2 className="mb-2 text-lg font-bold">通常周期の非当選カウント</h2>

      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <Stepper
            key={p.name}
            name={p.name}
            num={p.num}
            onIncrement={p.onPlus}
            onDecrement={p.onMinus}
          />
        ))}
      </div>

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-gray-600">設定1</dt>
        <dd className="font-bold">{formatProb(lowProb)}</dd>

        <dt className="text-gray-600">設定6</dt>
        <dd className="font-bold">{formatProb(highProb)}</dd>

        <dt className="text-gray-600">設定6の確率</dt>
        <dd className="font-bold">{(highPosterior * 100).toFixed(1)}%</dd>
      </dl>
    </section>
  );
};