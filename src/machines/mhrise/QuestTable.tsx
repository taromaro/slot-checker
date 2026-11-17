import { useState } from "react";

import { calcTableRates, Field, FIELD_BG, FIELDS, OMENS } from "./questTables";

export const QuestTable = () => {
  const [questCount, setQuestCount] = useState(0);
  const [field, setField] = useState<Field>("大社跡");
  const [result, setResult] = useState({
    tableA: 0,
    tableB: 0,
    heavenPrep: 0,
    heaven: 0
  });
  return (
    <section className="rounded-xl border border-gray-300 bg-white p-3">
      <h2 className="mb-2 text-lg font-bold">クエストテーブル</h2>
      <div className="grid grid-cols-3 gap-2">
        {FIELDS.map((item) => (
          <label
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
            className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-bold transition-colors duration-200 select-none active:bg-yellow-300"
            onClick={() => {
              setResult(calcTableRates(questCount));
              setQuestCount(questCount + 1);
            }}
          >
            {item}
          </button>
        ))}
      </div>
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
    </section>
  );
};
