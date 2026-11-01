import { useState } from "react";
import { useCount } from "../hooks/useCount";
import { CountUp } from "./CountUp";

export const GedanBell = () => {
  const [num, setNum] = useCount();
  const [totalGames, setTotalGames] = useState("");

  const games = Number(totalGames);
  const probability =
    num > 0 && games > 0 ? `1/${(games / num).toFixed(2)}` : "-";

  return (
    <section className="rounded-xl border border-yellow-300 bg-yellow-50 p-3">
      <h2 className="mb-2 text-lg font-bold">下段ベル</h2>

      <div className="flex flex-wrap items-end gap-3">
        <CountUp onClick={() => setNum()} name="回数" num={num} />

        <label className="flex flex-col text-sm text-gray-600">
          トータルゲーム数
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={totalGames}
            onChange={(e) => setTotalGames(e.target.value)}
            className="mt-1 w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-black"
          />
        </label>

        <p className="text-sm text-gray-600">
          確率
          <span className="block text-xl font-bold text-black">
            {probability}
          </span>
        </p>
      </div>
    </section>
  );
};