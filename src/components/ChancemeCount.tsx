import { useCount } from "../hooks/useCount";
import { usePoint } from "../hooks/usePoint";
import { CountUp } from "./CountUp";

type Props = {
  name: string;
  color: "red" | "green";
};

const colorClass = {
  red: "border-red-200 bg-red-50",
  green: "border-green-200 bg-green-50",
};

export const ChancemeCount = (props: Props) => {
  const { name, color } = props;

  const [point, incrementPoint, results, deside] = usePoint();
  const [nonHakkou, setNonHakkou] = useCount();
  const [hakkou, setHakkou] = useCount();
  const [onePoint, setOnePoint] = useCount();
  const [fifteenPoint, setFifteenPoint] = useCount();

  const total = hakkou + nonHakkou;
  const hakkouRitu = total === 0 ? 0 : (hakkou / total) * 100;

  return (
    <section className={`rounded-xl border p-3 ${colorClass[color]}`}>
      <h2 className="mb-2 text-lg font-bold">{name}</h2>

      <div className="flex flex-wrap gap-2">
        <CountUp
          onClick={() => {
            incrementPoint(1);
            setNonHakkou();
          }}
          name="発光無し"
          num={nonHakkou}
        />
        <CountUp
          onClick={() => {
            incrementPoint(15);
            setHakkou();
          }}
          name="発光"
          num={hakkou}
        />
        <CountUp
          onClick={() => {
            incrementPoint(1);
            setOnePoint();
          }}
          name="1p"
          num={onePoint}
        />
        <CountUp
          onClick={() => {
            incrementPoint(15);
            setFifteenPoint();
          }}
          name="15p"
          num={fifteenPoint}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-base">
          ポイント合計: <span className="text-xl font-bold">{point}</span>
        </p>
        <p className="text-base">
          発光率: <span className="text-xl font-bold">{hakkouRitu.toFixed(1)}%</span>
        </p>
        <button
          onClick={() => deside()}
          className="cursor-pointer rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-red-600 select-none active:bg-red-100"
        >
          ポイントクリア
        </button>
        <ul>
          {results.map((r, i) => ( <li key={i}>{i + 1}回目: {r}</li>))}
        </ul>
      </div>
    </section>
  );
};