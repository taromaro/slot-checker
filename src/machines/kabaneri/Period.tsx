import { Stepper } from "../../components/Stepper";
import { useCount } from "../../hooks/useCount";
import { CYCLES, estimateSetting, formatRatio } from "./periodEstimate";

export const Period = () => {
  // 非当選・当選でストレージキーが被らないよう、キー名を分ける
  const [missFirst, missFirstPlus, missFirstMinus, resetMissFirst] = useCount(
    `${CYCLES[0].name}-miss`,
  );
  const [missSecond, missSecondPlus, missSecondMinus, resetMissSecond] = useCount(
    `${CYCLES[1].name}-miss`,
  );
  const [missThird, missThirdPlus, missThirdMinus, resetMissThird] = useCount(
    `${CYCLES[2].name}-miss`,
  );
  const [missFourth, missFourthPlus, missFourthMinus, resetMissFourth] = useCount(
    `${CYCLES[3].name}-miss`,
  );

  const [winFirst, winFirstPlus, winFirstMinus, resetWinFirst] = useCount(`${CYCLES[0].name}-win`);
  const [winSecond, winSecondPlus, winSecondMinus, resetWinSecond] = useCount(
    `${CYCLES[1].name}-win`,
  );
  const [winThird, winThirdPlus, winThirdMinus, resetWinThird] = useCount(`${CYCLES[2].name}-win`);
  const [winFourth, winFourthPlus, winFourthMinus, resetWinFourth] = useCount(
    `${CYCLES[3].name}-win`,
  );

  const periods = [
    {
      ...CYCLES[0],
      miss: missFirst,
      win: winFirst,
      onMissPlus: missFirstPlus,
      onMissMinus: missFirstMinus,
      onWinPlus: winFirstPlus,
      onWinMinus: winFirstMinus,
    },
    {
      ...CYCLES[1],
      miss: missSecond,
      win: winSecond,
      onMissPlus: missSecondPlus,
      onMissMinus: missSecondMinus,
      onWinPlus: winSecondPlus,
      onWinMinus: winSecondMinus,
    },
    {
      ...CYCLES[2],
      miss: missThird,
      win: winThird,
      onMissPlus: missThirdPlus,
      onMissMinus: missThirdMinus,
      onWinPlus: winThirdPlus,
      onWinMinus: winThirdMinus,
    },
    {
      ...CYCLES[3],
      miss: missFourth,
      win: winFourth,
      onMissPlus: missFourthPlus,
      onMissMinus: missFourthMinus,
      onWinPlus: winFourthPlus,
      onWinMinus: winFourthMinus,
    },
  ];

  const { lowPosterior, highPosterior, ratio } = estimateSetting(periods);

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

      <h2 className="mt-3 mb-2 text-lg font-bold">通常周期の当選カウント</h2>
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
        <dd className="font-bold">{formatRatio(ratio)}</dd>
      </dl>
      <button
        onClick={() => {
          resetMissFirst();
          resetMissSecond();
          resetMissThird();
          resetMissFourth();
          resetWinFirst();
          resetWinSecond();
          resetWinThird();
          resetWinFourth();
        }}
        className="mb-2 cursor-pointer rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm text-white select-none hover:bg-red-700 active:bg-red-800"
      >
        オールクリア
      </button>
    </section>
  );
};
