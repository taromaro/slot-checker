import { useCount } from "../hooks/useCount";
import { Stepper } from "./Stepper";

const name = "下段ベル"
export const GedanBell = () => {
  const [num, onIncrement, onDecrement, resetNum] = useCount(`${name}`);
  const [totalGames, setTotalGames, , resetTotalGames] = useCount(`${name}-ゲーム数`);

  const games = Number(totalGames);
  const probability = num > 0 && games > 0 ? `1/${(games / num).toFixed(2)}` : "-";

  return (
    <section className="rounded-xl border border-yellow-300 bg-yellow-50 p-3">
      <h2 className="mb-2 text-lg font-bold">{name}</h2>
      <button 
        onClick = {() => {
          resetNum();
          resetTotalGames();
          } 
        }
        className="cursor-pointer rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm text-white select-none hover:bg-red-700 active:bg-red-800 mb-2"
        >
        オールクリア
      </button>
      <div className="flex flex-wrap items-end gap-3">
            <Stepper
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              name="回数"
              num={num}
            />
        <label className="flex flex-col text-sm text-gray-600">
          トータルゲーム数
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={totalGames}
            onChange={(e) => setTotalGames(Number(e.target.value) - totalGames)}
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