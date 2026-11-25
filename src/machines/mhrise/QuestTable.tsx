import { useState } from "react";

import {
  calcCumulativeTableRates,
  Field,
  FIELD_BG,
  FIELDS,
  INITIAL_QUEST_STATE,
  OMENS,
  predictTableLabel,
  recordOmen,
  TABLE_LABELS,
} from "./questTables";

export const QuestTable = () => {
  // 次のクエストで選ぶフィールド（前兆ボタンを押したときに履歴へ記録する）
  const [field, setField] = useState<Field>("大社跡");
  // 進行中の予想のクエスト履歴と、本前兆で確定した予想
  const [questState, setQuestState] = useState(INITIAL_QUEST_STATE);
  const questCount = questState.history.length;
  const result = calcCumulativeTableRates(questState.history);
  return (
    <section className="rounded-xl border border-gray-300 bg-white p-3">
      <h2 className="mb-2 text-lg font-bold">クエストテーブル</h2>
      <div className="grid grid-cols-3 gap-2">
        {FIELDS.map((item) => (
          <label
            key={item}
            className={`flex cursor-pointer items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm font-bold select-none has-checked:border-4 has-checked:border-red-500 ${FIELD_BG[item]}`}
          >
            <input
              checked={item == field}
              type="radio"
              name="field"
              onChange={() => setField(item)}
            />
            {item}
          </label>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {OMENS.map((item) => (
          <button
            key={item}
            className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-bold transition-colors duration-200 select-none active:bg-yellow-300"
            onClick={() => setQuestState(recordOmen(questState, { field, omen: item }))}
          >
            {item}
          </button>
        ))}
      </div>
      <div>クエスト{questCount}回目</div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-sm">
        <dt className="text-gray-600">テーブルA</dt>
        <dd className="flex items-center gap-2">
          <progress
            aria-label="テーブルA"
            value={result.tableA}
            max={100}
            className="h-3 flex-1 appearance-none overflow-hidden rounded-full bg-gray-200 [&::-moz-progress-bar]:bg-blue-500 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
          />
          <span className="w-14 text-right font-bold tabular-nums">
            {result.tableA.toFixed(1)}%
          </span>
        </dd>
        <dt className="text-gray-600">テーブルB</dt>
        <dd className="flex items-center gap-2">
          <progress
            aria-label="テーブルB"
            value={result.tableB}
            max={100}
            className="h-3 flex-1 appearance-none overflow-hidden rounded-full bg-gray-200 [&::-moz-progress-bar]:bg-blue-500 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
          />
          <span className="w-14 text-right font-bold tabular-nums">
            {result.tableB.toFixed(1)}%
          </span>
        </dd>
        <dt className="text-gray-600">天国準備</dt>
        <dd className="flex items-center gap-2">
          <progress
            aria-label="天国準備"
            value={result.heavenPrep}
            max={100}
            className="h-3 flex-1 appearance-none overflow-hidden rounded-full bg-gray-200 [&::-moz-progress-bar]:bg-blue-500 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
          />
          <span className="w-14 text-right font-bold tabular-nums">
            {result.heavenPrep.toFixed(1)}%
          </span>
        </dd>
        <dt className="text-gray-600">天国</dt>
        <dd className="flex items-center gap-2">
          <progress
            aria-label="天国"
            value={result.heaven}
            max={100}
            className="h-3 flex-1 appearance-none overflow-hidden rounded-full bg-gray-200 [&::-moz-progress-bar]:bg-blue-500 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
          />
          <span className="w-14 text-right font-bold tabular-nums">
            {result.heaven.toFixed(1)}%
          </span>
        </dd>
      </dl>
      {questState.predictions.length > 0 && (
        <ol className="mt-4 flex flex-col gap-2">
          {questState.predictions.map((prediction, index) => (
            <li
              key={index}
              aria-label={`${index + 1}回目のテーブル予想`}
              className="rounded-lg border border-gray-300 bg-gray-50 p-2"
            >
              <h3 className="mb-1 text-sm font-bold">{index + 1}回目のテーブル予想</h3>
              <p className="mb-1 text-xs text-gray-600">
                クエスト{prediction.questCount}回目で本前兆
              </p>
              <dl className="grid grid-cols-4 gap-1 text-center text-xs">
                {TABLE_LABELS.map((row) => (
                  <div key={row.key}>
                    <dt className="text-gray-600">{row.label}</dt>
                    <dd className="font-bold tabular-nums">
                      {prediction.rates[row.key].toFixed(1)}%
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-1 text-sm font-bold text-red-600">
                {predictTableLabel(prediction.rates)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
